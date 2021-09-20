import * as path from 'node:path'
import * as fs from 'node:fs'
import { Stats } from 'node:fs'

export type Renderer = (
  path: string,
  options: Record<string, unknown>,
  callback: (e?: Error, rendered?: string) => void,
) => void

export class EngineHandler {
  protected baseViewsDir?: string | string[]

  protected defaultEngine?: string

  protected readonly engines: Record<string, Renderer> = {}

  public setBaseViewsDir(path: string | string[]): this {
    this.baseViewsDir = path
    return this
  }

  public setDefaultEngine(name: string): this {
    if (!(name in this.engines)) {
      throw new Error(`No engine found named "${name}"`)
    }

    this.defaultEngine = name

    return this
  }

  public add(name: string, renderer: Renderer): this {
    this.engines[name] = renderer
    return this
  }

  public get(name?: string): Renderer {
    if (name) {
      return this.engines[name]
    }

    if (this.defaultEngine) {
      return this.engines[this.defaultEngine]
    }

    throw new Error('No engine specified nor default engine was specified')
  }

  public has(name: string): boolean {
    return name in this.engines
  }

  public render(
    view: string,
    options: Record<string, unknown>,
  ): Promise<string> {
    let ext = path.extname(view)
    if (!ext && this.defaultEngine) {
      ext = this.addExtension(this.defaultEngine)
      view += this.addExtension(ext)
    } else {
      throw new Error(
        'No file extension specified nor default engine was specified',
      )
    }
    const directories = ([] as string[]).concat(
      this.baseViewsDir as string | string[],
    )
    const resolve = (dir: string, file: string) => {
      const filePath = path.join(dir, file)
      const fileStat = this.stat(filePath)

      if (fileStat && fileStat.isFile()) {
        return filePath
      }

      const indexPath = path.join(dir, path.basename(file, ext), `index${ext}`)
      const indexStat = this.stat(indexPath)

      if (indexStat && indexStat.isFile()) {
        return indexPath
      }
    }
    for (const name of directories) {
      const loc = path.resolve(name, view)
      const dir = path.dirname(loc)
      const file = path.basename(loc)
      const filePath = resolve(dir, file)
      if (!filePath) {
        continue
      }

      const engine = this.get(ext.substr(1))
      return new Promise((resolve, reject) => {
        const opts = {
          ...options,
          settings: {
            views: this.baseViewsDir,
            'view engine': this.defaultEngine,
          },
        }
        engine(filePath, opts, (e?: Error, rendered?: string) => {
          if (rendered) {
            return resolve(rendered)
          } else {
            return reject(e)
          }
        })
      })
    }

    throw new Error(`Could not find ${view}`)
  }

  public stat(file: string): Stats | undefined {
    try {
      return fs.statSync(file)
    } catch (e) {
      return
    }
  }

  public addExtension<S1 extends string>(name: S1): `.${S1}` {
    return (name.startsWith('.') ? name : `.${name}`) as `.${S1}`
  }
}
