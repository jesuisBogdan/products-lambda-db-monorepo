const { basicAuthorizer } = require('./index');

describe('basicAuthorizer', () => {
  const mockEvent = {
    authorizationToken: 'Basic dXNlcm5hbWU6cGFzc3dvcmQ=',
  };

  const mockContext = {};

  it('should allow access when credentials are valid', async () => {
    const result = await basicAuthorizer(mockEvent, mockContext);
    expect(result).toEqual({
      principalId: 'username',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*',
          },
        ],
      },
    });
  });

  it('should deny access when authorization header is missing', async () => {
    const event = { ...mockEvent, authorizationToken: undefined };
    const result = await basicAuthorizer(event, mockContext);
    expect(result).toEqual({
      principalId: undefined,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*',
          },
        ],
      },
    });
  });

  it('should deny access when credentials are invalid', async () => {
    const event = { ...mockEvent, authorizationToken: 'Basic dXNlcm5hbWU6cGFzc3dvcmQyMw==' };
    const result = await basicAuthorizer(event, mockContext);
    expect(result).toEqual({
      principalId: undefined,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*',
          },
        ],
      },
    });
  });
});
