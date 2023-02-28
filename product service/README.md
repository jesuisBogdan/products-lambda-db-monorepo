Test the lambdas:
getProductsById: https://j351e5rjof.execute-api.us-east-1.amazonaws.com/dev/products/{id}
{id} = number between 1-20 will return a 200 response.
getProductList: https://j351e5rjof.execute-api.us-east-1.amazonaws.com/dev/products

Install dependencies: npm ci
Run linter: npm run lint
Run prettier: npm run prettier
Run unit test: npm run test:unit
