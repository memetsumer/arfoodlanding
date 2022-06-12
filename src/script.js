import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Loader
const loader = new GLTFLoader();

// Scene
const scene = new THREE.Scene();

var slices = new THREE.Group();

// Slice Pizza
loader.load(
  "models/slice/pizza.gltf",
  function (gltf) {
    const slice = gltf.scene;

    for (let i = 0; i < 2000; i++) {
      const mesh = slice.clone();

      mesh.position.x = (Math.random() - 0.5) * 100;
      mesh.position.y = (Math.random() - 0.5) * 100;
      mesh.position.z = (Math.random() - 0.5) * 100;

      mesh.rotation.x = Math.random() * 2 * Math.PI;
      mesh.rotation.y = Math.random() * 2 * Math.PI;
      mesh.rotation.z = Math.random() * 2 * Math.PI;

      slices.add(mesh);
    }
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

let pizza = new THREE.Object3D();

loader.load(
  "models/pizza/pizza.gltf",
  function (gltf) {
    pizza = gltf.scene;
    pizza.scale.set(6, 6, 6);
    slices.add(pizza);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

scene.add(new THREE.AmbientLight(0xf7efa6, 1.1));
scene.add(slices);

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 0;
camera.position.y = 5;
camera.position.z = 4;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.autoRotate = true;
controls.enableZoom = false;

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});

// a good blue color
renderer.setClearColor(0xdd7230, 1);
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const clock = new THREE.Clock();

let mouseX = 0;
let mouseY = 0;

window.addEventListener("mousemove", (e) => {
  mouseX = (e.clientX / sizes.width) * 2 - 1;
  mouseY = -(e.clientY / sizes.height) * 2 + 1;
});

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  pizza.rotation.y = elapsedTime * 0.2;

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
