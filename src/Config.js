import { Build } from './Build'
import { ChainedMap } from './ChainedMap'
// import { ChainedSet } from './ChainedSet'
import { CSS } from './CSS'
// import { ESBuild } from './ESBuild'
import { JSON } from './JSON'
import { OptimizeDeps } from './OptimizeDeps'
import { Plugin } from './Plugin'
import { Preview } from './Preview'
import { Resolve } from './Resolve'
import { Server } from './Server'
import { SSR } from './SSR'

export class Config extends ChainedMap {
  constructor() {
    super()
    this.define = new ChainedMap(this)
    this.plugins = new ChainedMap(this)
    this.resolve = new Resolve(this)
    this.css = new CSS(this)
    this.json = new JSON(this)
    // this.esbuild = new ESBuild(this)
    this.server = new Server(this)
    this.build = new Build(this)
    this.preview = new Preview(this)
    this.optimizeDeps = new OptimizeDeps(this)
    this.ssr = new SSR(this)
    this.worker = new Worker(this)
    this.extend([
      'root',
      'base',
      'mode',
      'appType',
      'publicDir',
      'cacheDir',
      'assetsInclude',
      'envDir',
      'envPrefix',
      'logLevel',
      'clearScreen',
      'esbuild',
    ])
  }

  plugin(name) {
    return this.plugins.getOrCompute(name, () => new Plugin(this, name))
  }

  merge(obj = {}, omit = []) {
    const omissions = [
      'define',
      'plugins',
      'resolve',
      'css',
      'json',
      'esbuild',
      'assetsInclude',
      'server',
      'build',
      'preview',
      'optimizeDeps',
      'ssr',
      'worker',
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

    return super.merge(obj, [...omit, ...omissions, 'plugins'])
  }
}
