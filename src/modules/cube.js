import Vertex from './vertex'

export default class Cube {
  constructor(center, size) {
    this.center = center
    this.size   = size

    this.calculateVerticles()
  }

  calculateVerticles() {
    const { center, size } = this
    const d = size / 2

    this.vertices = [
      new Vertex(center.x - d, center.y - d, center.z + d),
      new Vertex(center.x - d, center.y - d, center.z - d),
      new Vertex(center.x + d, center.y - d, center.z - d),
      new Vertex(center.x + d, center.y - d, center.z + d),
      new Vertex(center.x + d, center.y + d, center.z + d),
      new Vertex(center.x + d, center.y + d, center.z - d),
      new Vertex(center.x - d, center.y + d, center.z - d),
      new Vertex(center.x - d, center.y + d, center.z + d)
    ]
  }

  get faces() {
    return (
      [
        [this.vertices[0], this.vertices[1], this.vertices[2], this.vertices[3]],
        [this.vertices[3], this.vertices[2], this.vertices[5], this.vertices[4]],
        [this.vertices[4], this.vertices[5], this.vertices[6], this.vertices[7]],
        [this.vertices[7], this.vertices[6], this.vertices[1], this.vertices[0]],
        [this.vertices[7], this.vertices[0], this.vertices[3], this.vertices[4]],
        [this.vertices[1], this.vertices[6], this.vertices[5], this.vertices[2]]
      ]
    )
  }

  rotate(theta, phi, center) {
    center = center || this.center

    // Rotation matrix coefficients
    const ct = Math.cos(theta)
    const st = Math.sin(theta)
    const cp = Math.cos(phi)
    const sp = Math.sin(phi)

    this.vertices.forEach((verticle) => {
      // Rotation
      var x = verticle.x - center.x
      var y = verticle.y - center.y
      var z = verticle.z - center.z

      verticle.x = ct * x - st * cp * y + st * sp * z + center.x
      verticle.y = st * x + ct * cp * y - ct * sp * z + center.y
      verticle.z = sp * y + cp * z + center.z
    })
  }
}
