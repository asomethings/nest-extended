import { INanoexpressApp } from 'nanoexpress'
import { AddressInfo } from 'net'
import { EventEmitter } from 'events'

/**
 * An http server like class
 * Since either nanoexpress or uWebsocket.js does not expose Http server therefore this class is used
 */
export class NanoexpressServer extends EventEmitter {
  constructor(protected readonly instance: INanoexpressApp) {
    super()
  }

  public address(): AddressInfo | null {
    if (!this.instance.host || !this.instance.port) {
      return null
    }

    return {
      address: this.instance.host as string,
      family: 'IPv4',
      port: this.instance.port as number,
    }
  }
}
