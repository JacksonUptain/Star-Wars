import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { TextGeometry } from 'https://unpkg.com/three@0.160.0/examples/jsm/geometries/TextGeometry.js';
import { FontLoader } from 'https://unpkg.com/three@0.160.0/examples/jsm/loaders/FontLoader.js';
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 30000);
const clock = new THREE.Clock();
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(10, 10, 10);
const material = new THREE.MeshBasicMaterial({ color: 0xff00ff });
const cube = new THREE.Mesh(geometry, material);
cube.castShadow = true;
cube.position.z = -500;
scene.add(cube);




const listener = new THREE.AudioListener();
camera.add( listener );



// create a global audio source
const sound = new THREE.Audio( listener );

// load a sound and set it as the Audio object's buffer
const audioLoader = new THREE.AudioLoader();
audioLoader.load( 'Music.ogg', function( buffer ) {
	sound.setBuffer( buffer );
	sound.setLoop( true );
	sound.setVolume( 0.5 );
	sound.play();
});





const loaderTexture = new THREE.CubeTextureLoader();
const texture = loaderTexture.load([
  'images/skybox/bkg1_right.png',
  'images/skybox/bkg1_left.png',
  'images/skybox/bkg1_top.png',
  'images/skybox/bkg1_bot.png',
  'images/skybox/bkg1_front.png',
  'images/skybox/bkg1_back.png',
]);
scene.background = texture;

//lights
const light = new THREE.HemisphereLight( 0xffffff, 0x000055, 0.5 );
scene.add( light );

//Model and Animations
let modelPosX, modelPosY, modelPosZ;

// Your existing code
const loader = new GLTFLoader();
let model;
let mixer;

loader.load('x-wing.glb', (gltf) => {
  model = gltf.scene;
  model.rotation.set(0, Math.PI / 1, 0);
  model.scale.set(1, 1, 1);
  model.position.set(5, 5, 0);
  modelPosX = model.position.x;
  modelPosY = model.position.y;
  modelPosZ = model.position.z;
  scene.add(model);
});

camera.position.set(5, 25, 80);
// Function to get the model position
function getModelPosition() {
    if (model) {
        console.log(modelPosX, modelPosY, modelPosZ );
        return { x: modelPosX, y: modelPosY, z: modelPosZ };
    }
}

function setModelPosition(x, y, z) {
    if (model) {
      model.position.set(x, y, z);
      modelPosX = x;
      modelPosY = y;
      modelPosZ = z;
    } else {
      console.error('Model is not defined. Make sure it has been loaded.');
    }
  }





console.log('Initial model position:', modelPosX, modelPosY, modelPosZ);
console.log(camera.position.x, camera.position.z, camera.position.z, modelPosX, modelPosY, modelPosZ);

let wPressed = false;
let aPressed = false;
let sPressed = false;
let dPressed = false;
let spacePressed = false;

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
        console.log('KeyA')
        break;
      case "KeyS":
        // Set sPressed to true
        sPressed = true;
        console.log('KeyS')
        break;
      case "KeyD":
        // Set dPressed to true
        dPressed = true;
        console.log('KeyD')
        break;

        case "Space":
        // Set dPressed to true
        spacePressed = true;
        console.log('KeyD')
        break;
    }
  });
  
  // Add an event listener for the keyup event
  document.addEventListener("keyup", function(event) {
    // Check the event.code property to identify which key was released
    switch (event.code) {
        case "KeyW":
            // Set wPressed to false
            wPressed = false;
            break;
        case "KeyA":
            // Set aPressed to false
            aPressed = false;
            break;
        case "KeyS":
            // Set sPressed to false
            sPressed = false;
            break;
        case "KeyD":
            // Set dPressed to false
            dPressed = false;
            break;
        case "ArrowUp":
            // Set ArrowUpPressed to true
            ArrowUpPressed = false;
            break;
        case "ArrowDown":
            // Set ArrowDownPressed to true
            ArrowDownPressed = false;
            break;
            case "Space":
          // Set dPressed to true
          spacePressed = false;
          console.log('KeyD')
          break;
    }
  });


// Add an event listener for the keydown event to handle turning left and right
document.addEventListener("keydown", function(event) {
    switch (event.code) {
        case "ArrowLeft":
            // Rotate the model to the left
            break;
        case "ArrowRight":
            // Rotate the model to the right
            break;
            case "ArrowUp":
            // Set ArrowUpPressed to true
            ArrowUpPressed = true;
            break;
        case "ArrowDown":
            // Set ArrowDownPressed to true
            ArrowDownPressed = true;
            break;
    }
});

let gamepad, axes;


// Function to get the direction vector based on the model's rotation
function getDirectionVector() {
    // Assuming your model is facing in the positive z-axis initially
    const forward = new THREE.Vector3(0, 0, 1);
    
    // Apply the model's rotation to the forward vector
    forward.applyEuler(model.rotation);
  
    return forward;
  }
  
  // Function to move the model in its current direction
  function moveModel(direction, distance) {
    // Adjust the model's position based on the direction and distance
    const delta = direction.clone().multiplyScalar(distance);
    model.position.add(delta);
}

const velocity = new THREE.Vector3();
var mesh2;
let pitchAngle = 0;
let ArrowUpPressed = false;
let ArrowDownPressed = false;
// Update the animate function to include pitch angle control
// Update the animate function to simulate flying controls
var geometry2 = new THREE.SphereGeometry (10000,256,256);
var loaderSphere = new THREE.TextureLoader();
loaderSphere.load(
  // resource URL
  'images/Ewok.png',
  // Function when resource is loaded
  function ( texture ) {
    // do something with the texture
    var material2 = new THREE.MeshPhongMaterial( {
      map: texture
     } );
    // create a mesh with the material
    mesh2 = new THREE.Mesh( geometry2, material2 );
    mesh2.position.set(-25000, 10, -25000);
    scene.add( mesh2 );
  },
  // Function called when download progresses
  function ( xhr ) {
    console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
  },
  // Function called when download errors
  function ( xhr ) {
    console.log( 'An error happened' );
  }
);


