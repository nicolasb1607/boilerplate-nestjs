import * as Joi from 'joi';

export const validationSchema = Joi.object({
    //APP
    BACKEND_PORT: Joi.number().required(),
    DEVELOPMENT_MODE: Joi.bool().optional().default(false),

    //FRONTEND
    FRONT_END_URL: Joi.string().required(),
    //DATABASE
    DATABASE_CONTAINER_NAME: Joi.string().optional(),
    DATABASE_HOST: Joi.string().required(),
    DATABASE_PORT: Joi.number().required(),
    DATABASE_USER: Joi.string().required(),
    DATABASE_PASSWORD: Joi.string().required(),
    DATABASE_NAME: Joi.string().required(),
    SSL_CONNECTION: Joi.boolean().optional().default(false),
    //JWT
    JWT_SECRET: Joi.string().required(),
    ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().optional().default('1h'),
    REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().optional().default('1w'),
    //OPEN AI
    OPEN_AI_API_KEY: Joi.string().required(),
    OPEN_AI_MODEL: Joi.string().required(),
    OPEN_AI_EMBEDDING_MODEL: Joi.string().required(),
    OPEN_AI_EMBEDDING_DIMENSIONS: Joi.number().required(),
    OPEN_AI_TEMPERATURE: Joi.number().optional().default(1),
    OPEN_AI_MAX_TOKEN: Joi.string().required(),
    OPEN_AI_ENCODING_FORMAT: Joi.string()
        .valid('float', 'base64')
        .optional()
        .default('float'),
    //AWS
    AWS_ACCESS_KEY_ID: Joi.string().required(),
    AWS_SECRET_ACCESS_KEY: Joi.string().required(),
    AWS_REGION: Joi.string().required(),
    BUCKET_NAME: Joi.string().required(),
    //REDIS
    REDIS_CONTAINER_NAME: Joi.string().optional(),
    REDIS_HOST: Joi.string().required(),
    REDIS_PORT: Joi.number().required(),
    REDIS_PASSWORD: Joi.string().required(),
    //SWAGGER
    ENABLE_SWAGGER: Joi.bool().required(),
    //GOOGLE
    GOOGLE_API_KEY: Joi.string().required(),
    GOOGLE_CUSTOM_SEARCH_ENGINE_ID: Joi.string().required(),
    GOOGLE_CLIENT_ID: Joi.string().required(),
    GOOGLE_CLIENT_SECRET: Joi.string().required(),
    GOOGLE_CALLBACK_URL: Joi.string().required(),
    //PEXELS
    PEXELS_API_KEY: Joi.string().required(),
});
