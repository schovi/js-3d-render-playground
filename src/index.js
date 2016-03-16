import './index.css'
import Vertex from './modules/vertex'
import Vertex2D from './modules/vertex_2d'
import Square from './modules/square'
import Cube from './modules/cube'
import Scene from './modules/scene'
import Model from './modules/model'
import Camera from './modules/camera'
import headSource from 'raw!./african_head.obj'
import './lib/FPSMeter'

function run() {
  const meter = new FPSMeter({
    interval: 200,
    theme:    'transparent',
    smoothing: 1,
    heat:     true,
    decimals: false,
    graph:    1,
    history:  20
  });

  const white = [255, 255, 255, 255]
  const dx = window.innerWidth / 2
  const dy = window.innerHeight / 2

  const camera = new Camera(new Vertex(-110, 0, 0))

  const scene = new Scene({
    canvas: document.getElementById("canvas"),
    width : window.innerWidth,
    height: window.innerHeight,
    ratio : 1,
    camera: camera,

    // // Ortographic View
    // projection: (vertex3d) => {
    //   const x = vertex3d.x + dx
    //   const y = vertex3d.z + dy
    //
    //   return new Vertex(x, y)
    // }

    // Perspective View
    projection: (vertex3d, camera) => {
      const d = 100
      const t = (camera.x - vertex3d.x) / d

      // Původně mi vyšlo mínus v: camera.y - (...)
      // Ale tím se osy posouvaly opačně, takže jsem to otočil na plus :)
      const x = camera.y + ((camera.y - vertex3d.y) / t) + dx
      const y = camera.z + ((camera.z - vertex3d.z) / t) + dy

      return new Vertex2D(x, y)
    }
  })

  // Cube
  const cubeCenter = new Vertex(100, 500, 0)
  const cubeSize   = 40
  const cube       = new Cube(cubeCenter, cubeSize)
  scene.objects.push(cube)

  // // Square
  // // TODO pozicovani spravne nefunguje :)
  // const squareCenter = new Vertex(100, 0, 0)
  // const squareSize   = 40
  // const square       = new Square(squareCenter, squareSize)
  // scene.objects.push(square)
  //
  // square.rotate(
  //   -Math.PI / 2,
  //   Math.PI / 1
  // )

  // Model
  const head = new Model(headSource)

  scene.objects.push(head)

  // scene.objects.push({
  //   faces: [
  //     [new Vertex(0,0,0), new Vertex(5, 10, 5), new Vertex(10, 15, 10)]
  //   ]
  // })

  scene.mesh([255, 255, 255, 255])

  const step = () => {
    // square.rotate(
    //   -Math.PI / 180,
    //   Math.PI / 250
    // )

    cube.rotate(
      -Math.PI / 360,
      Math.PI / 360 / 2
    )

    head.rotate(
      -Math.PI / 100,
      Math.PI / 50,
      new Vertex(0, 0, 0)
    )

    scene.mesh([255, 255, 255, 255])

    meter.tick();
    requestAnimationFrame(step)
  }

  requestAnimationFrame(step)
}

run()
