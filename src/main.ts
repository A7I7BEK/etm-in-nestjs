import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import appConfig from './common/config/app.config';
import { WrapResponseInterceptor } from './common/interceptors/wrap-response.interceptor';

async function bootstrap()
{
    const app = await NestFactory.create(AppModule);


    // CORS enabled
    app.enableCors();


    // ValidationPipe enabled
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        transform: true,
    }));


    // Wrap Response
    app.useGlobalInterceptors(
        new WrapResponseInterceptor(),
    );


    // Swagger setup
    const config = new DocumentBuilder()
        .setTitle(appConfig().application.name)
        .setDescription('Electron Task Management')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(appConfig().application.docPrefix, app, document);


    // App run
    await app.listen(appConfig().application.port);


    // App log
    const logger = new Logger();
    logger.log(`App is running: ${appConfig().application.url}`);
}
bootstrap();
