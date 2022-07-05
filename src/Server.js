import { ChainedMap } from './ChainedMap'

export class Server extends ChainedMap {
  constructor() {
    super()
    this.extend([
      'host',
      'port',
      'strictPort',
      'https',
      'open',
      'proxy',
      'cors',
      'headers',
      'hmr',
      'watch',
      'middlewareMode',
      'base',
      'fs',
      'origin',
    ])
  }
}
