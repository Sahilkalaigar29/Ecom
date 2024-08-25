const { Warehouse } = require('../models');
const { sendResponse } = require('../helpers/handleResponse');

exports.getAllWarehouses = async (req, res) => {
    try {
        const warehouses = await Warehouse.findAll();
        sendResponse(res, 200, true, 'Warehouses retrieved successfully', warehouses);
    } catch (error) {
        sendResponse(res, 500, false, 'Internal Server Error');
    }
}

exports.createWarehouse = async (req, res) => {
    const { name, address, phone, lat, long } = req.body;
    try {
        if (name === undefined || address === undefined || phone === undefined || lat === undefined || long === undefined) {
            return sendResponse(res, 400, false, 'Warehouse name, address, phone, lat, and long are required');
        }
        const newWarehouse = await Warehouse.create({ name, address, phone, lat, long });
        sendResponse(res, 201, true, 'Warehouse created successfully', newWarehouse);
    } catch (error) {
        console.log(error);
        sendResponse(res, 500, false, 'Internal Server Error');
    }
}