const { catalogBatchProcess } = require('./catalogBatchProcess');
const AWSMock = require('aws-sdk-mock');
const AWS = require('aws-sdk');

describe('catalogBatchProcess', () => {
  beforeEach(() => {
    AWSMock.mock('DynamoDB.DocumentClient', 'transactWrite', (params, callback) => {
      callback(null, {});
    });
  });

  afterEach(() => {
    AWSMock.restore('DynamoDB.DocumentClient');
  });

  it('should process messages and return success message when all messages are processed successfully', async () => {
    const event = {
      Records: [
        { messageId: '1', body: JSON.stringify({ id: '1', count: 10, name: 'Product 1' }) },
        { messageId: '2', body: JSON.stringify({ id: '2', count: 5, name: 'Product 2' }) },
      ],
    };

    const response = await catalogBatchProcess(event);

    expect(response.statusCode).toEqual(201);
    expect(response.body).toEqual('Processed 2 records successfully.');
  });

  it('should process messages and return partial success message when some messages are processed successfully', async () => {
    const event = {
      Records: [
        { messageId: '1', body: JSON.stringify({ id: '1', count: 10, name: 'Product 1' }) },
        { messageId: '2', body: JSON.stringify({ count: 5, name: 'Product 2' }) },
        { messageId: '3', body: JSON.stringify({ id: '3', count: 15, name: 'Product 3' }) },
      ],
    };

    const response = await catalogBatchProcess(event);

    expect(response.statusCode).toEqual(206);
    expect(response.body).toEqual(
      'Processed 2 records successfully. 1 records failed: ["Message 2 has invalid id or count."]'
    );
  });

  it('should return internal server error message when an error occurs', async () => {
    AWSMock.mock('DynamoDB.DocumentClient', 'transactWrite', (params, callback) => {
      callback(new Error('Error'));
    });

    const event = {
      Records: [
        { messageId: '1', body: JSON.stringify({ id: '1', count: 10, name: 'Product 1' }) },
        { messageId: '2', body: JSON.stringify({ id: '2', count: 5, name: 'Product 2' }) },
      ],
    };

    const response = await catalogBatchProcess(event);

    expect(response.statusCode).toEqual(500);
    expect(response.body).toEqual('Internal Server Error');
  });
});
