const { User } = require('../models');
const { sendResponse } = require('../helpers/handleResponse');
const {generateJwtToken} = require('../helpers/jwt');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({attributes:["id","name","email","phone","user_type"]});
        sendResponse(res, 200, true, 'Users retrieved successfully', users);
    } catch (error) {
        console.log(error);
        sendResponse(res, 500, false, 'Internal Server Error');
    }
}

exports.getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        if(id === undefined) {
            return sendResponse(res, 400, false, 'User ID is required');
        }
        const user = await User.findByPk(id,{attributes:["id","name","email","phone","user_type"]});
        sendResponse(res, 200, true, 'User retrieved successfully', user);
    } catch (error) {
        sendResponse(res, 500, false, 'Internal Server Error');
    }
}

exports.createUser = async (req, res) => {
    const { name, phone, email, password } = req.body;
    try {
        if(name === undefined || phone === undefined || email === undefined || password === undefined) {
            return sendResponse(res, 400, false, 'All fields are required');
        }
        const newUser = await User.create({ name, phone, email, password });
        sendResponse(res, 201, true, 'User created successfully', newUser);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return sendResponse(res, 400, false, 'User already exists');
        }
        sendResponse(res, 500, false, 'Internal Server Error');
    }
}

exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, phone, email, password, user_type, } = req.body;
    try {
        if(id === undefined) {
            return sendResponse(res, 400, false, 'User ID is required');
        }
        const user = await User.findByPk(id,{attributes:["id","name","email","phone","user_type"]});
        if(!user) {
            return sendResponse(res, 404, false, 'User not found');
        }
        user.name = name;
        user.phone = phone;
        user.email = email;
        user.password = password;
        user.user_type = user_type;
        await user.save();
        sendResponse(res, 200, true, 'User updated successfully', user);
    } catch (error) {
        sendResponse(res, 500, false, 'Internal Server Error');
    }
}

exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        if(id === undefined) {
            return sendResponse(res, 400, false, 'User ID is required');
        }
        const user = await User.findByPk(id);
        if(!user) {
            return sendResponse(res, 404, false, 'User not found');
        }
        await user.destroy();
        sendResponse(res, 200, true, 'User deleted successfully');
    } catch (error) {
        sendResponse(res, 500, false, 'Internal Server Error');
    }
}

exports.loginWithEmailPassword = async (req, res) => {
    const { email, password } = req.body;
    try {
        if(email === undefined || password === undefined) {
            return sendResponse(res, 400, false, 'Email and password are required');
        }
        const user = await User.findOne({ where: { email, password }, attributes:["id","name","email","phone","user_type"] });
        if(!user) {
            return sendResponse(res, 404, false, 'Wrong email or password');
        }
        const token = await generateJwtToken(user.id);
        //update device token
        await user.update({device_token:token});
        sendResponse(res, 200, true, 'User logged in successfully', user);
    } catch (error) {
        console.log(error);
        sendResponse(res, 500, false, 'Internal Server Error');
    }
}

exports.loginWithPhonePassword = async (req, res) => {
    const { phone, password } = req.body;
    try {
        if(phone === undefined || password === undefined) {
            return sendResponse(res, 400, false, 'Phone and password are required');
        }
        const user = await User.findOne({ where: { phone, password },attributes:["id","name","email","phone","user_type"] });
        if(!user) {
            return sendResponse(res, 404, false, 'Wrong phone or password');
        }
        const token = await generateJwtToken(user.id);
        await user.update({device_token:token});
        sendResponse(res, 200, true, 'User logged in successfully', user );
    } catch (error) {
        sendResponse(res, 500, false, 'Internal Server Error');
    }
}
