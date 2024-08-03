import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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
        .setTitle('ETM')
        .setDescription('Electron Task Management')
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(process.env.API_PREFIX, app, document);

    // App run
    const port = process.env.APP_PORT;
    await app.listen(port);

    // App log
    const logger = new Logger();
    logger.log(`App is running on port ${port}`);
}
bootstrap();
