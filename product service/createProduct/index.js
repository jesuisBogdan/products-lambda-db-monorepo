const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
const { statusCodeEnum } = require('../utils/statuscode');
const { jsonResponse } = require('../utils/jsonResponse');
const { responseString } = require('../utils/strings');
const { generateUpdateQuery } = require('../utils/updateQuery');
const TABLE_PRODUCTS = process.env.TABLE_PRODUCTS;
const TABLE_STOCKS = process.env.TABLE_STOCKS;

module.exports.createProduct = async event => {
  try {
    const { id, count, ...productFields } = JSON.parse(event.body);

    if (!id || !count) {
      console.log('Id or count was not found in the body of the request.');
      return jsonResponse(statusCodeEnum.BadRequest, responseString.invalidProduct);
    }

    const productFieldsExpression = generateUpdateQuery(productFields);
    const stockFieldsExpression = generateUpdateQuery({ count });

    const transaction = await dynamo
      .transactWrite({
        TransactItems: [
          {
            Put: {
              TableName: TABLE_PRODUCTS,
              Item: {
                id,
                ...productFieldsExpression,
              },
              ConditionExpression: 'attribute_not_exists(id)',
              ReturnValuesOnConditionCheckFailure: 'ALL_OLD',
            },
          },
          {
            Put: {
              TableName: TABLE_STOCKS,
              Item: {
                product_id: id,
                ...stockFieldsExpression,
              },
              ConditionExpression: 'attribute_not_exists(product_id)',
              ReturnValuesOnConditionCheckFailure: 'ALL_OLD',
            },
          },
        ],
      })
      .promise();

    if (transaction && transaction.UnprocessedItems && transaction.UnprocessedItems.length > 0) {
      return jsonResponse(statusCodeEnum.ServerError, responseString.partialTransaction);
    }
    console.log(
      `Created new entry in products and stocks tables in DynamoDB with id:${id}, count: ${count}`
    );
    return jsonResponse(statusCodeEnum.Created, transaction);
  } catch (err) {
    if (err.code === 'ConditionalCheckFailedException') {
      return jsonResponse(statusCodeEnum.Conflict, responseString.duplicateProduct);
    }
    return jsonResponse(statusCodeEnum.ServerError, err.message);
  }
};
