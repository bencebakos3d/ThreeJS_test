import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { BloomEffect, BrightnessContrastEffect, EffectComposer, EffectPass, FXAAEffect, RenderPass, SMAAEffect } from 'postprocessing';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
  powerPreference: 'high-performance',
  antialias: false,
  stencil: false,
  depth: false,
});
renderer.setClearColor(0x000000, 0);
renderer.setAnti;
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.CineonToneMapping;
// renderer.toneMappingExposure = 1.5;
// renderer.render(scene, camera);

// const fxaaEffect = new FXAAEffect();\
const smaaEffect = new SMAAEffect();
const bloomEffect = new BloomEffect();
const brightEffect = new BrightnessContrastEffect({ brightness: 0.1, contrast: 0.1 });

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
composer.addPass(new EffectPass(camera, smaaEffect, bloomEffect, brightEffect));
// const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.2, 0.5, 0.5);

// composer.addPass(bloomPass);

const geometry = new THREE.TorusGeometry(10, 3, 32, 64);
const material = new THREE.MeshStandardMaterial({
  color: 0xff6347,
  roughness: 0.2,
});
const torus = new THREE.Mesh(geometry, material);

const envMap = new THREE.CubeTextureLoader().setPath('cubemap/').load(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png']);

scene.environment = envMap;

// const moonTexture = new THREE.TextureLoader().load('moon.jpg');
// const moonNormal = new THREE.TextureLoader().load('normal.jpg');

// const moon = new THREE.Mesh(
//   new THREE.SphereGeometry(3, 32, 32),
//   new THREE.MeshStandardMaterial({
//     map: moonTexture,
//     normalMap: moonNormal,
//     normalScale: new THREE.Vector2(0.5, 0.5),
//   })
// );
// torus.position.z = -15;
// moon.position.z = 30;
// scene.add(torus);

const pointLight = new THREE.PointLight(0xffffff, 2);
pointLight.position.set(20, 15, 5);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);

scene.add(pointLight, ambientLight);

const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(lightHelper, gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(1, 1, 0);

// function moveCamera() {
//   const t = document.body.getBoundingClientRect().top;
//   moon.rotation.x += 0.05;
//   moon.rotation.y += 0.075;
//   moon.rotation.z += 0.05;

//   camera.position.x = t * 0.0002;
//   camera.position.y = t * 0.0002;
//   camera.position.z = t * 0.01;
// }
// document.body.onscroll = moveCamera;

const loader = new GLTFLoader();
loader.load('global7500_seat.gltf', (gltfScene) => {
  gltfScene.scene.position.y = -0.2;
  scene.add(gltfScene.scene);
});

function animate() {
  // torus.rotation.x += 0.01;
  // torus.rotation.y += 0.005;
  // torus.rotation.z += 0.01;

  controls.update();

  composer.render();
  requestAnimationFrame(animate);
}
animate();
