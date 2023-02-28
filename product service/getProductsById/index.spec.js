const { getProductsById } = require('./index');
const { products } = require('../mockData/mockdata');

describe('Get Products By Id', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 404 status code when product is not found', async () => {
    const event = {
      pathParameters: { id: 'nonexistent-id' },
    };

    const expectedResponse = {
      statusCode: 404,
      body: JSON.stringify('No products found.'),
    };

    const response = await getProductsById(event);

    expect(response).toEqual(expectedResponse);
  });

  it('should return 200 status code and product details when product is found', async () => {
    const productId = '1';
    const event = {
      pathParameters: { id: productId },
    };

    const mockProduct = {
      id: productId,
      name: 'Product 1',
      price: 10,
    };

    const expectedResponse = {
      statusCode: 200,
      body: JSON.stringify(mockProduct),
    };

    const response = await getProductsById(event);

    expect(response).toEqual(expectedResponse);
  });

  it('should return 500 status code when an error occurs', async () => {
    const event = {
      pathParameters: { id: '1' },
    };
    const expectedResponse = {
      statusCode: 500,
      body: JSON.stringify('Test error'),
    };

    jest.spyOn(products, 'find').mockImplementation(() => {
      throw new Error('Test error');
    });

    const response = await getProductsById(event);

    expect(response).toEqual(expectedResponse);
  });
});
