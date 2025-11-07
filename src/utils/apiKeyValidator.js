const api_keys = process.env.API_KEYS ? JSON.parse(process.env.API_KEYS) : {
    serviceA: 'SERVICE_A_API_KEY_12345',
    serviceB: 'SERVICE_B_API_KEY_67890',
    serviceC: 'SERVICE_C_API_KEY_ABCDE',
};

export const isValidApiKey = (apiKey) => {
    return Object.values(api_keys).includes(apiKey);
};

export const getApiKeyForService = (serviceName) => {
    return api_keys[serviceName];
};