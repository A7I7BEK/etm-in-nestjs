export default () =>
{
    return {
        application: {
            nodeEnv: process.env.NODE_ENV,
            nodeEnvProd: process.env.NODE_ENV_PRODUCTION,
            nodeEnvDev: process.env.NODE_ENV_DEVELOPMENT,
            name: process.env.APP_NAME,
            port: +process.env.APP_PORT,
            url: process.env.APP_URL,
            urlFront: process.env.APP_URL_FRONTEND,
            prefix: process.env.API_PREFIX,
        },
        default: {
            lang: process.env.APP_DEFAULT_LANGUAGE,
            role: process.env.APP_DEFAULT_ROLE,
        },
        admin: {
            username: process.env.ADMIN_USERNAME,
            password: process.env.ADMIN_PASSWORD,
        },
        file: {
            maxSize: +process.env.MAX_FILE_SIZE,
            maxCount: +process.env.MAX_FILE_COUNT,
        },
        jwt: {
            accessTokenSecret: process.env.JWT_ACCESS_SECRET,
            refreshTokenSecret: process.env.JWT_REFRESH_SECRET,
            audience: process.env.JWT_TOKEN_AUDIENCE,
            issuer: process.env.JWT_TOKEN_ISSUER,
            accessTokenTtl: +process.env.JWT_ACCESS_TOKEN_TTL,
            refreshTokenTtl: +process.env.JWT_REFRESH_TOKEN_TTL,
        },
        database: {
            host: process.env.DATABASE_HOST,
            port: +process.env.DATABASE_PORT,
            database: process.env.DATABASE_NAME,
            username: process.env.DATABASE_USERNAME,
            password: process.env.DATABASE_PASSWORD,
        },
        redis: {
            host: process.env.REDIS_HOST,
            port: +process.env.REDIS_PORT,
        },
        mail: {
            host: process.env.MAIL_HOST,
            port: +process.env.MAIL_PORT,
            user: process.env.MAIL_USER,
            password: process.env.MAIL_PASSWORD,
            defaultEmail: process.env.MAIL_DEFAULT_EMAIL,
        },
    };
};