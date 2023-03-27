const AWS = require('aws-sdk');
const sns = new AWS.SNS({ region: 'us-east-1' });

module.exports.createSns = async event => {
  try {
    const message = {
      message: 'Products succesfully created',
      body: event,
    };
    const params = {
      TopicArn: 'arn:aws:sns:us-east-1:893149911957:emailTopic.fifo',
      Message: JSON.stringify(message),
      Subject: 'Notification from catalogBatchProcess lambda',
    };
    const result = await sns.publish(params).promise();
    return result;
  } catch (error) {
    return error;
  }
};
