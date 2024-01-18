import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
const treeModelPath = 'redwoods.glb'; // Replace with the path to your tree GLTF model
const treeLoader = new GLTFLoader();
const clock = new THREE.Clock();
let treeModel, atstModel;
let terrainSize; // Declare terrainSize globally
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 3500);


let ATSTanimations, mixer, idleAction, walkAction, walkBackwards, xwing, xwingReal;
let atstModelPlane;
treeLoader.load('GLTF/scene.gltf', (gltf) => {
	xwing = gltf.scene;
	xwing.scale.set(4.3, 4.3, 4.3);
	xwing.rotation.y = Math.PI * 2 + 1;
	xwing.position.set(-50, 58, -100);
	scene.add(xwing);
	
});

treeLoader.load('x-wing.glb', (gltf) => {
	xwingReal = gltf.scene;
	xwingReal.scale.set(0.9, 0.9, 0.9);
	xwingReal.rotation.y = Math.PI * 2 - 1;
	xwingReal.position.set(70, 75, -150);
	scene.add(xwingReal);
	
});

const loadertext = new FontLoader();

loadertext.load( '/Roboto_Regular.json', function ( font ) {

	const geometrytext = new TextGeometry( 'THE END', {
		font: font,
		size: 800,
		height: 5,
		curveSegments: 12,
		bevelEnabled: true,
		bevelThickness: 4,
		bevelSize: 8,
		bevelOffset: 0,
		bevelSegments: 5
	} );
    const geometryMaterialTest = new THREE.MeshBasicMaterial({color: 0xffff00});
    const textMesh = new THREE.Mesh( geometrytext, geometryMaterialTest)
    textMesh.scale.set(0.05, 0.05, 0.05);
    textMesh.position.set(-150, 77, -250);
    scene.add(textMesh);
} );

treeLoader.load('JustWorkOk.glb', (gltf) => {
	atstModel = gltf.scene;
	atstModel.position.set(0, 60, -5);
	atstModel.rotation.set(0, 0, 0);
	atstModel.rotation.y = Math.PI;
	atstModel.scale.set(0.2, 0.2, 0.2);
	
	scene.add(atstModel);
	
	if(atstModel) {
		ATSTanimations = gltf.animations;
		mixer = new THREE.AnimationMixer(atstModel);
	
		// Create animation actions
		
		


		const planeWidth = 3;
		const planeHeight = 3;

		// Create a plane geometry
		const planeGeometry = new THREE.PlaneGeometry(planeWidth, planeHeight);

		// Create a material with zero opacity
		const planeMaterial = new THREE.MeshBasicMaterial({transparent: true, opacity: 0});

		// Create the plane mesh
		atstModelPlane = new THREE.Mesh(planeGeometry, planeMaterial);

		// Position the plane below the AT-ST model
		 // Adjust the Y position to be below the model

		// Add the plane to the scene
		atstModelPlane.rotation.x = Math.PI;
		scene.add(atstModelPlane);
		
	}


});
let treeInstance;
let wPressed = false;
let aPressed = false;
let sPressed = false;
let dPressed = false;
let spacePressed = false;
let upPressed = false;
let downPressed = false;
let enterPressed = false;
var leftPressed = false;
var rotationSpeed = Math.PI * 2 / (60 * 1.5); // 360 degrees over 1.5 seconds at 60 FPS

var rotationStartTime;
let rightPressed = false;
let playsound = true;

