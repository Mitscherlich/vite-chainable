import { ChainedMap } from './ChainedMap'
import { ChainedSet } from './ChainedSet'

export class SSR extends ChainedMap {
  constructor(parent) {
    super(parent)
    this.external = new ChainedSet(this)
    this.extend([
      'noExternal',
      'target',
      'format',
    ])
  }

  merge(obj = {}, omit = []) {
    const omissions = [
      'external',
    ]

    omissions.forEach((key) => {
      if (!omit.includes(key) && key in obj)
        this[key].merge(obj[key])
    })

    return super.merge(obj, [...omit, ...omissions])
  }
}
