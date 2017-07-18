var renderer, scene, camera;
var controls, zooming;
var meshes;

function setup() {
  if (!Detector.webgl) Detector.addGetWebGLMessage();

  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.set((Math.random() * 200) - 100, Math.random() * 150, 10);

  // renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer = new THREE.CanvasRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.querySelector('.three-canvas').appendChild(renderer.domElement);
  renderer.setClearColor(0x000000);

  controls = new THREE.OrbitControls(camera);
  controls.minDistance = 1;
  controls.maxDistance = 450;
  zooming = true;

  scene = new THREE.Scene();
  meshes = [];

  for (var i = 0; i < 10; i++) {
    var geometry = new THREE.IcosahedronGeometry((Math.random() * 150), Math.floor(Math.random() * 3));
    var material = new THREE.MeshBasicMaterial({wireframe: true, wireframeLineWidth: 10, wireframeLinejoin: 'miter', skinning: true});
    material.color.setRGB(Math.random(), Math.random(), Math.random());
    var mesh = new THREE.Mesh(geometry, material);

    scene.add(mesh);
    meshes.push(mesh);
  }
}

function draw() {
  setTimeout(() => {
    requestAnimationFrame(draw);
  }, 1000 / 30);

  meshes.forEach((mesh) => {
    mesh.rotation.x = Date.now() * 0.0003;
  });

  updateZoom();
  controls.update();
  renderer.render(scene,camera);
}

function updateZoom() {
  if (zooming) {
    camera.position.z -= 0.5;
    if (camera.position.z < 50) zooming = false;
  }

  if (!zooming) { // going out
    camera.position.z += 0.5;
    if (camera.position.z > 200) zooming = true;
  }
}

window.onload = () => {
  setup();
  draw();
};
