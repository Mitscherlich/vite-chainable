import { ChainedMap } from './ChainedMap'

export class Preview extends ChainedMap {
  constructor(parent) {
    super(parent)
    this.proxy = new ChainedMap(this)
    this.extend([
      'host',
      'port',
      'strictPort',
      'https',
      'open',
      'cors',
    ])
  }

  merge(obj = {}, omit = []) {
    const omissions = [
      'proxy',
    ]

    omissions.forEach((key) => {
      if (!omit.includes(key) && key in obj)
        this[key].merge(obj[key])
    })

    return super.merge(obj, [...omit, ...omissions])
  }
}
