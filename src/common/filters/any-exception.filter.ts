import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,

} from '@nestjs/common'


type myError = {
  readonly status: number
  readonly statusCode?: number

  readonly message?: string
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {


  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : (exception as myError)?.status ||
          (exception as myError)?.statusCode ||
          HttpStatus.INTERNAL_SERVER_ERROR

    const res = (exception as any).response
    console.log( (exception as any)?.message);
    response
      .status(status)
      .type('application/json')
      .send({
        ok: 0,
        code: res?.code,
        message: res?.message || (exception as any)?.message || '未知错误',
      })
  }
}
