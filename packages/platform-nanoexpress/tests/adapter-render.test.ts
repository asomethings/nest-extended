import {
  Controller,
  Get,
  INestApplication,
  Module,
  Render,
} from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import anyTest, { TestInterface } from 'ava'
import { NanoexpressAdapter, NestNanoexpressApplication } from '../lib'
import got, { Got } from 'got'
import mustacheExpress from 'mustache-express'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

const __dirname = fileURLToPath(dirname(import.meta.url))

interface TestContext {
  adapter: NanoexpressAdapter
  app: INestApplication
  prefixUrl: string
  got: Got
}

@Controller()
class AppController {
  @Get()
  @Render('index')
  public get() {
    return { name: 'world' }
  }
}

@Module({
  controllers: [AppController],
})
class AppModule {}

const test = anyTest as TestInterface<TestContext>

test.before(async (t) => {
  const adapter = new NanoexpressAdapter()
  const app = await NestFactory.create<NestNanoexpressApplication>(
    AppModule,
    adapter,
    { logger: false },
  )
  app
    .setBaseViewsDir(`${__dirname}/views`)
    .engine('mst', mustacheExpress())
    .setViewEngine('mst')
  await app.listen(3001)
  t.context.adapter = adapter
  t.context.app = app
  const address = adapter.getHttpServer().address()
  t.context.got = got.extend({
    prefixUrl: `http://${address?.address}:${address?.port}`,
  })
})

test.after.always(async (t) => {
  await t.context.app.close()
})

test('does properly render using mustache-express', async (t) => {
  const response = await t.context.got('', { throwHttpErrors: false })
  t.is(response.body, 'Hello, world')
})
