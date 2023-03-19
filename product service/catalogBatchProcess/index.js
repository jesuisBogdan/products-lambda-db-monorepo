const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
const { statusCodeEnum } = require('../utils/statuscode');
const { jsonResponse } = require('../utils/jsonResponse');
const { responseString } = require('../utils/strings');
const { generateUpdateQuery } = require('../utils/updateQuery');
const TABLE_PRODUCTS = process.env.TABLE_PRODUCTS;
const TABLE_STOCKS = process.env.TABLE_STOCKS;

module.exports.catalogBatchProcess = async event => {
  try {
    const promises = event.Records.map(async message => {
      try {
        const { id, count, ...productFields } = JSON.parse(message.body);

        if (!id || !count) {
          throw new Error(`Message ${message.messageId} has invalid id or count.`);
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

        console.log(
          `Processed message ${message.messageId} successfully. Transaction:`,
          transaction
        );

        return {
          message: `Message ${message.messageId} was processed successfully.`,
          success: true,
        };
      } catch (err) {
        console.error(
          `An error occurred while processing message ${message.messageId}: ${err.message}`
        );

        return {
          message: err.message,
          success: false,
        };
      }
    });

    const results = await Promise.all(promises);

    const processedCount = results.filter(result => result.success).length;
    const failedRecords = results.filter(result => !result.success);

    if (failedRecords.length > 0) {
      return jsonResponse(
        statusCodeEnum.PartialSuccess,
        `Processed ${processedCount} records successfully. ${
          failedRecords.length
        } records failed: ${JSON.stringify(failedRecords.map(record => record.message))}`
      );
    } else {
      return jsonResponse(
        statusCodeEnum.Created,
        `Processed ${processedCount} records successfully.`
      );
    }
  } catch (err) {
    console.error(`An error occurred: ${err.message}`);
    return jsonResponse(statusCodeEnum.ServerError, responseString.internalServerError);
  }
};
