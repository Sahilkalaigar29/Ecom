const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// Define Product Variant images model
const ProductImages = sequelize.define('ProductImages', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  variant_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  image_url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'product_images',
  timestamps: false,
});

module.exports = ProductImages;