var w = window.innerWidth;
var h = window.innerHeight;

var container = document.getElementById("container");

var scene, camera, renderer, hollowModel, hollowModel2, shader, semShader, mouseX, mouseY, oGeom, oVerts, tempVerts = [];
var objects = [];
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var time = 0;
var modelLoaded = false;
var clock = new THREE.Clock();

document.addEventListener('mousemove', onDocumentMouseMove, false);
document.addEventListener('mousedown', onDocumentMouseDown, false);

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
	var whiteMat = new THREE.MeshPhongMaterial( { color: 0xffffff, wireframe: false, transparent: false, side:THREE.DoubleSide } );

	shader = new THREE.ShaderMaterial( {
		uniforms: {
			displacement: { type: 'f', value: 1.0 },
			matCap: { type: 't', value: THREE.ImageUtils.loadTexture('images/matCap.jpg')},
			matCap2: { type: 't', value: THREE.ImageUtils.loadTexture('images/grill.png')},
			hit: {type: 'v3', value: new THREE.Vector3(1,1,1)}
		},
		vertexShader: document.getElementById('vertexShader').textContent,
		fragmentShader: document.getElementById('fragmentShader').textContent
	});


	semShader = new THREE.ShaderMaterial({
		uniforms:{
			tex: {type: 't', value: THREE.ImageUtils.loadTexture('images/gold2.png')},
			tNormal: {type: 't', value: THREE.ImageUtils.loadTexture('images/2563-normalLight.jpg')},
			repeat: { type: 'v2', value: new THREE.Vector2(1,1) },
			useNormal: {type: 'f', value: 1 },
			useRim: {type: 'f', value: 1.0},
			rimPower: {type: 'f', value: 2.5},
			normalScale: {type: 'f', value: 1.05 },
			normalRepeat: {type: 'f', value: 2.0}
		},
		vertexShader: document.getElementById('semVert').textContent,
		fragmentShader: document.getElementById('semFrag').textContent,
		transparent: true,
		shading: THREE.SmoothShading,
		side: THREE.DoubleSide,
		wireframe: false
	});

	semShader.uniforms.tNormal.value.wrapS = semShader.uniforms.tNormal.value.wrapT = 
	THREE.RepeatWrapping;



	var loader = new THREE.JSONLoader();


	loader.load('models/buddha.js', function(result){
		//result = assignUVs(result);
		assignUVs(result);
		result.verticesNeedUpdate = true;
	    result.normalsNeedUpdate = true;
	   	result.uvsNeedUpdate = true;
	   	//result.computeCentroids();
	    result.computeFaceNormals();
	    result.computeVertexNormals();
	    result.computeMorphNormals();
	    result.computeTangents();

		hollowModel = new THREE.Mesh(result, semShader);
		hollowModel2 = new THREE.Mesh(result, semShader);
		//hollowModel.rotation.set(0,0,0);
		//hollowModel.rotation.set(100*Math.PI/180,0,0);
		//hollowModel.scale.set(0.035,0.035,0.025);
		hollowModel.position.set(0,-0,-2);

		//scene.add(hollowModel);

		oGeom = hollowModel2.geometry;
		oVerts = oGeom.vertices;

		for( var i =0; i< oVerts.length; i++){
			var p = oVerts[i];
			tempVerts[i] = [p.x,p.y,p.z,0,0];
		}

		//hollowModel2.rotation.set(100*Math.PI/180,0,0);
		//hollowModel2.scale.set(0.035,0.035,0.025);
		hollowModel2.position.set(0,-400,-1500.99);
		scene.add(hollowModel2);

		objects.push(hollowModel2);

		modelLoaded = true;
		console.log(hollowModel);
	});

/*
	var cubeGeo = new THREE.BoxGeometry(1,1,1);

	var cube = new THREE.Mesh(cubeGeo, shader);
	cube.position.set(0,0,-10);
	scene.add(cube);
*/

	// init renderer
	renderer = new THREE.WebGLRenderer({ preserveDrawingBuffer:false, alpha: false, antialias:true});
	renderer.setSize(w, h);

	container.appendChild(renderer.domElement);

	render();
}

