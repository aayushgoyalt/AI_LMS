import { onCleanup, onMount } from 'solid-js';
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'; // Import OrbitControls

const ThreeText = () => {
  let container;

  onMount(() => {
    let scene, camera, renderer, group, controls; // Add controls variable

    const init = () => {
        // Scene, camera, and renderer setup
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x051029); // Set background color
      
        // Adjusted camera position and lookAt
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
        camera.position.set(0, 20, 200); // Move the camera back
        camera.lookAt(scene.position); // Look at the center of the scene
      
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth /2, window.innerHeight); // Set renderer size
      
        // Container setup
        container.appendChild(renderer.domElement);
      
        // Lighting setup
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        scene.add(ambientLight);
      
        const pointLight = new THREE.PointLight(0xffffff, 4.5, 0, 0);
        pointLight.color.setHSL(Math.random(), 1, 0.5);
        pointLight.position.set(0, 100, 90);
        scene.add(pointLight);
      
        // Group for rotating text
        group = new THREE.Group();
        scene.add(group);
      
        // Load font and create text
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
            new THREE.MeshPhongMaterial({ color: 0x051029, flatShading: true }), // Blue color
            new THREE.MeshPhongMaterial({ color: 0xffffff }), // White color
          ];
      
          const textMesh = new THREE.Mesh(textGeo, materials);
          textMesh.position.x = centerOffset;
          textMesh.position.y = 0; // Set text position in the middle of the canvas
          textMesh.position.z = 0;
          textMesh.rotation.x = 0;
          textMesh.rotation.y = Math.PI * 2;
      
          group.add(textMesh);
        });
      
        // OrbitControls setup
        controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.1;
        controls.rotateSpeed = 0.5;
      
        // Animation loop
        const animate = () => {
          requestAnimationFrame(animate);
          group.rotation.y += 0.01;
          controls.update(); // Update controls
          renderer.render(scene, camera);
        };
      
        animate();
      };
      

    init();

    onCleanup(() => {
      controls.dispose(); // Dispose controls on cleanup
      renderer.dispose();
      container.removeChild(renderer.domElement);
    });
  });

  return <div ref={el => (container = el)} style={{ width: '50%', height: '100%', float: 'left' }} />; // Set div style
};

export default ThreeText;