function playMusic() {
	sound.stop();
	playsound = false;
	audioLoader.load( 'Audio/EwokMusic.mp3', function( buffer ) {
		sound.setBuffer( buffer );
		sound.setLoop(true);
		sound.setVolume(0.6);
		sound.play();
		
	});
}
// Add an event listener for the keydown event
document.addEventListener("keydown", function(event) {
    // Check the event.code property to identify which key was pressed
    switch (event.code) {
      case "KeyW":
        // Set wPressed to true
        wPressed = true;
        console.log('KeyW')
		
		
        break;
      case "KeyA":
        // Set aPressed to true
        aPressed = true;
        console.log('KeyA');
		
		idleAction.timeScale = -1.5;
		
		
        break;
      case "KeyS":
        // Set sPressed to true
        sPressed = true;
        console.log('KeyS');
		walkBackwards.timeScale = -1.5;
		
		
        break;
      case "KeyD":
        // Set dPressed to true
        dPressed = true;
        console.log('KeyD');
		
		
        break;

		case "Space":
        // Set dPressed to true
        spacePressed = true;
        
		
        break;

		case "ArrowUp":
        // Set dPressed to true
        upPressed = true;
        console.log('ArrowUp');
		break;

		case "ArrowDown":
        // Set dPressed to true
        downPressed = true;
        console.log('ArrowDown');
		break;

		case "ArrowLeft":
        // Set dPressed to true
        leftPressed = true;
        console.log('ArrowLeft');
		break;

		case "ArrowRight":
        // Set dPressed to true
        rightPressed = true;
        console.log('ArrowRight');
		break;

		case "Enter":
        // Set dPressed to true
        enterPressed = !enterPressed;
        console.log('Enter');
		break;

		
	
    }
	runAnimations();
  });
  
  const listener = new THREE.AudioListener();
  camera.add( listener );
  
  // create a global audio source
  const sound = new THREE.Audio( listener );
  
  // load a sound and set it as the Audio object's buffer
  const audioLoader = new THREE.AudioLoader();

  
   
	audioLoader.load( 'Audio/EWOKS.ogg', function( buffer ) {
	  sound.setBuffer( buffer );
	  sound.setLoop(true);
	  sound.setVolume(0.5);
	  sound.play();
  });


  // Add an event listener for the keyup event
  document.addEventListener("keyup", function(event) {
    // Check the event.code property to identify which key was released
    switch (event.code) {
        case "KeyW":
            // Set wPressed to false
            wPressed = false;
			walkAction.stop();
			idleAction.stop();
            break;
        case "KeyA":
            // Set aPressed to false
            aPressed = false;
			idleAction.play();
			
            break;
        case "KeyS":
            // Set sPressed to false
            sPressed = false;
			walkAction.stop();
			walkBackwards.stop();
			idleAction.play();
			
            break;
        case "KeyD":
            // Set dPressed to false
            dPressed = false;
			idleAction.play();
            break;

		case "Space":
			// Set dPressed to true
			spacePressed = false;
			console.log('Space');
			const gunshot1 = new THREE.Audio(listener);
			audioLoader.load( 'Audio/gunshot.mp3', function( buffer ) {
				gunshot1.setBuffer( buffer );
				gunshot1.setLoop(false);
				gunshot1.setVolume(0.8);
				gunshot1.play();
				
			});
			break;

			case "ArrowUp":
			// Set dPressed to true
			upPressed = false;
			
			break;

			case "ArrowDown":
			// Set dPressed to true
			downPressed = false;
			
			break;

			
        
    }
  });
  
// Load the tree model
treeLoader.load(treeModelPath, (gltf) => {
    treeModel = gltf.scene;
    treeModel.scale.set(0.05, 0.08, 0.05); // Adjust scale as needed
	
    
});

function placeRandomTrees(numTrees) {
    if (!treeModel) {
        console.error('Tree model not loaded yet.');
        return;
    }

    for (let i = 0; i < numTrees; i++) {
        const randomX = 1 * (Math.random() * 5000 - 25000 / 10);
 		const randomZ = 1 * (Math.random() * 5000 - 25000 / 10);

		const treeHeight = Math.floor(Math.random() * 31) + 170;

        const treeInstance = treeModel.clone();
        treeInstance.position.set(randomX, treeHeight, randomZ);
		
        if(treeInstance.position != atstModel.position) {
			scene.add(treeInstance);
			treeInstanceToCollideWith.push(treeInstance);
			console.log(treeInstanceToCollideWith);
		}
    }
}

let villageLoader = new GLTFLoader();
villageLoader.load('EwokVillage/scene.gltf', (gltf) => {
     const treeModel2 = gltf.scene;
    treeModel2.scale.set(10, 10, 10); // Adjust scale as needed
	
	//
	if(treeModel && treeModel2) {// Once the tree model is loaded, create the terrain
			
			for (let i = 0; i < 150; i++) {
				const randomX2 = 1 * (Math.random() * 5000 - 25000 / 10);
				 const randomZ2 = 1 * (Math.random() * 5000 - 25000 / 10);
		
				const treeHeight2 = Math.floor(Math.random() * 5) + 140;
		
				const treeInstance2 = treeModel2.clone();
				treeInstance2.position.set(randomX2, treeHeight2, randomZ2);
				
				scene.add(treeInstance2);
				console.log("added village instance");
			}
			createTerrain();
		}
}
  
);


let villageLoader2 = new GLTFLoader();







	














const heightmapImage = 'heightmap.png';
const grassTextureImage = 'grass_texture.jpg';

