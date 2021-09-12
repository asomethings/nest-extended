/* eslint-disable @typescript-eslint/ban-types */
import { AbstractHttpAdapter } from '@nestjs/core/adapters/http-adapter'
import nanoexpress, {
  HttpRoute,
  IAppOptions,
  IHttpRequest,
  IHttpResponse,
  INanoexpressApp,
} from 'nanoexpress'
import {
  isFunction,
  isNil,
  isObject,
  isString,
} from '@nestjs/common/utils/shared.utils'
import { RequestMethod, StreamableFile } from '@nestjs/common'
import staticServe from '@nanoexpress/middleware-static-serve'
import cors from 'cors'
import {
  CorsOptions,
  CorsOptionsDelegate,
} from '@nestjs/common/interfaces/external/cors-options.interface'
import { RequestHandler } from '@nestjs/common/interfaces'
import { NanoexpressServer } from './server'
import { EngineHandler, Renderer } from './engine-handler'

export class NanoexpressAdapter extends AbstractHttpAdapter<
  NanoexpressServer,
  IHttpRequest,
  IHttpResponse
> {
  protected readonly instance!: INanoexpressApp

  protected readonly engineHandler = new EngineHandler()

  constructor(options: Omit<Partial<IAppOptions>, 'console'> = {}) {
    super(nanoexpress({ ...options, console: false } as IAppOptions))
  }

  public reply(
    response: IHttpResponse,
    body: unknown,
    statusCode?: number,
  ): IHttpResponse {
    if (statusCode) {
      response.status(statusCode)
    }

    if (isNil(body)) {
      return response.send('')
    }

    if (body instanceof StreamableFile) {
      if (response.getHeader('Content-Type') === undefined) {
        response.setHeader('Content-Type', 'application/octet-stream')
      }

      return response.pipe(body.getStream())
    }

    return isObject(body) ? response.send(body) : response.send(String(body))
  }

  public status(response: IHttpResponse, statusCode: number): IHttpResponse {
    return response.status(statusCode)
  }

  public async render(
    response: IHttpResponse,
    view: string,
    options: Record<string, unknown>,
  ): Promise<IHttpResponse> {
    const result = await this.engineHandler.render(view, options)
    return response.send(result)
  }

  public redirect(
    response: IHttpResponse,
    statusCode: number,
    url: string,
  ): IHttpResponse {
    return response.redirect(statusCode, url)
  }

  public setErrorHandler(
    handler: Parameters<INanoexpressApp['setErrorHandler']>[0],
    prefix?: string,
  ): INanoexpressApp {
    return this.instance.setErrorHandler(handler)
  }

  public setNotFoundHandler(
    handler: Parameters<INanoexpressApp['setNotFoundHandler']>[0],
    prefix?: string,
  ): INanoexpressApp {
    return this.instance.setNotFoundHandler(handler)
  }

  public setHeader(
    response: IHttpResponse,
    name: string,
    value: string,
  ): IHttpResponse {
    return response.setHeader(name, value)
  }

  public listen(port: string | number, callback?: () => void): void
  public listen(
    port: string | number,
    hostname: string,
    callback?: () => void,
  ): void
  public listen(
    port: string | number,
    hostname: string,
  ): Promise<INanoexpressApp>
  public listen(port: string | number): Promise<INanoexpressApp>
  public listen(
    port: number,
    callbackOrHost?: string | (() => void),
    callback?: () => void,
  ): Promise<INanoexpressApp | void> {
    if (callbackOrHost && !isString(callbackOrHost)) {
      callback = callbackOrHost
      callbackOrHost = undefined
    }

    if (isFunction(callback)) {
      this.instance.listen(port, callbackOrHost).then(() => {
        callback && callback()
      })
    }

    return this.instance.listen(port, callbackOrHost)
  }

  public close(): boolean {
    return this.instance.close()
  }

  public set(): INanoexpressApp {
    // Since nanoexpress does not have "set" function it just returns the instance
    return this.instance
  }

  public enable(): INanoexpressApp {
    // Since nanoexpress does not have "enable" function it just returns the instance
    return this.instance
  }

  public disable(): INanoexpressApp {
    // Since nanoexpress does not have "disable" function it just returns the instance
    return this.instance
  }

  /**
   * Register engine
   *
   * @param {string} name
   * @param {Renderer} renderer
   * @returns {this}
   */
  public engine(name: string, renderer: Renderer): this {
    this.engineHandler.add(name, renderer)

    return this
  }

  public useStaticAssets(
    path: string,
    options: Parameters<typeof staticServe>[1],
  ): this {
    return this.use(staticServe(path, options))
  }

  public setBaseViewsDir(path: string | string[]): this {
    this.engineHandler.setBaseViewsDir(path)
    return this
  }

  /**
   * Set default view engine
   *
   * @param {string} name
   * @returns {this}
   */
  public setViewEngine(name: string): this {
    if (!this.engineHandler.has(name)) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      this.engineHandler.add(name, require(name).__express)
    }

    this.engineHandler.setDefaultEngine(name)

    return this
  }

  /**
   * Parse hostname using headers
   *
   * @see https://github.com/expressjs/express/blob/master/lib/request.js#L427
   */
  public getRequestHostname(request: IHttpRequest): string | undefined {
    let host = request.getHeader('X-Forwarded-Host')
    if (!host) {
      host = request.getHeader('Host')
    } else if (host.indexOf(',') !== -1) {
      host = host.substring(0, host.indexOf(',')).trimRight()
    }

    if (!host) {
      return
    }

    const offset = host[0] === '[' ? host.indexOf(']') + 1 : 0
    const index = host.indexOf(':', offset)
    return index !== -1 ? host.substring(0, index) : host
  }

  public getRequestMethod(request: IHttpRequest): string {
    return request.method
  }

  public getRequestUrl(request: IHttpRequest): string {
    return request.originalUrl
  }

  public enableCors(
    options: CorsOptions | CorsOptionsDelegate<IHttpRequest>,
  ): this {
    return this.use(cors(options as cors.CorsOptions))
  }

  public createMiddlewareFactory(
    requestMethod: RequestMethod,
  ): (path: string, callback: unknown) => INanoexpressApp {
    // Type cast since nanoexpress has wrong typings
    return this.instance.use.bind(this.instance) as (
      path: string,
      callback: unknown,
    ) => INanoexpressApp
  }

  public registerParserMiddleware(): void {
    // We do not need to register any parser since it's nested
  }

  public initHttpServer(): void {
    this.httpServer = new NanoexpressServer(this.instance)
  }

  public getInstance<T = INanoexpressApp>(): T {
    return this.instance as unknown as T
  }

  public getType(): string {
    return 'nanoexpress'
  }

  public delete(handler: RequestHandler): INanoexpressApp
  public delete(path: string, handler: RequestHandler): INanoexpressApp
  public delete(
    pathOrHandler: string | RequestHandler,
    handler?: RequestHandler,
  ): INanoexpressApp {
    if (isString(pathOrHandler)) {
      return this.instance.del(pathOrHandler, handler as HttpRoute)
    } else {
      return this.instance.del('', pathOrHandler as HttpRoute)
    }
  }
}
