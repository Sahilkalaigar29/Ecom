const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Warehouse = require('./warehouseModel');

// Define ProductQuantity model
const ProductQuantity = sequelize.define('ProductQuantity', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  variant_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'variants', 
      key: 'id',
    },
    allowNull: false,
  },
  warehouse_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'warehouses', 
      key: 'id',
    },
    allowNull: false,
  },
  quantity: {
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
  tableName: 'product_quantities',
  timestamps: false,
});

ProductQuantity.belongsTo(Warehouse, { foreignKey: 'warehouse_id' });

module.exports = ProductQuantity;