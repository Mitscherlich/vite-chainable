import { ChainedMap } from './ChainedMap'

export class Preview extends ChainedMap {
  constructor(parent) {
    super(parent)
    this.extend([
      'host',
      'port',
      'strictPort',
      'https',
      'open',
      'proxy',
      'cors',
    ])
  }
}
