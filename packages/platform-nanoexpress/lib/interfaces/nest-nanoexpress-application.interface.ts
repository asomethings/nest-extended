import { INestApplication } from '@nestjs/common'
import { Renderer } from '../engine-handler'
import { ServeStaticOptions } from './serve-static-options.interface'

export interface NestNanoexpressApplication extends INestApplication {
  useStaticAssets(path: string, options?: ServeStaticOptions): this
  engine(name: string, renderer: Renderer): this
  setBaseViewsDir(path: string | string[]): this
  setViewEngine(engine: string): this
}
