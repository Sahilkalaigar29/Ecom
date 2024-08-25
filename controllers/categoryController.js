const { Category } = require('../models');
const { sendResponse } = require('../helpers/handleResponse');

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    sendResponse(res, 200, true, 'Categories retrieved successfully', categories);
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, false, 'Internal Server Error');
  }
};

exports.getCategoryById = async (req, res) => {
  const { id } = req.params;
  try {
    if(id === undefined) {
      return sendResponse(res, 400, false, 'Category ID is required');
    }
    const category = await Category.findByPk(id);
    sendResponse(res, 200, true, 'Category retrieved successfully', category);
  } catch (error) {
    sendResponse(res, 500, false, 'Internal Server Error');
  }
};

exports.createCategory = async (req, res) => {
  const { name } = req.body;
  try {
    if(name === undefined) {
      return sendResponse(res, 400, false, 'Category name is required');
    }
    const newCategory = await Category.create({ name });
    sendResponse(res, 201, true, 'Category created successfully', newCategory);
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, false, 'Internal Server Error');
  }
}
