const responseString = {
  startProcessing: 'CSV file processing started',
  noProducts: 'No products found.',
  serverError: 'Please try again later. Server Error',
  transactionFailed: 'Transaction failed.',
  partialTransaction: 'Partial Success, not all were processed.',
  invalidProduct: 'Id and Count are mandatory to be provided',
  duplicateProduct: 'This product already exists',
  missingName: 'Missing required parameter: name',
};

module.exports = { responseString };
