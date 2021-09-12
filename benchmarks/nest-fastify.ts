import { NestFactory } from '@nestjs/core'
import { FastifyAdapter } from '@nestjs/platform-fastify'
import { AppModule } from './app.module'

const adapter = new FastifyAdapter()
NestFactory.create(AppModule, adapter, { logger: false }).then((app) => {
  return app.listen(3000)
})
