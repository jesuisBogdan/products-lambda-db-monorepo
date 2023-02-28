'use strict';
const { products } = require('../mockData/mockdata');
const { statusCodeEnum } = require('../utils/statuscode');
const { jsonResponse } = require('../utils/jsonResponse');
const { responseString } = require('../utils/strings');
module.exports.getProductsList = async event => {
  try {
    if (products) {
      return jsonResponse(statusCodeEnum.OK, products);
    } else {
      return jsonResponse(statusCodeEnum.NotFound, responseString.noProducts);
    }
  } catch (err) {
    return jsonResponse(statusCodeEnum.ServerError, err.message);
  }
};
