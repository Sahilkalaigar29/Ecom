const { Order,ProductQuantity,Variant,sequelize,Product } = require('../models');
const { sendResponse } = require('../helpers/handleResponse');

exports.createOrder = async (req, res) => {
  const {
    user_id, variant_id, quantity, address, pick_up_lat, pick_up_long,
    drop_off_lat, drop_off_long, warehouse_id, price, delivery_charge, payment_mode
  } = req.body;

  // Validate input fields
  if (
    user_id === undefined || variant_id === undefined || quantity === undefined ||
    address === undefined || pick_up_lat === undefined || pick_up_long === undefined ||
    drop_off_lat === undefined || drop_off_long === undefined || warehouse_id === undefined ||
    price === undefined || delivery_charge === undefined || payment_mode === undefined
  ) {
    return sendResponse(res, 400, false, 'All fields are required');
  }

  // Start a transaction
  const transaction = await sequelize.transaction();

  try {
    // Fetch variant and product quantity in a single query using `findOne` with `include`
    const [variant, productQuantity] = await Promise.all([
      Variant.findByPk(variant_id),
      ProductQuantity.findOne({ where: { variant_id, warehouse_id }, transaction })
    ]);

    // Check if the variant exists
    if (!variant) {
      await transaction.rollback();
      return sendResponse(res, 400, false, 'Variant not found');
    }

    // Validate the quantity
    if (quantity < variant.minimum_order_quantity) {
      await transaction.rollback();
      return sendResponse(res, 400, false, `Quantity must be greater than ${variant.minimum_order_quantity} minimum order quantity`);
    }

    // Check product quantity
    if (!productQuantity || productQuantity.quantity < quantity) {
      await transaction.rollback();
      return sendResponse(res, 400, false, 'Quantity is not available in stock');
    }

    // generate order id 
    const order_id = Math.floor(100000 + Math.random() * 900)

    // Create the order
    const newOrder = await Order.create({
      user_id, order_id,variant_id, quantity, address, pick_up_lat, pick_up_long,
      drop_off_lat, drop_off_long, warehouse_id, price, delivery_charge, payment_mode,delivery_date: new Date(),created_at: new Date()
    }, { transaction });

    // Update product quantity
    productQuantity.quantity -= quantity;
    await productQuantity.save({ transaction });

    // Commit the transaction
    await transaction.commit();

    sendResponse(res, 201, true, 'Order created successfully', newOrder);
  } catch (error) {
    // Rollback the transaction in case of error
    await transaction.rollback();
    console.error('Error creating order:', error);
    sendResponse(res, 500, false, 'Internal Server Error');
  }
};

exports.getOrders = async (req, res) => {
  try { 
    const orders = await Order.findAll({
      include: [
        { model: Variant ,include: [Product]},
      ]
    });
    sendResponse(res, 200, true, 'Orders retrieved successfully', orders);
  }catch (error) {
    console.log(error);
    sendResponse(res, 500, false, 'Internal Server Error');
  }
};