const loadertext = new FontLoader();

loadertext.load( 'Roboto_Regular.json', function ( font ) {

	const geometrytext = new TextGeometry( 'Endor and Ewoks', {
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
    const geometryMaterialTest = new THREE.MeshBasicMaterial({color: 0x8888ff});
    const textMesh = new THREE.Mesh( geometrytext, geometryMaterialTest)
    textMesh.scale.set(0.1, 0.1, 0.1);
    textMesh.position.set(-7000, 10, -7000);
    scene.add(textMesh);
} );

let starGeo;
starGeo = new THREE.BufferGeometry();
let positions = [];
for(let i=0;i<6000;i++) {
    positions.push(
    Math.random() * 600 - 300,
    Math.random() * 600 - 300,
    Math.random() * 600 - 300
  );
}
starGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
let sprite = new THREE.TextureLoader().load( '/images/bluecircle.png' );
let starMaterial = new THREE.PointsMaterial({
  color: 0xaaaaaa,
  size: 0.7,
  map: sprite,
  
});







const crosshair = document.getElementById('crosshair');
const pointer = new THREE.Vector2();
var raycaster = new THREE.Raycaster();

function updateRaycaster() {
  // Update the raycaster's origin based on the model's position
  raycaster.ray.origin.copy(model.position);

  // Set the direction of the ray (you can adjust this based on your needs)
  raycaster.ray.direction.set(0, 0, -1); // Example: pointing forward along the negative Z-axis

  // Optionally, you can normalize the direction vector
  raycaster.ray.direction.normalize();
}



/*const checkIntersection = () => {
    const crosshairPosition = new THREE.Vector2();
    const rect = crosshair.getBoundingClientRect();
    crosshairPosition.x = (rect.left + rect.right) / 2;
    crosshairPosition.y = (rect.top + rect.bottom) / 2;
  
    pointer.x = (crosshairPosition.x / window.innerWidth) * 2 - 1;
    pointer.y = -(crosshairPosition.y / window.innerHeight) * 2 + 1;}
    raycaster.setFromCamera(pointer, camera);
    console.log(camera)
    const intersects = raycaster.intersectObject(crosshair);*/

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
      spacePressed = button_0;
    }

function animate() {
    requestAnimationFrame(animate);
    if (controllerIndex !== null) {
    const gamepad = navigator.getGamepads()[controllerIndex];
    if (gamepad) {
      handleButtons(gamepad.buttons);
    }
  }





    if(mesh2){
        mesh2.rotation.y += 0.001;
    }
    // Update animation mixer
    if (mixer) {
        mixer.update(clock.getDelta());
    }

    let initialYaw = model.rotation.y;
    let initialRoll = model.rotation.z;

    // Store the target rotation values for smooth transition
    let targetYaw = initialYaw;
    let targetPitch = model.rotation.x; // Assuming pitch remains constant

    // Create a function to smoothly transition the rotation
    function smoothRotate(target, property, to, speed) {
        const delta = to - target[property];
        target[property] += delta * speed;
    }

    // Adjust the smoothness factor
    const smoothness = 0.06; // Experiment with this value to control smoothness

    // Handle rotation input (yaw)
    if (aPressed) {
        // Set the target rotation to the left
        targetYaw = initialYaw + 0.2;
        model.rotation.x = 0;  // Set pitch rotation to zero
        model.rotation.z = 0;  // Set roll rotation to zero
    } else if (dPressed) {
        // Set the target rotation to the right
        targetYaw = initialYaw - 0.2;
        model.rotation.x = 0;  // Set pitch rotation to zero
        model.rotation.z = 0;  // Set roll rotation to zero
    }
    

    
    // Apply pitch rotation
    

    // Handle flying controls
    const speed = 2.5;

    const direction = new THREE.Vector3(0, 0, 1);
    direction.applyEuler(model.rotation);
    const stars = new THREE.Points(starGeo,starMaterial);
    
    
    
       
    



    if(aSpeed || spacePressed) {
      velocity.copy(direction).multiplyScalar(10);
        model.position.add(velocity);
    }


    if (wPressed) {
        // Move the ship forward
        velocity.copy(direction).multiplyScalar(speed);
        model.position.add(velocity);
    } else if (sPressed) {
        // Move the ship backward
        velocity.copy(direction).negate().multiplyScalar(speed);
        model.position.add(velocity);
    }

    // Update camera position to follow behind the model
    const offset = new THREE.Vector3(0, 20, -80); // Adjust this offset as needed
    const relativeCameraOffset = offset.applyMatrix4(model.matrixWorld);
    camera.position.copy(relativeCameraOffset);

    // Make the camera look at the model's position
    camera.lookAt(model.position);
    smoothRotate(model.rotation, 'x', targetPitch, smoothness);
    smoothRotate(model.rotation, 'y', targetYaw, smoothness);
    getModelPosition();
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    if(model){
      updateRaycaster();
    }

    // Check for intersections
    var intersects = raycaster.intersectObject(mesh2);

    // Handle intersections
    if (intersects.length > 0) {
        // Collision detected
      
        console.log('Collision detected between model and sphere');
        window.location.href = 'Ewok/Ewok.html';
    }


    renderer.render(scene, camera);
}

animate();
