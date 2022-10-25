import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { BloomEffect, BrightnessContrastEffect, EffectComposer, EffectPass, HueSaturationEffect, RenderPass, SMAAEffect } from 'postprocessing';

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

const smaaEffect = new SMAAEffect();
const bloomEffect = new BloomEffect();
const brightEffect = new BrightnessContrastEffect({ brightness: 0.1, contrast: 0.1 });
const huesatEffect = new HueSaturationEffect({ saturation: -0.6 });

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
composer.addPass(new EffectPass(camera, smaaEffect, bloomEffect, brightEffect, huesatEffect));

const envMap = new THREE.CubeTextureLoader().setPath('cubemap/').load(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png']);
scene.environment = envMap;

const pointLight = new THREE.PointLight(0xffffff, 2);
pointLight.position.set(20, 15, 5);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);

scene.add(pointLight, ambientLight);

const gridHelper = new THREE.GridHelper(10, 50);
scene.add(gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(1, 1, 0);

const loader = new GLTFLoader();
loader.load('global7500_seat.gltf', (gltfScene) => {
  gltfScene.scene.position.y = -0.2;
  scene.add(gltfScene.scene);
});

function animate() {
  controls.update();

  composer.render();
  requestAnimationFrame(animate);
}
animate();
