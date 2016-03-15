export default class Camera {
  constructor(vertex) {
    this.source = vertex
  }

  get x() {
    return this.source.x
  }

  get y() {
    return this.source.y
  }

  get z() {
    return this.source.z
  }
}
