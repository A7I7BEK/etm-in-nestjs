export default () =>
{
    return {
        production: 'production',
        development: 'development',
        application: {
            nodeEnv: process.env.NODE_ENV,
            port: +process.env.APP_PORT,
            name: process.env.APP_NAME,
            prefix: process.env.API_PREFIX,
            lang: process.env.APP_DEFAULT_LANGUAGE,
        },
        jwt: {
            secret: process.env.JWT_SECRET,
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