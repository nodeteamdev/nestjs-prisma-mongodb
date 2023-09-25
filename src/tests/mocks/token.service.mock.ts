const mockTokenService = {
  sign: jest.fn(),
  getAccessTokenFromWhitelist: jest.fn(),
  refreshTokens: jest.fn(),
  logout: jest.fn(),
};

export default mockTokenService;
