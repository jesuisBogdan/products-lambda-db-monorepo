const jsonResponse = (statusCode, response) => {
  return {
    statusCode,
    body: JSON.stringify(response),
  };
};

module.exports = { jsonResponse };
