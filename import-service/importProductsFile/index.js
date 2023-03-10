'use strict';
const { statusCodeEnum } = require('../utils/statuscode.js');
const { responseString } = require('../utils/strings');
const AWS = require('aws-sdk');

const s3 = new AWS.S3();

module.exports.importProductsFile = async event => {
  try {
    const fileName = event.queryStringParameters && event.queryStringParameters.name;
    const bucketName = 'new-aws-node-s3';
    if (!fileName) {
      return {
        statusCode: statusCodeEnum.BadRequest,
        body: responseString.missingName,
      };
    }
    const key = `uploaded/${fileName}`;
    const fiveMinutes = 300;
    const params = {
      Bucket: bucketName,
      Key: key,
      Expires: fiveMinutes,
      ContentType: 'text/csv',
    };

    const url = await s3.getSignedUrlPromise('putObject', params);

    // return {
    //   statusCode: statusCodeEnum.OK,
    //   body: url,
    // };
    return url;
  } catch (error) {
    console.error(error);

    return {
      statusCode: statusCodeEnum.ServerError,
      body: responseString.serverError,
    };
  }
};
