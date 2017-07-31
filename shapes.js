var renderer, scene, camera;
var raycaster, mouse, vector;
var controls, zooming;
var meshes;
var webGL = false;
var animate = false;

function setRenderer() {
  document.querySelector('.three-canvas').innerHTML = '';

  if (!webGL) {
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });
    webGL = true;

    document.querySelector('.bottom-panel').style.backgroundColor = 'black';
  }
  else {
    renderer = new THREE.CanvasRenderer();
    webGL = false;

    document.querySelector('.bottom-panel').style.background = 'none';
  }

  renderer.setSize(window.innerWidth, window.innerHeight);
  document.querySelector('.three-canvas').appendChild(renderer.domElement);
}

function toggleAnimate() {
  if (animate) {
    animate = false;
    return;
  }

  animate = true;
}

function onDocumentMouseMove(event) {
  event.preventDefault();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

function setup() {
  if (!Detector.webgl) Detector.addGetWebGLMessage();

  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.set((Math.random() * 200) - 100, Math.random() * 150, 10);

  renderer = new THREE.CanvasRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.querySelector('.three-canvas').appendChild(renderer.domElement);

  controls = new THREE.OrbitControls(camera);
  controls.minDistance = 1;
  controls.maxDistance = 450;
  zooming = true;

  scene = new THREE.Scene();

  mouse = new THREE.Vector2();
  vector = new THREE.Vector3(mouse.x, mouse.y, 1);
  raycaster = new THREE.Raycaster();
  raycaster.params.Points.threshold = 0.1;

  meshes = [];
  for (var i = 0; i < 10; i++) addNewShape();

  document.addEventListener('mousemove', onDocumentMouseMove, false);
  window.addEventListener('resize', onWindowResize, false);
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

function addNewShape() {
  var geometry = new THREE.IcosahedronGeometry((Math.random() * 150), Math.floor(Math.random() * 3));
  var material = new THREE.MeshBasicMaterial({wireframe: true, wireframeLinejoin: 'miter', skinning: true, morphTargets: true});
  var mesh = new THREE.Mesh(geometry, material);

  material.color.setRGB(Math.random(), Math.random(), Math.random());

  scene.add(mesh);
  meshes.push(mesh);
}

function removeShape() {
  scene.remove(meshes.pop());
}

function draw() {
  setTimeout(() => {
    requestAnimationFrame(draw);
  }, 1000 / 30);

  meshes.forEach((mesh) => {
    mesh.rotation.x += 0.01;
  });

  // raycaster.set(camera.position, vector.sub(camera.position).normalize());
  raycaster.setFromCamera(mouse, camera);

  var intersections = raycaster.intersectObjects(scene.children);
  if (intersections.length > 0 && intersections[0].object.type === 'Mesh') {
    var mesh = intersections[0].object;

    if (animate) animateMesh(mesh);
  }

  updateZoom();
  controls.update();
  renderer.render(scene, camera);
}

window.onload = () => {
  setup();
  draw();
};

function animateMesh(mesh) {
  mesh.geometry.vertices.forEach((point) => {
    scale = 1.01 - Math.random() * 0.02;

    point.x *= scale;
    point.y *= scale;
    point.z *= scale;
  });

  mesh.geometry.verticesNeedUpdate = true;
  mesh.geometry.elementsNeedUpdate = true;
  mesh.geometry.morphTargetsNeedUpdate = true;
}
