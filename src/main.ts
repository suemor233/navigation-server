import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

const port = 2346
const title = "引导页API";
const version = "1.0";
const globalPrefix = `/api/v${version.slice(0, version.indexOf("."))}`;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger()
  const options = new DocumentBuilder()
    .setTitle(title)
    .setVersion(version)
    .addServer(globalPrefix)
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);
  app.setGlobalPrefix(globalPrefix)

  await app.listen(port);

  logger.debug(`Server listen on:: http://localhost:${port}/api`)
  logger.debug(`swaager文档: http://localhost:${port}/api-docs`)
}
bootstrap();
