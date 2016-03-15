const getPixelRation = (ctx) => {
  const dpr = window.devicePixelRatio || 1
  const bsr = ctx.webkitBackingStorePixelRatio ||
              ctx.mozBackingStorePixelRatio ||
              ctx.msBackingStorePixelRatio ||
              ctx.oBackingStorePixelRatio ||
              ctx.backingStorePixelRatio || 1

  return dpr / bsr
}

const applyHiDPICanvas = (canvas, width, height, ratio) => {
  canvas.width = width * ratio
  canvas.height = height * ratio
  canvas.style.width = width + "px"
  canvas.style.height = height + "px"
  canvas.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0)
}

export default class Scene {
  constructor({objects, dx, dy, canvas, camera, width, height, projection, ratio}) {
    const context   = this.context = canvas.getContext('2d')

    this.camera     = camera
    this.canvas     = canvas
    this.objects    = objects
    this.width      = width
    this.height     = height
    this.dx         = dx || width / 2
    this.dy         = dy || height / 2
    this.projection = projection

    // Setup canvas styling
    applyHiDPICanvas(canvas, width, height, ratio || getPixelRation(context))

    this.imageData = context.createImageData(1,1)
    this.pixelData = this.imageData.data

    this.objects   = []
  }

  clear() {
    this.draw('clearRect', 0, 0, this.canvas.width, this.canvas.height)
  }

  // pixel(x, y, [r, g, b, a]) {
  //   // Fill color
  //   this.pixelData[0]   = r;
  //   this.pixelData[1]   = g;
  //   this.pixelData[2]   = b;
  //   this.pixelData[3]   = a;
  //
  //   this.context.putImageData(this.imageData, x, y)
  // }

  pixel(x, y, [r, g, b, a]) {
    this.context.fillStyle = "rgba("+r+","+g+","+b+","+a+")"
    this.context.fillRect( x, y, 1, 1 )
  }

  line(x0, y0, x1, y1, color) {
    // Normalize to center of rendering
    let swap = false

    if(Math.abs(x0 - x1) < Math.abs(y0 - y1)) {
      [x0, y0, x1, y1] = [y0, x0, y1, x1]
      swap = true
    }

    if(x0 > x1) {
      [x0, x1, y0, y1] = [x1, x0, y1, y0]
    }

    const dx = x1 - x0
    const dy = y1 - y0
    const derror = Math.abs(dy) * 2
    const errorStep = dx * 2
    const yStep     = (y1 > y0 ? 1 : -1)
    let   error  = 0
    let   y      = y0

    for(let x = x0; x < x1; x += 1) {
      if(swap) {
        this.pixel(y, x, color)
      } else {
        this.pixel(x, y, color)
      }

      error += derror

      if(error > dx) {
        y     += yStep
        error -= errorStep
      }
    }
  }

  meshObject(object, color) {
    object.faces.forEach((face) => {
      face.forEach((vertex1, i) => {
        let vertex2 = face[i + 1]
        if(!vertex2) {
          vertex2 = face[0]
        }

        const p1 = this.projection(vertex1, this.camera)
        const p2 = this.projection(vertex2, this.camera)

        this.line(p1.x, p1.y, p2.x, p2.y, color)
      })
    })
  }

  mesh(color) {
    this.clear()
    this.objects.forEach((object) => {
      this.meshObject(object, color)
    })
  }

  draw(func, ...args) {
    // console.log('draw: ', func, args)
    this.context[func](...args)
  }

  // renderObject(object) {
  //   const { context, dx, dy, projection } = this
  //   const { faces } = object
  //
  //   faces.forEach(face => {
  //     // Draw the first vertex
  //     var P = projection(face[0])
  //     this.draw('moveTo', P.x + dx, -P.y + dy)
  //
  //     // Draw the other vertices
  //     face.forEach((vertex, i) => {
  //       const P = projection(vertex)
  //
  //       if(i === 0) {
  //         this.draw('beginPath')
  //       }
  //
  //       this.draw('lineTo', P.x + dx, -P.y + dy)
  //     })
  //
  //     // Close the path and draw the face
  //     this.draw('closePath')
  //     this.draw('stroke')
  //     this.draw('fill')
  //   })
  // }
  //
  // render() {
  //   this.draw('clearRect', 0, 0, this.canvas.width, this.canvas.height)
  //
  //   this.objects.forEach(object => {
  //     this.renderObject(object)
  //   })
  // }
}
