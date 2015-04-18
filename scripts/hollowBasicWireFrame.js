var w = window.innerWidth;
var h = window.innerHeight;

var container = document.getElementById("container");

var scene, camera, renderer, hollowModel;
var time = 0;
var modelLoaded = false;

function init(){

	scene = new THREE.Scene();

	// init camera
	camera = new THREE.PerspectiveCamera(45, w/h, 0.1,40000);
	scene.add(camera);

	// add lights
	var light = new THREE.PointLight(0xffffff);
	light.position.set(0,0,0);
	scene.add(light);

	// materials
	var whiteMat = new THREE.MeshPhongMaterial( { color: 0xffffff, wireframe: true, transparent: false, side:THREE.DoubleSide } );


	var loader = new THREE.JSONLoader();

	loader.load('models/hollowModel.js', function(result){
		hollowModel = new THREE.Mesh(result, whiteMat);

		hollowModel.rotation.set(90*Math.PI/180,0,0);

		hollowModel.position.set(0,0,-50);
		scene.add(hollowModel);
		modelLoaded = true;
	});

	// init renderer
	renderer = new THREE.WebGLRenderer({ preserveDrawingBuffer:false, alpha: true, antialias:true});
	renderer.setSize(w, h);

	container.appendChild(renderer.domElement);

	render();
}

function render(){
	time += 0.005;
	if(modelLoaded){
		//hollowModel.rotation.set(time,0,0);
	}
	renderer.render(scene, camera);

	window.requestAnimationFrame(render);
}

init();