function render(){
	var delta = 10* clock.getDelta();

	if(modelLoaded){
	




	raycaster.setFromCamera(mouse, camera);
	var intersects = raycaster.intersectObjects(scene.children);



	/*
	if(intersects.length > 0){
		//console.log(intersects);
		//shader.uniforms.displacement.value += 1.05;
		shader.uniforms.hit.value = intersects[0].point;
		hollowModel.geometry.verticesNeedUpdate = true;
		//hollowModel.geometry.faces[intersects[0].faceIndex].a += 1;
		//hollowModel.geometry.faces[intersects[0].faceIndex].b += 1;
		//hollowModel.geometry.faces[intersects[0].faceIndex].c -= 2.0;
		intersects[0].object.geometry.vertices[intersects[0].face.a].x -= intersects[0].face.vertexNormals[0].x*10.05;
		intersects[0].object.geometry.vertices[intersects[0].face.a].y -= intersects[0].face.vertexNormals[0].y*10.05;
		intersects[0].object.geometry.vertices[intersects[0].face.a].z -= intersects[0].face.vertexNormals[0].z*10.05;

		intersects[0].object.geometry.vertices[intersects[0].face.b].x -= intersects[0].face.vertexNormals[1].x*10.05;
		intersects[0].object.geometry.vertices[intersects[0].face.b].y -= intersects[0].face.vertexNormals[1].y*10.05;
		intersects[0].object.geometry.vertices[intersects[0].face.b].z -= intersects[0].face.vertexNormals[1].z*10.05;

		intersects[0].object.geometry.vertices[intersects[0].face.c].x -= intersects[0].face.vertexNormals[2].x*10.05;
		intersects[0].object.geometry.vertices[intersects[0].face.c].y -= intersects[0].face.vertexNormals[2].y*10.05;
		intersects[0].object.geometry.vertices[intersects[0].face.c].z -= intersects[0].face.vertexNormals[2].z*10.05;
		//console.log(intersects[0]);
		//console.log(hollowModel.geometry.faces[intersects[0].faceIndex].c);
	} else if(shader.uniforms.displacement.value > 1){
		//shader.uniforms.displacement.value -= 0.3;
	}
	*/
	var modifier = new THREE.BendModifier();

	if(intersects.length > 0){
		var face = intersects[ 0 ].face;
		var direction = new THREE.Vector3();
		direction.copy(face.normal);
		//console.log(direction);
		direction.multiplyScalar(-1);
		var obj = intersects[0].object;
		modifier.set(intersects[0].point, new THREE.Vector3(direction.x, direction.y, direction.z), 100.1, 20.5 * delta).modify(obj).update();
	} 

	else if(intersects.length <= 0){

		var curGeom = hollowModel2.geometry;
		var curVerts = curGeom.vertices;

		for(var i = 0; i<curVerts.length; i++){
			p = curVerts[i];
			var vt = tempVerts[i];

			var d = Math.abs( p.x - vt[ 0 ] ) + Math.abs( p.y - vt[ 1 ] ) + Math.abs( p.z - vt[ 2 ] );
				//console.log(d);
			if( d > 0 ){
				hollowModel2.geometry.verticesNeedUpdate = true;
				p.x -= 0.025* ( p.x - vt[ 0 ] )  ;
				p.y -= 0.025* ( p.y - vt[ 1 ] )   ;
				p.z -= 0.025* ( p.z - vt[ 2 ] )   ;
			}

		}
	}

	time += 0.005;
	
		//hollowModel.rotation.set(time,0,0);
		hollowModel2.rotation.y = time;
	}
	renderer.render(scene, camera);

	window.requestAnimationFrame(render);
}

function onDocumentMouseDown(event){
	console.log(oVerts.length);
}


function onDocumentMouseMove(event){
	var mX = event.clientX ;
	var mY = event.clientY ;

	mouseX = map(mX, w, 200,0);
    mouseY = (event.clientY );

    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

function map(value,max,minrange,maxrange) {
    return ((max-value)/(max))*(maxrange-minrange)+minrange;
}

function assignUVs(geometry) {


    geometry.computeBoundingBox();

    var max     = geometry.boundingBox.max;
    var min     = geometry.boundingBox.min;

    var offset  = new THREE.Vector2(0 - min.x, 0 - min.y);
    var range   = new THREE.Vector2(max.x - min.x, max.y - min.y);

    geometry.faceVertexUvs[0] = [];
    var faces = geometry.faces;

    for (i = 0; i < geometry.faces.length ; i++) {

      var v1 = geometry.vertices[faces[i].a];
      var v2 = geometry.vertices[faces[i].b];
      var v3 = geometry.vertices[faces[i].c];

      geometry.faceVertexUvs[0].push([
        new THREE.Vector2( ( v1.x + offset.x ) / range.x , ( v1.y + offset.y ) / range.y ),
        new THREE.Vector2( ( v2.x + offset.x ) / range.x , ( v2.y + offset.y ) / range.y ),
        new THREE.Vector2( ( v3.x + offset.x ) / range.x , ( v3.y + offset.y ) / range.y )
      ]);

    }

    geometry.uvsNeedUpdate = true;
}


init();
