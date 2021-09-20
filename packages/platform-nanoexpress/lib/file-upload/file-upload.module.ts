import { DynamicModule, Provider } from '@nestjs/common'
import {
  FILE_UPLOAD_MODULE_ID,
  FILE_UPLOAD_MODULE_OPTIONS,
} from './file-upload.constants'
import {
  FileUploadModuleAsyncOptions,
  FileUploadModuleOptions,
  FileUploadOptionsFactory,
} from './interfaces'
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util'

export class FileUploadModule {
  static register(options: FileUploadModuleOptions = {}): DynamicModule {
    return {
      module: FileUploadModule,
      providers: [
        {
          provide: FILE_UPLOAD_MODULE_OPTIONS,
          useValue: options,
        },
        {
          provide: FILE_UPLOAD_MODULE_ID,
          useValue: randomStringGenerator(),
        },
      ],
      exports: [FILE_UPLOAD_MODULE_OPTIONS],
    }
  }

  static registerAsync(options: FileUploadModuleAsyncOptions): DynamicModule {
    return {
      module: FileUploadModule,
      imports: options.imports,
      providers: [
        ...this.createAsyncProviders(options),
        {
          provide: FILE_UPLOAD_MODULE_ID,
          useValue: randomStringGenerator(),
        },
      ],
      exports: [FILE_UPLOAD_MODULE_OPTIONS],
    }
  }
  static createAsyncProviders(
    options: FileUploadModuleAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)]
    }
    return [
      this.createAsyncOptionsProvider(options),
      {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        provide: options.useClass!,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        useClass: options.useClass!,
      },
    ]
  }

  static createAsyncOptionsProvider(
    options: FileUploadModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: FILE_UPLOAD_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: (options.inject as []) || [],
      }
    }
    return {
      provide: FILE_UPLOAD_MODULE_OPTIONS,
      useFactory: async (optionsFactory: FileUploadOptionsFactory) =>
        optionsFactory.createFileUploadOptions(),
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      inject: [options.useExisting || options.useClass!],
    }
  }
}
