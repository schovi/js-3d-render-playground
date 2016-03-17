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
    // heat:     true,
    decimals: false,
    // graph:    1,
    // history:  20
  });

  const white = [255, 255, 255, 255]
  const dx = window.innerWidth / 2
  const dy = window.innerHeight / 2

  const camera = new Camera(new Vertex(-100, 0, 0))

  let d = 100

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
      // const d = 300
      const t = (camera.x - vertex3d.x) / d

      // Původně mi vyšlo mínus v: camera.y - (...)
      // Ale tím se osy posouvaly opačně, takže jsem to otočil na plus :)
      const x = camera.y + ((camera.y - vertex3d.y) / t) + dx
      const y = camera.z + ((camera.z - vertex3d.z) / t) + dy

      return new Vertex2D(x, y)
    }
  })

  // Cube
  const cubeCenter = new Vertex(100, 0, 0)
  const cubeSize   = 40
  const cube       = new Cube(cubeCenter, cubeSize)
  // scene.objects.push(cube)

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

  // // Custom shape
  // scene.objects.push({
  //   faces: [
  //     [new Vertex(-3, 2, 1), new Vertex(3, 13, 11)]//, new Vertex(10, 70, 45)]
  //   ]
  // })

  // Initial render

  const render = () => {
    scene.mesh([255, 255, 255, 255])
    meter.tick();
  }

  render()

  const step = () => {
    head.rotate(
      -Math.PI / 100,
      Math.PI / 50,
      new Vertex(0, 0, 0)
    )

    render()
    requestAnimationFrame(step)
  }

  // requestAnimationFrame(step)

  let isMousedown = false
  let lastMouseX
  let lastMouseY
  let pendingMouseX
  let pendingMouseY

  document.addEventListener('mousedown', (event) => {
    isMousedown = true
    lastMouseX  = event.clientX
    lastMouseY  = event.clientY
  })

  document.addEventListener('mouseup', () => isMousedown = false )

  let pendingFrame

  const mousemoveStep = () => {
    const targetMouseX = pendingMouseX
    const targetMouseY = pendingMouseY

    var theta = (targetMouseX - lastMouseX) * Math.PI / 360 * -1
    var phi = (targetMouseY - lastMouseY) * Math.PI / 180

    head.rotate(
      theta,
      phi,
      new Vertex(0, 0, 0)
    )

    lastMouseX = targetMouseX
    lastMouseY = targetMouseY

    render()

    pendingFrame = undefined
  }

  document.addEventListener('mousemove', (event) => {
    pendingMouseX = event.clientX
    pendingMouseY = event.clientY

    if(isMousedown && !pendingFrame) {
      pendingFrame = requestAnimationFrame(mousemoveStep)
    }
  })

  document.addEventListener('mousewheel', (event) => {
    const delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));

    d += delta * 4

    render()

    event.preventDefault()
  })
}

run()
