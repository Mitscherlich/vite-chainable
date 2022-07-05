import { ChainedMap } from './ChainedMap'
import { Plugin } from './Plugin'
import { RollupOptions } from './Build/RollupOptions'

export class Worker extends ChainedMap {
  constructor(parent) {
    super(parent)
    this.plugins = new ChainedMap(this)
    this.rollupOptions = new RollupOptions(this)
    this.extend([
      'format',
    ])
  }

  plugin(name) {
    return this.plugins.getOrCompute(name, () => new Plugin(this, name))
  }

  toConfig() {
    return this.clean(
      Object.assign(this.entries() || {}, {
        plugins: this.plugins.values().map(plugin => plugin.toConfig()),
      }),
    )
  }

  merge(obj = {}, omit = []) {
    const omissions = [
      'plugins',
    ]

    if (!omit.includes('plugins') && 'plugins' in obj) {
      Object.keys(obj.plugins).forEach((name) => {
        this.plugin(name).merge(obj.plugins[name])
      })
    }

    omissions.forEach((key) => {
      if (!omit.includes(key) && key in obj)
        this[key].merge(obj[key])
    })

    return super.merge(obj, [...omit, ...omissions, 'plugin'])
  }
}
