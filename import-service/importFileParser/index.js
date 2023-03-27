const AWS = require('aws-sdk');
const csv = require('csv-parser');
const { PassThrough } = require('stream');
const { statusCodeEnum } = require('../utils/statuscode.js');
const { responseString } = require('../utils/strings');
const s3 = new AWS.S3({ region: 'us-east-1' });

module.exports.importFileParser = async event => {
  const { key: sourceKey } = event.Records[0].s3.object;
  const fileName = sourceKey.split('/').pop();
  if (!fileName) {
    return {
      statusCode: statusCodeEnum.BadRequest,
      body: responseString.missingName,
    };
  }
  const sourceParams = {
    Bucket: 'new-aws-node-s3',
    Key: sourceKey,
  };
  const destParams = {
    Bucket: 'new-aws-node-s3',
    Key: `parsed/${fileName}`,
  };

  const s3Stream = s3.getObject(sourceParams).createReadStream();

  const csvStream = s3Stream.pipe(csv());

  const logStream = new PassThrough();
  csvStream.on('data', data => {
    console.log(data);
    logStream.write(data);
  });

  csvStream.on('end', async () => {
    try {
      await s3
        .copyObject({
          CopySource: `new-aws-node-s3/${sourceKey}`,
          Bucket: destParams.Bucket,
          Key: destParams.Key,
        })
        .promise();

      await s3.deleteObject(sourceParams).promise();

      console.log(`Successfully processed ${fileName}`);
      return {
        statusCode: statusCodeEnum.OK,
        body: '',
      };
    } catch (error) {
      console.error(`Failed to move ${fileName} to parsed folder: ${error}`);
      return {
        statusCode: statusCodeEnum.ServerError,
        body: responseString.serverError,
      };
    }
  });

  return {
    statusCode: statusCodeEnum.OK,
    body: logStream,
  };
};
