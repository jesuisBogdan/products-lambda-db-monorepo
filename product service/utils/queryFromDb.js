const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
const { tables } = require('./tableNameEnum');

const queryDataFromDynamo = async (TABLE_NAME, id) => {
  let queryResults;
  if (TABLE_NAME === tables.products) {
    queryResults = await dynamo
      .query({
        TableName: TABLE_NAME,
        KeyConditionExpression: 'id= :id',
        ExpressionAttributeValues: { ':id': id },
      })
      .promise();
  } else if (TABLE_NAME === tables.stocks) {
    queryResults = await dynamo
      .query({
        TableName: TABLE_NAME,
        KeyConditionExpression: 'product_id= :product_id',
        ExpressionAttributeValues: { ':product_id': id },
      })
      .promise();
  }
  return queryResults.Items;
};

module.exports = { queryDataFromDynamo };
