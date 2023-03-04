Test the lambdas:

- [getProductsById] - GET - https://j351e5rjof.execute-api.us-east-1.amazonaws.com/dev/products/{id}
- [getProductsList] - GET - https://j351e5rjof.execute-api.us-east-1.amazonaws.com/dev/products
- [createProduct] - POST - https://j351e5rjof.execute-api.us-east-1.amazonaws.com/dev/products

CloudFront url:

- [CloudFrontURL](https://d1az8b529k2h4g.cloudfront.net)

  Install dependencies: npm ci
  Run linter: npm run lint
  Run prettier: npm run prettier
  Run unit test: npm run test:unit
