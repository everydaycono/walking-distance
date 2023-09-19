import * as dotenv from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filter/http-exception.filter';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CategoryService } from './module/category/category.service';

const environment = process.env.NODE_ENV || 'dev';
dotenv.config({ path: `.env.${environment}` });

async function bootstrap() {
  /*
  |--------------------------------------------------------------------------
  | Checks for JWT SECRET, required for app bootstrapping
  |--------------------------------------------------------------------------
  */
  // if (!process.env.JWT_SECRET) {
  //   throw new Error('Fatal Error. JWT_SECRET variable is not provided');
  // }

  /*
  |--------------------------------------------------------------------------
  | Creates an instance of the NestApplication and set Middlewares
  |--------------------------------------------------------------------------
  */
  const app = await NestFactory.create(AppModule);

  // CategoryService를 사용하여 시드 데이터 생성
  app.get(CategoryService);

  // middleware
  app.setGlobalPrefix('api');
  app.enableCors();
  //   app.use(helmet.default());
  //   app.use(rateLimit(config.rateLimit));

  /*
  |--------------------------------------------------------------------------
  | Set global filters and pipes
  |--------------------------------------------------------------------------
  */
  app.useGlobalFilters(new HttpExceptionFilter());
  // app.useGlobalPipes(new ValidationPipe());
  // app.useGlobalFilters(new BadRequestExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) => new BadRequestException(errors)
    })
  );

  /*
    |--------------------------------------------------------------------------
    | Initialize Swagger and APP
    |--------------------------------------------------------------------------
    */
  if (process.env.NODE_ENV !== 'prd') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Walking Distance')
      .setDescription('Walking Distance API Document')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api-docs', app, document);
  }
  await app.listen(process.env.PORT);
}
bootstrap();
