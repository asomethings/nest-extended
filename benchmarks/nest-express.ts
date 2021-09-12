import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

NestFactory.create(AppModule, { logger: false }).then((app) => {
  return app.listen(3000)
})
