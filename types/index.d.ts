import type { OutgoingHttpHeaders, Server } from 'http'
import type * as https from 'https'
import type * as vite from 'vite'
import type * as postcss from 'postcss'

declare class Config extends Config.ChainedMap<void> {
  define: Config.ChainedMap<this>
  plugins: Config.Plugins<this, vite.Plugin>
  resolve: Config.Resolve
  css: Config.CSS
  json: Config.JSON
  assetsInclude: Config.ChainedSet<this, string | RegExp>
  server: Config.DevServer
  build: Config.Build
  preview: Config.Preview
  optimizeDeps: Config.OptimizeDeps
  ssr: Config.SSR
  worker: Config.Worker

  root(value: string): this
  base(value: string): this
  mode(value: string): this
  publicDir(value: string | false): this
  cacheDir(value: string): this
  esbuild(value: vite.ESBuildOptions | false): this
  logLevel(value: 'info' | 'warn' | 'error' | 'silent'): this
  clearScreen(value: boolean): this
  envDir(value: string): this
  envPrefix(value: string | string[]): this
  appType(value: 'spa' | 'mpa' | 'custom'): this

  plugin(name: string): Config.Plugin<this, vite.Plugin>

  toConfig(): vite.UserConfig
}

declare namespace Config {
  class Chainable<Parent> {
    end(): Parent
  }

  class ChainedMap<Parent, Value = any> extends Chainable<Parent> {
    clear(): this
    delete(key: string): this
    has(key: string): boolean
    get(key: string): Value
    getOrCompute(key: string, compute: () => Value): Value
    set(key: string, value: Value): this
    merge(obj: { [key: string]: Value }): this
    entries(): { [key: string]: Value }
    values(): Value[]
    when(
      condition: boolean,
      trueBrancher: (obj: this) => void,
      falseBrancher?: (obj: this) => void,
    ): this
  }

  class ChainedSet<Parent, Value> extends Chainable<Parent> {
    add(value: Value): this
    prepend(value: Value): this
    clear(): this
    delete(key: string): this
    has(key: string): boolean
    merge(arr: Value[]): this
    values(): Value[]
    when(
      condition: boolean,
      trueBrancher: (obj: this) => void,
      falseBrancher?: (obj: this) => void,
    ): this
  }

  class Plugins<
    Parent,
    PluginType extends vite.Plugin = vite.Plugin,
  > extends ChainedMap<Parent, Plugin<Parent, PluginType>> {}

  class Plugin<Parent, PluginType extends vite.Plugin = vite.Plugin>
    extends ChainedMap<Parent>
    implements Orderable {
    init<P extends PluginType | PluginClass<PluginType>>(
      value: (
        plugin: P,
        args: P extends PluginClass ? ConstructorParameters<P> : any[],
      ) => PluginType,
    ): this
    use<P extends string | PluginType | PluginClass<PluginType>>(
      plugin: P,
      args?: P extends PluginClass ? ConstructorParameters<P> : any[],
    ): this
    tap<P extends PluginClass<PluginType>>(
      f: (args: ConstructorParameters<P>) => ConstructorParameters<P>,
    ): this

    // Orderable
    before(name: string): this
    after(name: string): this
  }

  class Resolve<T = Config> extends ChainedMap<T> {
    alias: ChainedMap<this>
    dedupe: ChainedSet<this, string>
    conditions: ChainedSet<this, string>
    mainFields: ChainedSet<this, string>
    extensions: ChainedSet<this, string>

    preserveSymlinks(value: boolean): this
  }

  interface CSSModulesOptions {
    scopeBehaviour?: 'global' | 'local'
    globalModulePaths?: RegExp[]
    generateScopedName?:
    | string
    | ((name: string, filename: string, css: string) => string)
    hashPrefix?: string
    /**
     * 默认：null
     */
    localsConvention?:
    | 'camelCase'
    | 'camelCaseOnly'
    | 'dashes'
    | 'dashesOnly'
    | null
  }

  class CSS extends ChainedMap<Config> {
    modules(value: CSSModulesOptions): this
    postcss(value: string | (postcss.ProcessOptions & {
      plugins?: postcss.AcceptedPlugin[]
    }))
    preprocessorOptions(value: Record<string, object>): this
    devSourcemap(value: boolean): this
  }

  class JSON extends ChainedMap<Config> {
    namedExports(value: boolean): this
    stringify(value: boolean): this
  }

  class TypedServer extends ChainedMap<Config> {
    host(value: string | boolean): this
    port(value: number): this
    strictPort(value: boolean): this
    https(value: boolean | https.ServerOptions): this
    open(value: boolean | string): this
    proxy(value: Record<string, string | vite.ProxyOptions>): this
    cors(value: boolean | vite.CorsOptions): this
  }

  class DevServer extends TypedServer {
    headers(value: OutgoingHttpHeaders): this
    hmr(value: boolean | {
      protocol?: string
      host?: string
      port?: number
      path?: string
      timeout?: number
      overlay?: boolean
      clientPort?: number
      server?: Server
    }): this
    watch(value: object): this
    middlewareMode(value: 'ssr' | 'html'): this
    base(value: string | undefined): this
    fs(value: {
      strict?: boolean
      allow?: string[]
      deny?: string[]
    }): this
    origin(value: string): this
  }

  class Build extends ChainedMap<Config> {
    target(value: string | string[]): this
    polyfillModulePreload(value: boolean): this
    outDir(value: string): this
    assetsDir(value: string): this
    assetsInlineLimit(value: number): this
    cssCodeSplit(value: boolean): this
    cssTarget(value: string | string[]): this
    sourcemap(value: boolean | 'inline' | 'hidden'): this
    lib(value: {
      entry: string
      name?: string
      formats?: ('es' | 'cjs' | 'umd' | 'iife')[]
      fileName?: string | ((format: ModuleFormat) => string)
    }): this
    manifest(value: boolean | string): this
    ssrManifest(value: boolean | string): this
    ssr(value: boolean | string): this
    minify(value: boolean | 'terser' | 'esbuild'): this
    write(value: boolean): this
    emptyOutDir(value: boolean): this
    reportCompressedSize(value: boolean): this
    chunkSizeWarningLimit(value: number): this
  }

  class Preview extends TypedServer {}

  class SSR extends ChainedMap<Config> {
    external(value: string[]): this
    noExternal(value: string | RegExp | (string | RegExp)[] | true): this
    target(value: 'node' | 'webworker'): this
    format(value: 'esm' | 'cjs'): this
  }

  class OptimizeDeps extends ChainedMap<Config> {
    exclude: ChainedSet<this, string>
    include: ChainedSet<this, string>
  }

  class Worker extends ChainedMap<Config> {
    format(value: 'es' | 'iife'): this
  }

  interface Orderable {
    before(name: string): this
    after(name: string): this
  }
}

export = Config
