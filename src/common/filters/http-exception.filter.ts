import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from "@nestjs/common";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name)
  
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp()    
    const res = ctx.getResponse()
    const req = ctx.getRequest()
    
    const statsCode = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR
    
    const message = exception instanceof HttpException ? exception.getResponse() : exception
    
    this.logger.error(`HTTP Status: ${statsCode} Error Message: ${JSON.stringify(message)}`)
    
    res.status(statsCode).json({
      tismestamps: new Date().toISOString,
      path: req.url,
      error: message
    })
  } 
}