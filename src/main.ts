import { ClassSerializerInterceptor, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import appConfig from './common/config/app.config';
import { WrapResponseInterceptor } from './common/interceptors/wrap-response.interceptor';
import { DESTINATION_BASE } from './resource/utils/resource.constants';
import { generateFullPath } from './resource/utils/resource.utils';


async function bootstrap()
{
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    //test
    // CORS enabled
    app.enableCors();

    // Serve static files from the 'uploads' directory
    app.useStaticAssets(
        generateFullPath(DESTINATION_BASE),
        {
            prefix: DESTINATION_BASE, // This adds a URL prefix for accessing files
        }
    );


    // ValidationPipe enabled
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        transform: true,
    }));


    // Wrap Response
    app.useGlobalInterceptors(
        new ClassSerializerInterceptor(app.get(Reflector)),
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
