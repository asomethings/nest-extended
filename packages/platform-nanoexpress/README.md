# `@nestjs-extended/platform-nanoexpress`

## Installation

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