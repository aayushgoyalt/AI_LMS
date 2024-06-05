'use strict';
import { onCleanup } from 'solid-js';
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default function() {
  let scene, camera, renderer, group, controls
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x051029);

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.set(0, 20, 200);
  camera.lookAt(scene.position);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth /2, window.innerHeight);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0xffffff, 4.5, 0, 0);
  pointLight.color.setHSL(Math.random(), 1, 0.5);
  pointLight.position.set(0, 100, 90);
  scene.add(pointLight);

  group = new THREE.Group();
  scene.add(group);

  const loader = new FontLoader();
  loader.load('/fonts/helvetiker_bold.typeface.json', (font) => {
    const textGeo = new TextGeometry('COREL.AI', {
      font: font,
      size: 30,
      height: 5,
      curveSegments: 10,
      bevelThickness: 2,
      bevelSize: 1.5,
      bevelEnabled: true,

    });
    textGeo.computeBoundingBox();
    const centerOffset = -0.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x);

    const materials = [
      new THREE.MeshPhongMaterial({ color: 0x051029, flatShading: true }),
      new THREE.MeshPhongMaterial({ color: 0xffffff }),
    ];

    const textMesh = new THREE.Mesh(textGeo, materials);
    textMesh.position.x = centerOffset;
    textMesh.position.y = 0;
    textMesh.position.z = 0;
    textMesh.rotation.x = 0;
    textMesh.rotation.y = Math.PI * 2;
    group.add(textMesh);
  });

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.1;
  controls.rotateSpeed = 0.5;

  function animate() {
    group.rotation.y += 0.005;
    controls.update();
    renderer.render(scene, camera);
  };
  renderer.setAnimationLoop( animate );

  onCleanup(() => {
    controls.dispose();
    renderer.dispose();
  });
  return renderer.domElement;
};
