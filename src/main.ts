import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import appConfig from './config/app.config';

async function bootstrap()
{
    const app = await NestFactory.create(AppModule);

    // CORS enabled
    app.enableCors();

    // ValidationPipe enabled
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true
        }
    }));

    // Swagger setup
    const config = new DocumentBuilder()
        .setTitle(appConfig().application.name)
        .setDescription('Electron Task Management')
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(appConfig().application.prefix, app, document);

    // App run
    const port = appConfig().application.port;
    await app.listen(port);

    // App log
    const logger = new Logger();
    logger.log(`App is running: http://localhost:${port}/`);
}
bootstrap();
