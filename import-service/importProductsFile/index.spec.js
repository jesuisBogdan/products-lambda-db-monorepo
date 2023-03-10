const AWSMock = require('aws-sdk-mock');
const { importProductsFile } = require('./index');
const { statusCodeEnum } = require('../../product service/utils/statuscode');

describe('importProductsFile', () => {
  const event = { queryStringParameters: { name: 'test.csv' } };
  const bucketName = 'my-bucket-name';

  afterEach(() => {
    AWSMock.restore();
  });

  it('should return a signed URL for a valid file name', async () => {
    const expectedUrl =
      'https://new-aws-node-s3.s3.amazonaws.com/uploaded/test.csv?AWSAccessKeyId=AKIA4747CDOKWJHPJJCA&Content-Type=text%2Fcsv&Expires=1678357398&Signature=46I2b5Z31JfDa2F7b52X1W0fBPw%3D';
    AWSMock.mock('S3', 'getSignedUrlPromise', (_method, params, callback) => {
      expect(params).toEqual({
        Bucket: bucketName,
        Key: `uploaded/${event.queryStringParameters.name}`,
        Expires: 3600,
        ContentType: 'text/csv',
      });
      callback(null, expectedUrl);
    });

    const result = await importProductsFile(event);

    expect(typeof result).toBe('string');
  });

  it('should return a 400 Bad Request error for a missing file name', async () => {
    const invalidEvent = { queryStringParameters: {} };
    const expectedError = {
      statusCode: statusCodeEnum.BadRequest,
      body: 'Missing required parameter: name',
    };

    const result = await importProductsFile(invalidEvent);

    expect(result).toEqual(expectedError);
  });

  it('should return a 500 Internal Server Error for any other error', async () => {
    const expectedError = {
      statusCode: statusCodeEnum.ServerError,
      body: 'Internal server error',
    };
    AWSMock.mock('S3', 'getSignedUrlPromise', (_method, _params, callback) => {
      callback(new Error('mock error'));
    });

    const result = await importProductsFile(event);

    expect(typeof result).toEqual('string');
  });
});
