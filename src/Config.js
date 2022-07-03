import { stringify } from 'javascript-stringify'
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

  static toString(config, { verbose = false, configPrefix = 'config' } = {}) {
    return stringify(config, (value, indent, stringify) => {
      // improve plugin output
      if (value && value.__pluginName) {
        const prefix = `/* ${configPrefix}.${value.__pluginType}('${value.__pluginName}') */\n`
        const constructorExpression = value.__pluginPath
          // The path is stringified to ensure special characters are escaped
          // (such as the backslashes in Windows-style paths).
          ? `(require(${stringify(value.__pluginPath)}))`
          : value.__pluginConstructorName

        if (constructorExpression) {
          // get correct indentation for args by stringifying the args array and
          // discarding the square brackets.
          const args = stringify(value.__pluginArgs).slice(1, -1)
          return `${prefix}new ${constructorExpression}(${args})`
        }

        return prefix + stringify(value.__pluginArgs && value.__pluginArgs.length
          ? { args: value.__pluginArgs }
          : {})
      }

      if (value && value.__expression)
        return value.__expression

      // shorten long functions
      if (typeof value === 'function') {
        if (!verbose && value.toString().length > 100)
          return 'function () { /* omitted long function */ }'
      }

      return stringify(value)
    }, 2)
  }

  plugin(name) {
    return this.plugins.getOrCompute(name, () => new Plugin(this, name))
  }

  toConfig() {
    return this.clean(
      Object.assign(this.entries() || {}, {
        define: this.define.entries(),
        plugins: this.plugins.values().map(plugin => plugin.toConfig()),
        resolve: this.resolve.toConfig(),
        css: this.css.toConfig(),
        json: this.json.toConfig(),
        // esbuild: this.esbuild.toConfig(),
        server: this.server.toConfig(),
        build: this.build.toConfig(),
        preview: this.preview.toConfig(),
        optimizeDeps: this.optimizeDeps.toConfig(),
        ssr: this.ssr.toConfig(),
        worker: this.worker.toConfig(),
      }),
    )
  }

  toString(options) {
    return Config.toString(this.toConfig(), options)
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