const scene = new THREE.Scene();
const loaderTexture = new THREE.CubeTextureLoader();
const texture = loaderTexture.load([
  'EwokSkybox/Side1.png',
  'EwokSkybox/Side1.png',
  'EwokSkybox/sky.png',
  'EwokSkybox/ground.png',
  'EwokSkybox/Side2.png',
  'EwokSkybox/Side2.png',
]);
scene.background = texture;

function openPopup() {
	document.getElementById("overlay").style.display = "flex";
}

function closePopup() {
	document.getElementById("overlay").style.display = "none";
}


function openPopup2() {
	document.getElementById("overlay2").style.display = "flex";
}

function closePopup2() {
	document.getElementById("overlay2").style.display = "none";
}

function areModelsClose(model1, model2, thresholdDistance) {
    const distance = model1.position.distanceTo(model2.position);
    return distance < thresholdDistance;
	
}

let controllerIndex = null;

    window.addEventListener("gamepadconnected", (event) => {
      const gamepad = event.gamepad;
      console.log("Connected", gamepad);
      controllerIndex = gamepad.index;
    });
    
    window.addEventListener("gamepaddisconnected", (e) => {
      console.log("Gamepad disconnected from index");
      controllerIndex = null;
    });
    
    let aSpeed = false;

    function handleButtons(buttons) {
      const buttonState = {};
    
      for (let i = 0; i < buttons.length; i++) {
        const button = buttons[i];
        buttonState[`button_${i}`] = button.pressed;
      }
    
      // Assuming you have thumbsticks
      const axes = navigator.getGamepads()[controllerIndex].axes; // Incorrect - change to navigator.getGamepads()[controllerIndex].axes
      buttonState.up = axes[1] < -0.5;
      buttonState.down = axes[1] > 0.5;
      buttonState.left = axes[0] < -0.5;
      buttonState.right = axes[0] > 0.5;
    
      // Example: Storing values in separate variables
      const { up, down, left, right, button_0 } = buttonState;
    
      // You can use up, down, left, right variables as needed.
      console.log("Up:", up, "Down:", down, "Left:", left, "Right:", right, "Button A:", button_0);
      wPressed = up;
      sPressed = down;
      aPressed = left;
      dPressed = right;
      aSpeed = button_0;
    }

var renderer = new THREE.WebGLRenderer({ antialias: true });

document.body.appendChild(renderer.domElement);

renderer.setPixelRatio(window.devicePixelRatio);

renderer.setSize(window.innerWidth, window.innerHeight);
const loader = new THREE.TextureLoader();
const heightmapTexture = loader.load(heightmapImage, function () {
    // Heightmap texture loaded callback
});
const treeInstanceToCollideWith =[];
const grassTexture = loader.load(grassTextureImage);
grassTexture.wrapS = THREE.RepeatWrapping;
grassTexture.wrapT = THREE.RepeatWrapping;
const grassTextureRepeat = 25000;
let intersectsTrees
let bullets = [];
spacePressed = false;
var treeCaster = new THREE.Raycaster();
let playerPosition;
const gunshot2 = new THREE.Audio(listener);
audioLoader.load( 'Audio/EwokNoise.mp3', function( buffer ) {
		gunshot2.setBuffer( buffer );
		gunshot2.setLoop(false);
		gunshot2.setVolume(0.8);
		
				
});







