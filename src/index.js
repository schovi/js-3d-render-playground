import './index.css'
import Vertex from './modules/vertex'
import Vertex2D from './modules/vertex_2d'
import Square from './modules/square'
import Cube from './modules/cube'
import Scene from './modules/scene'
import Model from './modules/model'
import headSource from 'raw!./african_head.obj'

function run() {
  const white = [255, 255, 255, 255]
  const dx = window.innerWidth / 2
  const dy = window.innerHeight / 2
  const scene = new Scene({
    canvas: document.getElementById("canvas"),
    width : window.innerWidth,
    height: window.innerHeight,
    ratio : 1,
    // Ortographic View
    // projection: (M) => new Vertex2D(M.x, M.z)
    // // Perspective View
    projection: (M) => {
      const d = 400
      // NOTE: d / 40 is fix for y = 0
      const r = M.y === 0 ? d / 40 : d / M.y

      // dx, dy is just corection to center of view
      const x = r * M.x + dx
      const y = r * M.z + dy

      return new Vertex2D(x, y)
    }
  })

  // Cube
  const cubeCenter = new Vertex(0, -50, 0)
  const cubeSize   = 10
  const cube       = new Cube(cubeCenter, cubeSize)
  scene.objects.push(cube)

  // // Square
  // const squareCenter = new Vertex(0, 0, 0)
  // const squareSize   = 10
  // const square       = new Square(squareCenter, squareSize)
  // scene.objects.push(square)

  // Model
  const teapot = new Model(headSource)

  // scene.objects.push(teapot)

  scene.mesh([255, 255, 255, 255])

  const step = () => {
    // square.rotate(
    //   -Math.PI / 720,
    //   Math.PI / 720
    // )

    cube.rotate(
      -Math.PI / 360,
      Math.PI / 360 / 2
    )

    scene.mesh([255, 255, 255, 255])

    requestAnimationFrame(step)
  }

  requestAnimationFrame(step)
}

run()
