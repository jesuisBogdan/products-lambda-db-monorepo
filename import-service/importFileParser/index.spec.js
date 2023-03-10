const AWSMock = require('aws-sdk-mock');
const AWS = require('aws-sdk');
const { importFileParser } = require('./index');

describe('importFileParser', () => {
  const mockEvent = {
    Records: [
      {
        s3: {
          object: {
            key: 'test.csv',
          },
        },
      },
    ],
  };

  beforeEach(() => {
    AWSMock.mock('S3', 'getObject', (params, callback) => {
      callback(null, {
        Body: Buffer.from('test-data'),
      });
    });

    AWSMock.mock('S3', 'copyObject', (params, callback) => {
      callback(null, {});
    });

    AWSMock.mock('S3', 'deleteObject', (params, callback) => {
      callback(null, {});
    });
  });

  afterEach(() => {
    AWSMock.restore('S3');
  });

  it('should return a success response', async () => {
    const result = await importFileParser(mockEvent);

    expect(result.statusCode).toEqual(200);
    expect(result.body).toBeInstanceOf(PassThrough);
  });

  it('should return a bad request response when file name is missing', async () => {
    const badRequestEvent = {
      Records: [
        {
          s3: {
            object: {},
          },
        },
      ],
    };

    const result = await importFileParser(badRequestEvent);

    expect(result.statusCode).toEqual(400);
    expect(result.body).toEqual('Missing file name');
  });

  it('should return a server error response when copyObject fails', async () => {
    AWSMock.mock('S3', 'copyObject', (params, callback) => {
      callback(new Error('Copy object failed'));
    });

    const result = await importFileParser(mockEvent);

    expect(result.statusCode).toEqual(500);
    expect(result.body).toEqual('Server error');
  });

  it('should return a server error response when deleteObject fails', async () => {
    AWSMock.mock('S3', 'deleteObject', (params, callback) => {
      callback(new Error('Delete object failed'));
    });

    const result = await importFileParser(mockEvent);

    expect(result.statusCode).toEqual(500);
    expect(result.body).toEqual('Server error');
  });
});
