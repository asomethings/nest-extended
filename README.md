# nest-platform-nanoexpress

[![codecov](https://codecov.io/gh/asomethings/nest-platform-nanoexpress/branch/main/graph/badge.svg?token=8IXYG2705Y)](https://codecov.io/gh/asomethings/nest-platform-nanoexpress)
[![Lint and Test](https://github.com/asomethings/nest-platform-nanoexpress/actions/workflows/lint_test.yml/badge.svg)](https://github.com/asomethings/nest-platform-nanoexpress/actions/workflows/lint_test.yml)

## Install


```bash
# npm
npm install nest-platform-nanoexpress

# pnpm
pnpm add nest-platform-nanoexpress
```

## Usage

```typescript
import { Module } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'

@Module({})
class AppModule {}

const adapter = new NanoexpressAdapter()
const app = await NestFactory.create<NestNanoexpressApplication>(AppModule, adapter)
await app.listen(process.env.PORT)
```

## To-do
- [x] View Engine Support (Partially supports it without Dynamic template rendering)
- [ ] Websocket Support
- [ ] Swagger support
