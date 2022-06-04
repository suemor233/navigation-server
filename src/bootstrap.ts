import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import cluster from "cluster";
import { API_VERSION, CROSS_DOMAIN, PORT } from "./app.config";
import { AppModule } from "./app.module";
import { LoggingInterceptor } from "./common/interceptors/logging.interceptor";
import { isDev } from "./global/env.global";

declare const module: any

export async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger()
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

  if (isDev) {
    app.useGlobalInterceptors(new LoggingInterceptor())
  }

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      errorHttpStatusCode: 422,
      forbidUnknownValues: true,
      enableDebugMessages: isDev,
      stopAtFirstError: true,
    }),
  )
   
  if (isDev) {
    const { DocumentBuilder, SwaggerModule } = await import('@nestjs/swagger')
    const options = new DocumentBuilder()
      .setTitle('API')
      .setDescription('navigator API')
      .setVersion(`${API_VERSION}`)
      .addSecurity('bearer', {
        type: 'http',
        scheme: 'bearer',
      })
      .addBearerAuth()
      .build()
    const document = SwaggerModule.createDocument(app, options)
    SwaggerModule.setup('api-docs', app, document)
    }


  await app.listen(+PORT, '0.0.0.0', async () => {

    if (isDev) {
      logger.debug(`Server listen on:: http://localhost:${PORT}`)
      logger.debug(`swaager文档: http://localhost:${PORT}/api-docs`)
    }

  })

  if (module.hot) {
    module.hot.accept()
    module.hot.dispose(() => app.close())
  }
  

}