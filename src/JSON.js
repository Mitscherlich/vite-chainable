import { ChainedMap } from './ChainedMap'

export class JSON extends ChainedMap {
  constructor(parent) {
    super(parent)
    this.extend([
      'namedExports',
      'stringify',
    ])
  }
}
