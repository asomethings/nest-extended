import {
  CallHandler,
  ExecutionContext,
  Inject,
  mixin,
  NestInterceptor,
  Optional,
  Type,
} from '@nestjs/common'
import { FileUploadOptions } from '../interfaces'
import { Observable } from 'rxjs'
import { FILE_UPLOAD_MODULE_OPTIONS } from '../file-upload.constants'
import fileUpload from '@nanoexpress/middleware-file-upload'
import { IncomingMessage, ServerResponse } from 'http'
import { transformError } from '../file-upload.utils'

export const AnyFilesInterceptor = (
  localOptions?: FileUploadOptions,
): Type<NestInterceptor> => {
  class MixinInterceptor implements NestInterceptor {
    protected fileUpload: (
      req: IncomingMessage,
      res: ServerResponse,
    ) => Promise<void>

    constructor(
      @Optional()
      @Inject(FILE_UPLOAD_MODULE_OPTIONS)
      options: FileUploadOptions = { limit: '256mb' },
    ) {
      try {
        this.fileUpload = fileUpload({
          ...options,
          ...localOptions,
        } as Parameters<typeof fileUpload>[0]) as unknown as (
          req: IncomingMessage,
          res: ServerResponse,
        ) => Promise<void>
      } catch (e) {
        throw transformError(e as Error)
      }
    }

    async intercept(
      context: ExecutionContext,
      next: CallHandler,
    ): Promise<Observable<unknown>> {
      const ctx = context.switchToHttp()

      try {
        await this.fileUpload(ctx.getRequest(), ctx.getResponse())
      } catch (e: unknown) {
        throw transformError(e as Error)
      }

      return next.handle()
    }
  }
  return mixin(MixinInterceptor)
}
