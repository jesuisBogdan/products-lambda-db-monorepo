const { getProductsList } = require('./index');
const { products } = require('../mockData/mockdata');

describe('We should get product list', () => {
  it('should return 404 status code when no products are found', async () => {
    const mockProducts = null;
    const event = {};
    const expectedResponse = {
      statusCode: 404,
      body: JSON.stringify('No products found.'),
    };

    const response = await getProductsList(event, mockProducts);
    expect(response).toEqual(expectedResponse);
  });

  it('should return 200 status code and list of products when products are found', async () => {
    const event = {};
    const mockProducts = products;
    const expectedResponse = {
      statusCode: 200,
      body: JSON.stringify(mockProducts),
    };
    const response = await getProductsList(event, mockProducts);

    expect(response).toEqual(expectedResponse);
  });
});
