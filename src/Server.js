import { ChainedMap } from './ChainedMap'

export class Server extends ChainedMap {
  constructor() {
    super()
    this.proxy = new ChainedMap(this)
    this.fs = new ChainedMap(this)
    this.extend([
      'host',
      'port',
      'base',
      'origin',
      'strictPort',
      'https',
      'open',
      'cors',
      'headers',
      'hmr',
      'watch',
      'middlewareMode',
    ])
  }

  merge(obj = {}, omit = []) {
    const omissions = [
      'proxy',
      'fs',
    ]

    omissions.forEach((key) => {
      if (!omit.includes(key) && key in obj)
        this[key].merge(obj[key])
    })

    return super.merge(obj, [...omit, ...omissions])
  }
}
