const {Product, Variant,ProductQuantity,ProductImages,sequelize } = require('../models');
const { sendResponse } = require('../helpers/handleResponse');
const { Op } = require('sequelize');

exports.getAllProducts = async (req, res) => {
  try {
    // select product and join with variant and product quantity
    const products = await Product.findAll({ include: [{ model: Variant,attributes: ['id', 'name', 'price','minimum_order_quantity'], include:{model: ProductQuantity,attributes: ['id', 'quantity', 'warehouse_id']}, include : {model:ProductImages,attributes: ['id', 'image_url']} }], attributes: ["id","name","description","Variants.name"] });
    sendResponse(res, 200, true, 'Products retrieved successfully', products);
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, false, 'Internal Server Error');
  }
};

exports.getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    // const product = await Product.findOne({ where: { id }, include: [{ model: Variant, include: ProductQuantity }] });
    const product = await Product.findOne({ where: { id }, include: [{ model: Variant,attributes: ['id', 'name', 'price','minimum_order_quantity'], include:{model: ProductQuantity,attributes: ['id', 'quantity', 'warehouse_id']}, include : {model:ProductImages,attributes: ['id', 'image_url']} }], attributes: ["id","name","description","Variants.name"] });
    if (!product) {
      return sendResponse(res, 404, false, 'Product not found');
    }
    sendResponse(res, 200, true, 'Product retrieved successfully', product);
  } catch (error) {
    sendResponse(res, 500, false, 'Internal Server Error');
  }
};

exports.createProduct = async (req, res) => {
  const { name, description, category_id,variants } = req.body;
  try {
    if (name === undefined || category_id === undefined) {
      return sendResponse(res, 400, false, 'Product name and category_id are required');
    }
    const product = await Product.findOne({ where: { name } });
    if (product) {
      return sendResponse(res, 400, false, 'Product name already exists');
    }
    const newProduct = await Product.create({ name, description, category_id });
    if(variants){
      variants.forEach(async (variant) => {
        let variantNew = await Variant.create({product_id:newProduct.id,name:variant.name,price:variant.price,minimum_order_quantity:variant.minimum_order_quantity});
        await ProductQuantity.create({variant_id:variantNew.id,warehouse_id:variant.warehouse_id,quantity:variant.quantity});
      });
    }
    sendResponse(res, 201, true, 'Product created successfully', newProduct);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// exports.createProducts = async (req, res) => {
//   const products = req.body;
//   try {
//     if (products.length === 0) {
//       return sendResponse(res, 400, false, 'Products are required');
//     }
//     for (let i = 0; i < products.length; i++) {
//       const { name, description, category_id, variants } = products[i];
//       if (name === undefined || category_id === undefined) {
//         return sendResponse(res, 400, false, 'Product name and category_id are required');
//       }
//       const product = await Product.findOne({ where: { name } });
//       if (product) {
//         return sendResponse(res, 400, false, 'Product name already exists');
//       }
//       const newProduct = await Product.create({ name, description, category_id });
//       if (variants) {
//         for (let j = 0; j < variants.length; j++) {
//           const { name, price, minimum_order_quantity, warehouse_id, quantity } = variants[j];
//           if (name === undefined || price === undefined || minimum_order_quantity === undefined || warehouse_id === undefined || quantity === undefined) {
//             return sendResponse(res, 400, false, 'Variant name, price, minimum_order_quantity, warehouse_id, and quantity are required');
//           }
//           const variant = await Variant.create({ product_id: newProduct.id, name, price, minimum_order_quantity });
//           await ProductQuantity.create({ variant_id: variant.id, warehouse_id, quantity });
//           await ProductImages.create({ variant_id: variant.id, image_url: variants[j].image_url });
//         }
//       }
//     }
//     sendResponse(res, 201, true, 'Products created successfully');
//   } catch (error) {
//     sendResponse(res, 500, false, 'Internal Server Error');
//   }
// }

exports.createProducts = async (req, res) => {
  const products = req.body;

  if (!Array.isArray(products) || products.length === 0) {
    return sendResponse(res, 400, false, 'Products are required');
  }

  const newProducts = [];
  const variantsToCreate = [];
  const quantitiesToCreate = [];
  const imagesToCreate = [];

  try {
    // Validate and prepare data
    for (const product of products) {
      const { name, description, category_id, variants } = product;
      
      if (!name || category_id === undefined) {
        return sendResponse(res, 400, false, 'Product name and category_id are required');
      }

      // Collect product data
      newProducts.push({ name, description, category_id });

      if (variants) {
        for (const variant of variants) {
          const { name, price, minimum_order_quantity, warehouse_id, quantity, image_url } = variant;

          if (name === undefined || price === undefined || minimum_order_quantity === undefined || warehouse_id === undefined || quantity === undefined) {
            return sendResponse(res, 400, false, 'Variant name, price, minimum_order_quantity, warehouse_id, and quantity are required');
          }

          // Collect variant data
          variantsToCreate.push({ name, price, minimum_order_quantity });

          // Collect quantities and images data
          quantitiesToCreate.push({ warehouse_id, quantity, name }); // `name` for mapping later
          if (image_url) {
            imagesToCreate.push({ image_url, name }); // `name` for mapping later
          }
        }
      }
    }

    // Check for existing products
    const existingProducts = await Product.findAll({
      where: {
        name: {
          [Op.in]: newProducts.map(p => p.name)
        }
      }
    });

    const existingProductNames = new Set(existingProducts.map(p => p.name));
    if (existingProductNames.size > 0) {
      return sendResponse(res, 400, false, 'One or more product names already exist');
    }

    // Start transaction
    const transaction = await sequelize.transaction();
    try {
      // Create products in bulk
      const createdProducts = await Product.bulkCreate(newProducts, { transaction });
      const productIdMap = new Map(createdProducts.map(p => [p.name, p.id]));

      // Create variants with correct product IDs
      const variantsToCreateWithProductId = variantsToCreate.map(variant => ({
        ...variant,
        product_id: createdProducts[0].id
      }));

      const createdVariants = await Variant.bulkCreate(variantsToCreateWithProductId, { transaction });
      const variantIdMap = new Map(createdVariants.map(v => [v.name, v.id]));

      // Create product quantities and images with correct variant IDs
      const quantitiesToCreateWithVariantId = quantitiesToCreate.map(q => ({
        ...q,
        variant_id: variantIdMap.get(q.name)
      }));

      const imagesToCreateWithVariantId = imagesToCreate.map(img => ({
        ...img,
        variant_id: variantIdMap.get(img.name)
      }));

      await Promise.all([
        ProductQuantity.bulkCreate(quantitiesToCreateWithVariantId, { transaction }),
        ProductImages.bulkCreate(imagesToCreateWithVariantId, { transaction })
      ]);

      await transaction.commit();
      sendResponse(res, 201, true, 'Products created successfully');
    } catch (error) {
      await transaction.rollback();
      console.error('Error creating products:', error);
      sendResponse(res, 500, false, 'Internal Server Error');
    }
  } catch (error) {
    console.error('Error during product creation:', error);
    sendResponse(res, 500, false, 'Internal Server Error');
  }
};


