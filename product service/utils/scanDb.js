const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

const scanDataFromDynamo = async TABLE_NAME => {
  const data = await dynamo
    .scan({
      TableName: TABLE_NAME,
    })
    .promise();
  return data.Items;
};

module.exports = { scanDataFromDynamo };
