import { ChainedMap } from './ChainedMap'

export class SSR extends ChainedMap {
  constructor(parent) {
    super(parent)
    this.extend([
      'external',
      'noExternal',
      'target',
      'format',
    ])
  }
}
