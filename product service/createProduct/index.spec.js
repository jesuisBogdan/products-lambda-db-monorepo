// const { getProductsById } = require('./index.js');
// const { queryDataFromDynamo } = require('../utils/queryFromDb');
// const { tables } = require('../utils/tableNameEnum');
// const { statusCodeEnum } = require('../utils/statuscode');

// describe('getProductById', () => {
//   const mockProduct = { id: '123', name: 'Mock Product' };
//   const mockStock = { id: '123', count: 10 };
//   const mockEvent = { path: { id: '123' } };

//   afterEach(() => {
//     jest.restoreAllMocks();
//   });

//   it('should return a product with stock count when found', async () => {
//     jest.spyOn(queryDataFromDynamo, 'mockReturnValueOnce([mockProduct])');
//     jest.spyOn(queryDataFromDynamo, 'mockReturnValueOnce([mockStock])');

//     const response = await getProductsById(mockEvent);

//     expect(queryDataFromDynamo).toHaveBeenCalledWith(tables.products, '123');
//     expect(queryDataFromDynamo).toHaveBeenCalledWith(tables.stocks, '123');
//     expect(response.statusCode).toBe(statusCodeEnum.OK);
//     expect(response.body).toEqual({
//       ...mockProduct,
//       count: mockStock.count,
//     });
//   });

//   it('should return 404 when product is not found', async () => {
//     jest.spyOn(queryDataFromDynamo, 'mockReturnValueOnce(null)');
//     jest.spyOn(queryDataFromDynamo, 'mockReturnValueOnce([mockStock])');

//     const response = await getProductsById(mockEvent);

//     expect(queryDataFromDynamo).toHaveBeenCalledWith(tables.products, '123');
//     expect(queryDataFromDynamo).not.toHaveBeenCalledWith(tables.stocks, '123');
//     expect(response.statusCode).toBe(statusCodeEnum.NotFound);
//     expect(response.body).toEqual({ message: responseString.noProductFound });
//   });

//   it('should return 404 when stock is not found', async () => {
//     jest.spyOn(queryDataFromDynamo, 'mockReturnValueOnce([mockProduct])');
//     jest.spyOn(queryDataFromDynamo, 'mockReturnValueOnce(null)');

//     const response = await getProductsById(mockEvent);

//     expect(queryDataFromDynamo).toHaveBeenCalledWith(tables.products, '123');
//     expect(queryDataFromDynamo).toHaveBeenCalledWith(tables.stocks, '123');
//     expect(response.statusCode).toBe(statusCodeEnum.NotFound);
//     expect(response.body).toEqual({ message: responseString.noProductFound });
//   });

//   it('should return 500 when there is an error', async () => {
//     jest.spyOn(queryDataFromDynamo, 'mockRejectedValueOnce(new Error("Failed to query DynamoDB"))');

//     const response = await getProductsById(mockEvent);

//     expect(queryDataFromDynamo).toHaveBeenCalledWith(tables.products, '123');
//     expect(response.statusCode).toBe(statusCodeEnum.ServerError);
//     expect(response.body).toEqual({ message: 'Failed to query DynamoDB' });
//   });
// });
