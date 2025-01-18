export const configKeys = {
  corsCommaSeperatedDomainWhitelist: 'CORS_COMMA_SEPERATED_DOMAIN_WHITELIST',
};

export const DEFAULT_PAGINATION_PAGE = 1;
export const DEFAULT_PAGINATION_LIMIT = 20;

export const DEFAULT_CORS_OPTIONS = {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
  allowedHeaders: ['Content-Type', 'Origin', 'X-Requested-With', 'Accept', 'Cookie'],
  credentials: true,
};
