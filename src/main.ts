import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

const port = 2346
const title = "引导页API";
const version = "1.0";
const globalPrefix = `/api/v${version.slice(0, version.indexOf("."))}`;

async function main() {
  const [{ bootstrap }] = await Promise.all([
    import('./bootstrap'),
    import('./app.config'),
  ])
  bootstrap()
}
main();
