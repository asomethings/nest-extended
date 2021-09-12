import { Controller, Get } from '@nestjs/common'

@Controller()
export class AppController {
  @Get()
  get(): { success: true } {
    return {
      success: true,
    }
  }
}
