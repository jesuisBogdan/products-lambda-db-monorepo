'use strict';
const { statusCodeEnum } = require('../utils/statuscode');
const { jsonResponse } = require('../utils/jsonResponse');
const { responseString } = require('../utils/strings');
const { scanDataFromDynamo } = require('../utils/scanDb');

module.exports.getProductsList = async event => {
  try {
    const stocks = await scanDataFromDynamo(process.env.STOCKS_TABLE);
    const products = await scanDataFromDynamo(process.env.PRODUCTS_TABLE);
    if (!products || !stocks) {
      return jsonResponse(statusCodeEnum.NotFound, responseString.noProducts);
    }
    products.forEach(product => {
      product['count'] = stocks.find(elem => elem.product_id === product.id).count;
    });
    console.log(`got the products list, there it is: ${products}`);
    return products;
    // return jsonResponse(statusCodeEnum.OK, products);
  } catch (err) {
    return jsonResponse(statusCodeEnum.ServerError, err.message);
  }
};
