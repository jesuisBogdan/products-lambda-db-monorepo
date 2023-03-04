'use strict';
const { statusCodeEnum } = require('../utils/statuscode');
const { jsonResponse } = require('../utils/jsonResponse');
const { responseString } = require('../utils/strings');
const { queryDataFromDynamo } = require('../utils/queryFromDb');
const TABLE_PRODUCTS = process.env.TABLE_PRODUCTS;
const TABLE_STOCKS = process.env.TABLE_STOCKS;

module.exports.getProductsById = async event => {
  try {
    const { id } = event.path;
    const product = await queryDataFromDynamo(TABLE_PRODUCTS, id);
    const stock = await queryDataFromDynamo(TABLE_STOCKS, id);
    if (!product || !stock) {
      return jsonResponse(statusCodeEnum.NotFound, responseString.noProductFound);
    }
    console.log(`Found item in table for id: ${id}`);
    const response = {
      ...product[0],
      count: stock[0].count,
    };
    console.log(`Found this in DynamoDB: ${response}`);
    return response;
    // return jsonResponse(statusCodeEnum.OK, response);
  } catch (err) {
    return jsonResponse(statusCodeEnum.ServerError, err.message);
  }
};
