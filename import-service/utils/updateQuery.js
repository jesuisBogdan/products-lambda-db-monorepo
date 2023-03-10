const generateUpdateQuery = fields => {
  let updatedExpression = {
    UpdateExpression: 'set',
    ExpressionAttributeNames: {},
    ExpressionAttributeValues: {},
  };
  Object.entries(fields).forEach(([key, item]) => {
    updatedExpression.UpdateExpression += ` #${key} = :${key},`;
    updatedExpression.ExpressionAttributeNames[`#${key}`] = key;
    updatedExpression.ExpressionAttributeValues[`:${key}`] = item;
  });
  updatedExpression.UpdateExpression = updatedExpression.UpdateExpression.slice(0, -1);
  return updatedExpression;
};

module.exports = { generateUpdateQuery };
