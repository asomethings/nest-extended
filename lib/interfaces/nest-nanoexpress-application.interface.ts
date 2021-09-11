import { INestApplication } from '@nestjs/common'
import { ServeStaticOptions } from './serve-static-options.interface'

export interface NestExpressApplication extends INestApplication {
  useStaticAssets(path: string, options?: ServeStaticOptions): this
}
