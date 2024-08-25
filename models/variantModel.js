const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Product = require('./productModel');

// Define Variant model
const Variant = sequelize.define('Variant', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  product_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'products', 
      key: 'id',
    },
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL,
    allowNull: false,
  },
  minimum_order_quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'variants',
  timestamps: false,
});

Variant.belongsTo(Product, { foreignKey: 'product_id' });

module.exports = Variant;