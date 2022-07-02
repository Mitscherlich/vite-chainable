import { ChainedMap } from './ChainedMap'
import { ChainedSet } from './ChainedSet'
import { ESBuildOptions } from './Build/ESBuildOptions'

export class OptimizeDeps extends ChainedMap {
  constructor(parent) {
    super(parent)
    this.exclude = new ChainedSet(this)
    this.include = new ChainedSet(this)
    this.esbuildOptions = new ESBuildOptions(this)
    this.extend([
      'entries',
      'force',
    ])
  }

  merge(obj = {}, omit = []) {
    const omissions = [
      'exclude',
      'include',
      'esbuildOptions',
    ]

    omissions.forEach((key) => {
      if (!omit.includes(key) && key in obj)
        this[key].merge(obj[key])
    })

    return super.merge(obj, [...omit, ...omissions])
  }
}
