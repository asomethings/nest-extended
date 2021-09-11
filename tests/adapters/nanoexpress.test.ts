import {
  Controller,
  Delete,
  Get,
  INestApplication,
  Module,
  Patch,
  Post,
  Put,
} from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import anyTest, { TestInterface } from 'ava'
import { NanoexpressAdapter } from '../../lib'
import got, { Got } from 'got'

interface TestContext {
  adapter: NanoexpressAdapter
  app: INestApplication
  prefixUrl: string
  got: Got
}

@Controller()
class AppController {
  @Get()
  public get() {
    return { success: true }
  }

  @Post()
  public post() {
    return { success: true }
  }

  @Patch()
  public patch() {
    return { success: true }
  }

  @Delete()
  public delete() {
    return { success: true }
  }

  @Put()
  public put() {
    return { success: true }
  }
}

@Module({
  controllers: [AppController],
})
class AppModule {}

const test = anyTest as TestInterface<TestContext>

test.before(async (t) => {
  const adapter = new NanoexpressAdapter()
  const app = await NestFactory.create(AppModule, adapter, { logger: false })
  await app.listen(3000)
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

test('create nest app with nanoexpress adapter', async (t) => {
  t.truthy(t.context.adapter)
  t.truthy(t.context.app)
})

test('can receive get method request', async (t) => {
  const { success } = await t.context.got('').json()
  t.is(success, true)
})

test('can receive post method request', async (t) => {
  const { success } = await t.context.got.post('').json()
  t.is(success, true)
})

test('can receive patch method request', async (t) => {
  const { success } = await t.context.got.patch('').json()
  t.is(success, true)
})

test('can receive delete method request', async (t) => {
  const { success } = await t.context.got.delete('').json()
  t.is(success, true)
})

test('can receive put method request', async (t) => {
  const { success } = await t.context.got.put('').json()
  t.is(success, true)
})
