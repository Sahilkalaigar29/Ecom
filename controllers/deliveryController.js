const {Order,Product,ProductImages} = require('../models');
const { sendResponse } = require('../helpers/handleResponse');

exports.updateDeliveryStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        if(id === undefined) {
            return sendResponse(res, 400, false, 'Order ID is required');
        }
        const order = await Order.findByPk(id);
        if(!order) {
            return sendResponse(res, 404, false, 'Order not found');
        }
        order.status = status;
        await order.save();
        sendResponse(res, 200, true, 'Order status updated successfully', order);
    } catch (error) {
        sendResponse(res, 500, false, 'Internal Server Error');
    }
}

exports.assignDeliveryPerson = async (req, res) => {
    const { id } = req.params;
    const { delivery_person_id } = req.body;
    try {
        if(id === undefined) {
            return sendResponse(res, 400, false, 'Order ID is required');
        }
        const order = await Order.findByPk(id);
        if(!order) {
            return sendResponse(res, 404, false, 'Order not found');
        }
        order.delivery_person = delivery_person_id;
        await order.save();
        sendResponse(res, 200, true, 'Delivery person assigned successfully', order);
    } catch (error) {
        sendResponse(res, 500, false, 'Internal Server Error');
    }
}