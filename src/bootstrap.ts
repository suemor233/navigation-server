import { NestFactory } from "@nestjs/core";
import { API_VERSION, CROSS_DOMAIN } from "./app.config";
import { AppModule } from "./app.module";
import { isDev } from "./global/env.global";

export async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const hosts = CROSS_DOMAIN.allowedOrigins.map((host) => new RegExp(host, 'i'))
  app.enableCors(
    hosts
      ? {
        origin: (origin, callback) => {
          const allow = hosts.some((host) => host.test(origin))

          callback(null, allow)
        },
        credentials: true,
      }
      : undefined,
  )

  app.setGlobalPrefix(isDev ? '' : `api/v${API_VERSION}`)
  // const logger = new Logger()
  // const options = new DocumentBuilder()
  //   .setTitle(title)
  //   .setVersion(version)
  //   .addServer(globalPrefix)
  //   .build();
  // const document = SwaggerModule.createDocument(app, options);
  // SwaggerModule.setup('api-docs', app, document);
  // app.setGlobalPrefix(globalPrefix)

  // await app.listen(port);

  // logger.debug(`Server listen on:: http://localhost:${port}/api`)
  // logger.debug(`swaager文档: http://localhost:${port}/api-docs`)
}