export default () =>
{
    return {
        application: {
            nodeEnv: process.env.NODE_ENV,
            nodeEnvProd: process.env.NODE_ENV_PRODUCTION,
            nodeEnvDev: process.env.NODE_ENV_DEVELOPMENT,
            port: +process.env.APP_PORT,
            name: process.env.APP_NAME,
            prefix: process.env.API_PREFIX,
            lang: process.env.APP_DEFAULT_LANGUAGE,
            role: process.env.APP_DEFAULT_ROLE,
        },
        admin: {
            orgName: process.env.ADMIN_ORG_NAME,
            roleName: process.env.ADMIN_ROLE_NAME,
            username: process.env.ADMIN_USERNAME,
            password: process.env.ADMIN_PASSWORD,
            email: process.env.ADMIN_EMAIL,
            phoneNumber: process.env.ADMIN_PHONE_NUMBER,
            firstName: process.env.ADMIN_FIRST_NAME,
            lastName: process.env.ADMIN_LAST_NAME,
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