import Vertex from './vertex'

export default class Model {
  constructor(source) {
    this.vertexes    = []
    this.fReferences = []

    source.split("\n").forEach((line) => {
      const [type, ...rest] = line.split(/\s+/)
      switch(type) {
        case "v":
          this.vertexes.push(new Vertex(...rest.map(parseFloat).map((val) => val * 200)))
          break
        case "f":
          this.fReferences.push(rest.map((vertex) => vertex.split("/")[0]))
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
}