function updateAnimation() {

	playerPosition = atstModel.position;
	
	treeCaster.set(playerPosition, new THREE.Vector3(0, 0, -1).applyMatrix4(scene.matrixWorld));
	intersectsTrees = treeCaster.intersectObjects(treeInstanceToCollideWith);

	if (intersectsTrees.length > 0.1) {
		// Collision detected
		
		var intersection2 = intersectsTrees[0].distance;
		if(intersection2 < 3) {
			atstModel.position.set(0, 60, 0);
			atstModel.rotation.y = Math.PI;
			gunshot2.play();


		}
	}


	treeCaster.set(playerPosition, new THREE.Vector3(0, 0, 1).applyMatrix4(scene.matrixWorld));
	intersectsTrees = treeCaster.intersectObjects(treeInstanceToCollideWith);


	if (intersectsTrees.length > 0.1) {
		// Collision detected
		
		var intersection2 = intersectsTrees[0].distance;
		if(intersection2 < 3) {
			atstModel.position.set(0, 60, 0);
			atstModel.rotation.y = Math.PI;
			gunshot2.play();
		}
	}



	treeCaster.set(playerPosition, new THREE.Vector3(-1, 0, 0).applyMatrix4(scene.matrixWorld));
	intersectsTrees = treeCaster.intersectObjects(treeInstanceToCollideWith);
	if (intersectsTrees.length > 0.1) {
		// Collision detected
		
		var intersection2 = intersectsTrees[0].distance;
		if(intersection2 < 3) {
			atstModel.position.set(0, 60, 0);
			atstModel.rotation.y = Math.PI;
			gunshot2.play();
		}
	}



	treeCaster.set(playerPosition, new THREE.Vector3(1, 0, 0).applyMatrix4(scene.matrixWorld));
	intersectsTrees = treeCaster.intersectObjects(treeInstanceToCollideWith);
	
	 

	if (intersectsTrees.length > 0.1) {
		// Collision detected
		
		var intersection2 = intersectsTrees[0].distance;
		if(intersection2 < 3) {
			atstModel.position.set(0, 60, 0);
			atstModel.rotation.y = Math.PI;
			gunshot2.play();
		}
	}
	const angle = atstModel.rotation.y;

    if (wPressed) {
        atstModel.position.x += 1.2 * Math.sin(angle);
        atstModel.position.z += 1.2 * Math.cos(angle);
		
    } else if (sPressed) {
        atstModel.position.x += -0.7 * Math.sin(angle);
        atstModel.position.z += -0.7 * Math.cos(angle);
    } 
	
	if (aPressed) {
        atstModel.position.x += -0.03 * Math.cos(angle);
        atstModel.position.z += -0.03 * Math.sin(angle);
        atstModel.rotation.y += 0.03;
    } else if (dPressed) {
        atstModel.position.x += 0.03 * Math.cos(angle);
        atstModel.position.z += 0.03 * Math.sin(angle);
        atstModel.rotation.y += -0.03;
    }

	if (leftPressed) {
		if (!rotationStartTime) {
		  // Record the start time if rotation has just started
		  rotationStartTime = Date.now();
		}
	
		// Calculate elapsed time since rotation started
		var elapsedTime = Date.now() - rotationStartTime;
	
		// Update rotation based on elapsed time and speed
		atstModel.rotation.z += rotationSpeed * elapsedTime / 4;
	
		// Check if a full rotation is completed
		if (atstModel.rotation.z >= Math.PI * 2) {
		  atstModel.rotation.z = 0; // Reset rotation to zero
		  leftPressed = false; // Reset the flag after rotation is complete
		  rotationStartTime = null; // Reset start time
		} 
	}else if(rightPressed) {
		if (!rotationStartTime) {
			// Record the start time if rotation has just started
			rotationStartTime = Date.now();
		  }
	  
		  // Calculate elapsed time since rotation started
		  var elapsedTime = Date.now() - rotationStartTime;
	  
		  // Update rotation based on elapsed time and speed
		  atstModel.rotation.z += rotationSpeed * elapsedTime / 4;
	  
		  // Check if a full rotation is completed
		  if (atstModel.rotation.z >= Math.PI * 2) {
			atstModel.rotation.z = 0; // Reset rotation to zero
			rightPressed = false; // Reset the flag after rotation is complete
			rotationStartTime = null; // Reset start time
			console.log("Right ended?");
		  }
		}
	

	if (spacePressed || aSpeed) {
		// Create two bullets
		for (let i = 0; i < 2; i++) {
			const bulletGeometry = new THREE.SphereGeometry(0.6, 8, 8);
			const bulletMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
			const bullet = new THREE.Mesh(bulletGeometry, bulletMaterial);
	
			// Set the position of the bullets relative to the shooter
			bullet.position.copy(atstModel.position);
			bullet.position.y += 1;
			
			
	
			// Set the velocity of the bullet based on the shooter's rotation
			const bulletSpeed = 4;
			const direction = new THREE.Vector3(0, -0.001, 1);
			const rotationMatrix = new THREE.Matrix4();
			rotationMatrix.makeRotationY(atstModel.rotation.y);
			direction.applyMatrix4(rotationMatrix);
			direction.normalize();
			direction.multiplyScalar(bulletSpeed);
			bullet.velocity = direction;
	
			// Add the bullet to the scene
			scene.add(bullet);
	
			// Add the bullet to the bullets array for later reference
			bullets.push(bullet);
		}
	
		// Reset shooting variable to false
		isShooting = false;
	}
	
	// Update bullet positions
	bullets.forEach(bullet => {
		bullet.position.add(bullet.velocity);
	});
	
	// Remove bullets that are out of bounds
	bullets.forEach((bullet, index) => {
		if (bullet.position.z < -10) {
			// Remove the bullet from the scene
			scene.remove(bullet);
	
			// Remove the bullet from the bullets array
			bullets.splice(index, 1);
		}
	});

	
	const offset = new THREE.Vector3(0, 100, -150); // Adjust this offset as needed
    const relativeCameraOffset = offset.applyMatrix4(atstModel.matrixWorld);
    camera.position.copy(relativeCameraOffset);
    // Make the camera look at the model's position
    camera.lookAt(atstModel.position.x, atstModel.position.y + 5, atstModel.position.z);


}

