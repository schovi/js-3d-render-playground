import Vertex from './vertex'

export default class Model {
  constructor(source) {
    this.vertexes    = []
    this.fReferences = []

    source.split("\n").forEach((line) => {
      const [type, ...rest] = line.split(/\s+/)
      switch(type) {
        case "v":
          this.vertexes.push(new Vertex(...rest.map(parseFloat).map((val) => val * 100)))
          break
        case "f":
          this.fReferences.push(rest.map((vertex) => parseInt(vertex.split("/")[0]) - 1))
          break
      }
    })
  }

  get faces() {
    return (
      this.fReferences.map((fRefs) => {
        return fRefs.map((fRef) => {
          return this.vertexes[fRef]
        })
      })
    )
  }

  rotate(theta, phi, center) {
    center = center || this.center

    // Rotation matrix coefficients
    const ct = Math.cos(theta)
    const st = Math.sin(theta)
    const cp = Math.cos(phi)
    const sp = Math.sin(phi)

    this.vertexes.forEach((verticle) => {
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
