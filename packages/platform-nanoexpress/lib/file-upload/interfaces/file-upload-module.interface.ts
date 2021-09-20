import { Type } from '@nestjs/common'
import { ModuleMetadata } from '@nestjs/common/interfaces'
import { FileUploadOptions } from './file-upload-options.interface'

export type FileUploadModuleOptions = FileUploadOptions

export interface FileUploadOptionsFactory {
  createFileUploadOptions():
    | Promise<FileUploadModuleOptions>
    | FileUploadModuleOptions
}

export interface FileUploadModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<FileUploadOptionsFactory>
  useClass?: Type<FileUploadOptionsFactory>
  useFactory?: (
    ...args: unknown[]
  ) => Promise<FileUploadModuleOptions> | FileUploadModuleOptions
  inject?: unknown[]
}