function runAnimations() {
	
}


document.addEventListener("DOMContentLoaded", function () {
    // Hide the loading screen after a certain duration (e.g., 20 seconds)
    setTimeout(function () {
        document.getElementById("loadingScreen").style.display = "none";
    }, 5000); // 20 seconds in milliseconds
});

function createTerrain() {
    terrainSize = 100;

    const terrainSegments = 200;

    const geometry = new THREE.PlaneGeometry(terrainSize, terrainSize, terrainSegments, terrainSegments);
    const vertices = geometry.attributes.position.array;

    const canvas = document.createElement('canvas');
    canvas.width = heightmapTexture.image.width;
    canvas.height = heightmapTexture.image.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(heightmapTexture.image, 0, 0);

    for (let i = 0; i < vertices.length; i += 3) {
        const x = vertices[i] / terrainSize + 0.5;
        const y = vertices[i + 1] / terrainSize + 0.5;
        const pixelColor = ctx.getImageData(x * canvas.width, y * canvas.height, 1, 1).data;
        const elevation = (pixelColor[0] / 255) * 5;
        vertices[i + 2] = elevation;
    }

    const material = new THREE.MeshStandardMaterial({ map: grassTexture, wireframe: false });
    const terrain = new THREE.Mesh(geometry, material);

    terrain.rotation.x = -Math.PI / 2;
    terrain.scale.set(50, 50, 20);

    const uvs = geometry.attributes.uv.array;
    for (let i = 0; i < uvs.length; i += 2) {
        uvs[i] /= terrainSize / grassTextureRepeat;
        uvs[i + 1] /= terrainSize / grassTextureRepeat;
    }

    geometry.uvsNeedUpdate = true;

    scene.add(terrain);
	
	

    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x000000, 0.3);
	
    scene.add(hemisphereLight);

    const sunLight = new THREE.DirectionalLight(0xf000ff, 1);
    sunLight.position.set(-50, 65, -100);
    scene.add(sunLight);
	
	
  

    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    placeRandomTrees(1900);
	




	//ANIMATION FUNCTION / LOOP

	var raycaster = new THREE.Raycaster();
	
	
	let OnetimeAnimationLoop = true;
	// Assuming your model is initially facing towards negative Z axis
	
    function animate() {
        requestAnimationFrame(animate);
        const delta = clock.getDelta(); // Assuming you have a clock variable
		if(atstModel){
  			mixer.update(delta);
		}
		if (controllerIndex !== null) {
			const gamepad = navigator.getGamepads()[controllerIndex];
			if (gamepad) {
			  handleButtons(gamepad.buttons);
			}
		}
		
		
		
		
		updateAnimation();
		
		
		if (areModelsClose(atstModel, xwing, 30)) {
			// Run your function when models are close
			openPopup();
			console.log('Should open popup');
		} else {
			closePopup();
		}

		if (areModelsClose(atstModel, xwingReal, 30)) {
			// Run your function when models are close
			openPopup2();
			console.log('Should open popup 2');
		} else {
			closePopup2();
		}
		
		
		if(terrain) {
			raycaster.set(atstModel.position, new THREE.Vector3(0, -1, 0));
				

			// Raycasting
			var intersects = raycaster.intersectObject(terrain);
			atstModel.position.y += 5;
			// Check for collisions
			if (intersects.length > 0 && spacePressed === false) {
				// Collision detecteda
				var intersectionPoint = intersects[0].point;

				// The distance between the origin of the ray and the point of intersection
				var distance = raycaster.ray.origin.distanceTo(intersectionPoint);
				atstModel.position.y += 5 - distance;
					
			}
		}
			
		if (enterPressed === true) {
			if(playsound){
				playMusic();
			}
			const angle = atstModel.rotation.y;
			if(upPressed) {
				
				atstModel.position.x += 4 * Math.sin(angle);
        		atstModel.position.z += 4 * Math.cos(angle);


			} else if (downPressed) {
				
				atstModel.position.x -= 0.9 * Math.sin(angle);
        		atstModel.position.z -= 0.9 * Math.cos(angle);


			}
		}


		










        renderer.render(scene, camera);
    }

    animate();
}
