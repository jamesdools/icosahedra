var renderer, scene, camera;
var raycaster, mouse, vector;
var controls, zooming;
var meshes;
var webGL = false;

function setRenderer() {
  document.querySelector('.three-canvas').innerHTML = '';

  if (!webGL) {
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });
    webGL = true;

    document.querySelector('.control').style.backgroundColor = 'black';
    document.querySelector('.credit').style.backgroundColor = 'black';
  }
  else {
    renderer = new THREE.CanvasRenderer();
    webGL = false;

    document.querySelector('.control').style.background = 'none';
    document.querySelector('.credit').style.background = 'none';
  }

  renderer.setSize(window.innerWidth, window.innerHeight);
  document.querySelector('.three-canvas').appendChild(renderer.domElement);
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
  var material = new THREE.MeshBasicMaterial({wireframe: true, wireframeLinejoin: 'miter', skinning: true});
  material.color.setRGB(Math.random(), Math.random(), Math.random());

  var mesh = new THREE.Mesh(geometry, material);
  mesh.morphTargets = true;
  generateMorphTargets(mesh.geometry);

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

  raycaster.set(camera.position, vector.sub(camera.position).normalize());
  var intersections = raycaster.intersectObjects(meshes);

  if (intersections.length > 0 && intersections[0].object.type === 'Mesh') {
    var mesh = intersections[0].object;
    updateMorphs(mesh);
  }

  updateZoom();
  controls.update();
  renderer.render(scene, camera);
}

window.onload = () => {
  setup();
  draw();
};

function updateMorphs (mesh) {
	return function () {
    mesh.updateMorphTargets();
    mesh.geometry.verticesNeedUpdate = true;
    mesh.geometry.morphTargetsNeedUpdate = true;
    mesh.material.needsUpdate = true;
	};
}

function generateMorphTargets (geometry) {
	var vertices = [], scale;
	for (var i = 0; i < geometry.vertices.length; i++) {
		vertices.push(geometry.vertices[ i ].clone());

		scale = 1 + Math.random() * 0.3;
		vertices[ vertices.length - 1 ].x *= scale;
		vertices[ vertices.length - 1 ].y *= scale;
		vertices[ vertices.length - 1 ].z *= scale;
	}

	geometry.morphTargets.push({
    name: "target1",
    vertices: vertices
  });
}