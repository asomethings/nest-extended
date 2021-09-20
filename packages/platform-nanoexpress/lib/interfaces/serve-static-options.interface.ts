export interface ServeStaticOptions {
  /**
   * Serve mode
   */
  mode?: 'cached' | 'live'

  /**
   * Index filename
   *
   * @default index.html
   */
  index?: string

  /**
   * Force append index-file path
   *
   * @default false
   */
  forcePretty?: boolean

  /**
   * Enable pretty url by auto-appending index-file
   *
   * @default false
   */
  addPrettyUrl?: boolean

  /**
   * Enable browsers **Last-modified** check
   *
   * @default false
   */
  lastModified?: boolean

  /**
   * Compress response/response streams
   *
   * @default false
   */
  compressed?: boolean
}
