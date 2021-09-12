import { NestFactory } from '@nestjs/core'
import { NanoexpressAdapter } from '../lib'
import { AppModule } from './app.module'

const adapter = new NanoexpressAdapter()
NestFactory.create(AppModule, adapter, { logger: false }).then((app) => {
  return app.listen(3000)
})
