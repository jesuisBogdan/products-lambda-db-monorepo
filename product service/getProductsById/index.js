const { products } = require('../mockData/mockdata');
const { statusCodeEnum } = require('../utils/statuscode');
const { jsonResponse } = require('../utils/jsonResponse');
const { responseString } = require('../utils/strings');
module.exports.getProductsById = async event => {
  try {
    const { id } = event.path;
    const product = products.find(product => product.id === id);

    if (!product) {
      return jsonResponse(statusCodeEnum.NotFound, responseString.noProducts);
    }

    return jsonResponse(statusCodeEnum.OK, product);
  } catch (error) {
    return jsonResponse(statusCodeEnum.ServerError, event);
  }
};
