'use strict';

const { getProductsById } = require('./index');
const { statusCodeEnum } = require('../utils/statuscode');
const { jsonResponse } = require('../utils/jsonResponse');
const { responseString } = require('../utils/strings');
const { queryDataFromDynamo } = require('../utils/queryFromDb');

const mockEvent = { path: { id: '123' } };
const mockProduct = [{ id: '123', name: 'Test Product', price: 10 }];
const mockStock = [{ id: '123', count: 5 }];
const mockError = new Error('Test error');

const TABLE_PRODUCTS = 'products';
const TABLE_STOCKS = 'stocks';
jest.mock('../utils/queryFromDb');

describe('getProductsById', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return product details and stock count when both are found', async () => {
    queryDataFromDynamo
      .mockImplementationOnce(() => Promise.resolve(mockProduct))
      .mockImplementationOnce(() => Promise.resolve(mockStock));

    const expectedResponse = {
      ...mockProduct[0],
      count: mockStock[0].count,
    };

    const response = await getProductsById(mockEvent);

    expect(queryDataFromDynamo).toHaveBeenCalledTimes(2);
    expect(queryDataFromDynamo).toHaveBeenCalledWith(undefined, '123');
    expect(queryDataFromDynamo).toHaveBeenCalledWith(undefined, '123');
    expect(jsonResponse).toHaveBeenCalledWith(statusCodeEnum.OK, expectedResponse);
    expect(response).toEqual(jsonResponse(statusCodeEnum.OK, expectedResponse));
  });

  it('should return 404 status when either product or stock data is missing', async () => {
    queryDataFromDynamo
      .mockImplementationOnce(() => Promise.resolve(mockProduct))
      .mockImplementationOnce(() => Promise.resolve(undefined));

    const expectedResponse = jsonResponse(statusCodeEnum.NotFound, responseString.noProductFound);

    const response = await getProductsById(mockEvent);

    expect(queryDataFromDynamo).toHaveBeenCalledTimes(2);
    expect(queryDataFromDynamo).toHaveBeenCalledWith(TABLE_PRODUCTS, '123');
    expect(queryDataFromDynamo).toHaveBeenCalledWith(TABLE_STOCKS, '123');
    expect(jsonResponse).toHaveBeenCalledWith(
      statusCodeEnum.NotFound,
      responseString.noProductFound
    );
    expect(response).toEqual(expectedResponse);
  });

  it('should return 500 status when queryDataFromDynamo throws an error', async () => {
    queryDataFromDynamo.mockImplementationOnce(() => Promise.reject(mockError));

    const expectedResponse = jsonResponse(statusCodeEnum.ServerError, mockError.message);

    const response = await getProductsById(mockEvent);

    expect(queryDataFromDynamo).toHaveBeenCalledTimes(1);
    expect(queryDataFromDynamo).toHaveBeenCalledWith(TABLE_PRODUCTS, '123');
    expect(jsonResponse).toHaveBeenCalledWith(statusCodeEnum.ServerError, mockError.message);
    expect(response).toEqual(expectedResponse);
  });
});
