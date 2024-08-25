const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Warehouse = require('./warehouseModel');

// Define Order model
const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  order_id : {
    type: DataTypes.STRING,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  variant_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pick_up_lat: {
    type: DataTypes.STRING,
    allowNull: false,
  },
    pick_up_long: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    drop_off_lat: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    drop_off_long: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    warehouse_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    price : {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    delivery_charge : {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    payment_mode: {
        type: DataTypes.ENUM(
            "Cash on Delivery",
            "Paypal",
            "Debit Card / Credit Card",
            "Razorpay"
        ),
        defaultValue :"Cash on Delivery",
        allowNull: false,
    },
    payment_status: {
        type: DataTypes.ENUM(
            "Pending",
            "Paid",
            "Failed"
        ),
        defaultValue :"Pending",
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM(
            "new",
            "dispatched",
            "orderaccepted",
            "processing",
            "outfordelivery",
            "delivered",
            "cancelled",
            "return-request",
            "return-failed",
            "return-success",
            "acceptedbyFE",
        ),
        defaultValue :"new",
        allowNull: false,
    },
    delivery_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    delivery_person : {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
  tableName: 'orders',
  timestamps: false,
});

module.exports = Order;