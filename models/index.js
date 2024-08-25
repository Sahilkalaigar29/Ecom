const sequelize = require('../config/db');
const User = require('./userModel');
const Category = require('./categoryModel');
const Product = require('./productModel');
const Variant = require('./variantModel');
const ProductImages = require('./productImagesModel');
const Warehouse = require('./warehouseModel');
const ProductQuantity = require('./productQuantityModel');
const Order = require('./orderModel');

Product.belongsTo(Category, { foreignKey: 'category_id' });
Product.hasMany(ProductImages, { foreignKey: 'product_id' });
Product.hasMany(Variant, { foreignKey: 'product_id' });
Variant.hasMany(ProductImages, { foreignKey: 'variant_id' });
Variant.hasMany(ProductQuantity, { foreignKey: 'variant_id' });
Warehouse.hasMany(ProductQuantity, { foreignKey: 'warehouse_id' });
ProductImages.belongsTo(Variant, { foreignKey: 'variant_id' });
ProductQuantity.belongsTo(Variant, { foreignKey: 'variant_id' });
ProductQuantity.belongsTo(Warehouse, { foreignKey: 'warehouse_id' });
Order.belongsTo(User, { foreignKey: 'user_id' });
Order.belongsTo(Variant, { foreignKey: 'variant_id' });
Order.belongsTo(Warehouse, { foreignKey: 'warehouse_id' });
ProductQuantity.belongsTo(Product, { foreignKey: 'product_id' });


// Sync all models with the database
sequelize.sync()
  .then(() => console.log('Database & tables created!'))
  .catch((err) => console.error('Error syncing database:', err));

module.exports = { User, Category, Product, Variant, ProductImages, Warehouse,ProductQuantity,Order,sequelize };
