import { ChainedMap } from './ChainedMap'
import { RollupOptions } from './Build/RollupOptions'
import { CommonJSOptions } from './Build/CommonJSOptions'
import { DynamicImportVarsOptions } from './Build/DynamicImportVarsOptions'
import { TerserOptions } from './Build/TerserOptions'
import { WatchOptions } from './Build/WatchOptions'

export class Build extends ChainedMap {
  constructor() {
    super()
    this.rollupOptions = new RollupOptions(this)
    this.commonjsOptions = new CommonJSOptions(this)
    this.dynamicImportVarsOptions = new DynamicImportVarsOptions(this)
    this.terserOptions = new TerserOptions(this)
    this.watch = new WatchOptions(this)
    this.extend([
      'target',
      'polyfillModulePreload',
      'outDir',
      'assetsDir',
      'assetsInlineLimit',
      'cssCodeSplit',
      'cssTarget',
      'sourcemap',
      'lib',
      'manifest',
      'ssrManifest',
      'ssr',
      'minify',
      'write',
      'emptyOutDir',
      'reportCompressedSize',
      'chunkSizeWarningLimit',
    ])
  }

  merge(obj = {}, omit = []) {
    const omissions = [
      'rollupOptions',
      'commonjsOptions',
      'dynamicImportVarsOptions',
      'terserOptions',
      'watch',
    ]

    omissions.forEach((key) => {
      if (!omit.includes(key) && key in obj)
        this[key].merge(obj[key])
    })

    return super.merge(obj, [...omit, ...omissions])
  }
}
