import { ChainedMap } from './ChainedMap'

export class CSS extends ChainedMap {
  constructor(parent) {
    super(parent)
    this.extend([
      'modules',
      'postcss',
      'preprocessorOptions',
      'devSourcemap',
    ])
  }
}
