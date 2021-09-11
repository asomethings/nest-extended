import {
  BadRequestException,
  InternalServerErrorException,
  PayloadTooLargeException,
} from '@nestjs/common'

export const FileUploadExceptions = {
  LIMIT_FILE_SIZE:
    '@nanoexpress/middleware-file-upload [Error]: File-limit exceeded, please change limit on server or down file-size from client',
  UNEXPECTED_UPLOAD_FORMAT:
    '@nanoexpress/middleware-file-upload [Error]: Invalid upload format, please check your request',
  INVALID_SIZE_SCALE:
    '@nanoexpress/file-upload [Error]: Invalid size scale, choose one of available, please see docs for more',
}

export const transformError = (error: Error): Error => {
  switch (error.message) {
    case FileUploadExceptions.LIMIT_FILE_SIZE:
      return new PayloadTooLargeException(error.message)
    case FileUploadExceptions.UNEXPECTED_UPLOAD_FORMAT:
      return new BadRequestException(error.message)
    case FileUploadExceptions.INVALID_SIZE_SCALE:
      return new InternalServerErrorException(error.message)
  }

  return error
}
