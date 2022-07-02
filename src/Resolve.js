import { ChainedMap } from './ChainedMap'
import { ChainedSet } from './ChainedSet'

export class Resolve extends ChainedMap {
  constructor(parent) {
    super(parent)
    this.alias = new ChainedMap(this)
    this.dedupe = new ChainedSet(this)
    this.conditions = new ChainedSet(this)
    this.mainFields = new ChainedSet(this)
    this.extensions = new ChainedSet(this)
    this.extend([
      'preserveSymlinks',
    ])
  }

  toConfig() {
    return this.clean(
      Object.assign(this.entries() || {}, {
        alias: this.alias.entries() || {},
        dedupe: this.dedupe.entries() || [],
        conditions: this.conditions.entries() || [],
        mainFields: this.mainFields.entries() || [],
        extensions: this.extensions.entries() || [],
      }),
    )
  }

  merge(obj, omit = []) {
    const omissions = [
      'alias',
      'dedupe',
      'conditions',
      'mainFields',
      'extensions',
    ]

    omissions.forEach((key) => {
      if (!omit.includes(key) && key in obj)
        this[key].merge(obj[key])
    })

    return super.merge(obj, [...omit, ...omissions])
  }
}
