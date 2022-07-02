export class Chainable {
  constructor(parent) {
    this.parent = parent
  }

  batch(handler) {
    handler(this)
    return this
  }

  end() {
    return this.parent
  }
}
