import * as THREE from 'three';
import * as body from './components/body.js';
import * as turret from './components/turret.js';
import * as tracks from './components/tracks.js';
import { degToRad, createGear, animateCubes } from "./utils/utils.js";
import {leftGroup, rightGroup} from "./components/body.js";

let mouseDown = false;
let previousMouse = {
    x: 0, y: 0
}
const userPosition = {x: 0, y: 0, z: 0};
let tankOrientation = 0;

const cameraMovement = { forward: false, backward: false, left: false, right: false, up: false, down: false };
const movementSpeed = 0.15;
const tankMovement = { forward: false, backward: false, left: false, right: false };
const tankSpeed = 0.12;
const turretRotation = {left: false, right: false};
const turretSpeed = 0.19;

let isViewModeActive = true;

let phi = degToRad(80), theta = degToRad(180);
let userPhi = phi, userTheta = theta;
let turretTheta = 0;

function main() {
    const canvas = document.querySelector('#canvas');
    const renderer = new THREE.WebGLRenderer({antialias: true, canvas});
    renderer.shadowMap.enabled = true;
    const textureLoader = new THREE.TextureLoader();
    const fov = 75;
    const aspect = 2;
    const near = 0.1;
    const far = 100;
    const tracksGroup = new THREE.Group();
    const tankGroup = new THREE.Group();
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.x = 8;
    camera.position.y = 1.5;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();

    camera.receiveShadow = true;
    camera.castShadow = true;

    const scene = new THREE.Scene();
    renderer.setClearColor(0x00ddff);

    const planeGeometry = new THREE.PlaneGeometry(100, 100, 1, 1);
    planeGeometry.rotateX(-Math.PI / 2);
    planeGeometry.translate(0, -1.1, 0);
    const floorTexture = textureLoader.load('textures/ground.png');
    const floorNormal = textureLoader.load('textures/normal_ground.png');
    const floorRough = textureLoader.load('textures/rough_ground.png');
    const planeMaterial = new THREE.MeshPhysicalMaterial({
        map: floorTexture,
        normalMap: floorNormal,
        roughnessMap: floorRough
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);

    const leftGears = [];
    const rightGears = [];


    /********************
     *     ANIMATION    *
     ********************/

    function render(time) {
        time *= 0.001;
        if (resizeRenderer(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix()
        }

        updateCameraPosition();
        updateTankPosition(time);
        updateTurretRotation();
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }

    let existingTextElement = null;

    /**
     * Shows the text introduced to the function at the viewport coordinates defined by position. If a text already
     * exists, it removes it first. Does not return anything (undefined).
     * @param text {string} the text to be shown
     * @param position {{x: number, y: number}}
     */
    function showText(text, position) {
        // Elimina el texto existente si ya hay uno
        if (existingTextElement) {
            existingTextElement.remove();
            existingTextElement = null;
        }
        const textElement = document.createElement('div');

        textElement.innerText = text;
        textElement.style.position = 'absolute';
        textElement.style.left = `${position.x}px`;
        textElement.style.top = `${position.y}px`;
        textElement.style.color = 'black';
        textElement.style.backgroundColor = 'white';
        textElement.style.padding = '5px';
        textElement.style.border = '1px solid black';
        textElement.style.fontFamily = 'Georgia, sans-serif';
        textElement.style.fontSize = '30px';
        textElement.style.pointerEvents = 'none';

        document.body.appendChild(textElement);
        existingTextElement = textElement;
    }

    function rememberUserPosition() {
        userPosition.x = camera.position.x;
        userPosition.y = camera.position.y;
        userPosition.z = camera.position.z;
        userPhi = phi;
        userTheta = theta;
    }

    function updateUserPosition() {
        camera.position.x = userPosition.x;
        camera.position.y = userPosition.y;
        camera.position.z = userPosition.z;
        phi = userPhi;
        theta = userTheta;
    }

    /**************************
     *        EVENTS          *
     **************************/

    function onMouseDown(event) {
        mouseDown = true;
        previousMouse.x = event.clientX;
        previousMouse.y = event.clientY;
    }

    function onMouseUp(event) {
        mouseDown = false;
    }

    function updateCameraDirection() {
        const radius = 2;
        const targetPosition = new THREE.Vector3(
            radius * Math.sin(phi) * Math.cos(theta),
            -radius * Math.cos(phi),
            -radius * Math.sin(phi) * Math.sin(theta)
        );
        camera.lookAt(camera.position.clone().add(targetPosition));
    }

    function onMouseMove(event) {
        const rotationSpeed = 0.004;
        const minPhi = degToRad(10);
        const maxPhi = degToRad(170)
        if (!mouseDown) return;

        const delta = {
            x: event.clientX - previousMouse.x,
            y: event.clientY - previousMouse.y,
        };

        theta -= delta.x * rotationSpeed;
        phi -= delta.y * rotationSpeed;
        phi = THREE.MathUtils.clamp(phi, minPhi, maxPhi);

        updateCameraDirection();

        previousMouse.x = event.clientX;
        previousMouse.y = event.clientY;
    }

    function onMouseWheel(event) {
        const zoomSpeed = 0.05;
        camera.fov += event.deltaY * zoomSpeed;
        camera.fov = Math.max(20, Math.min(100, camera.fov));
        camera.updateProjectionMatrix();
    }

    function onKeyDown(event) {
        if(event.key === ' '){
            isViewModeActive = !isViewModeActive;
            if(isViewModeActive){
                updateUserPosition();
                updateCameraDirection();
                showText("Modo camara", {x: 50, y: 50});
            } else {
                showText("Modo tanque", {x: 50, y: 50});
                rememberUserPosition();
                camera.position.x = 20;
                camera.position.y = 20;
                camera.position.z = 0;
                camera.lookAt(0, 0, 0);
                phi = degToRad(35);
                theta = degToRad(180);
                updateCameraDirection();
            }
        }
        if(isViewModeActive){
            switch (event.key) {
                case 'w':
                case 'W':
                    cameraMovement.forward = true;
                    break;
                case 's':
                case 'S':
                    cameraMovement.backward = true;
                    break;
                case 'a':
                case 'A':
                    cameraMovement.left = true;
                    break;
                case 'd':
                case 'D':
                    cameraMovement.right = true;
                    break;
                case 'q':
                case 'Q':
                    cameraMovement.up = true;
                    break;
                case 'e':
                case 'E':
                    cameraMovement.down = true;
                    break;
            }
        } else {
            switch (event.key){
                case 'w':
                case 'W':
                    tankMovement.forward = true;
                    break;
                case 's':
                case 'S':
                    tankMovement.backward = true;
                    break;
                case 'a':
                case 'A':
                    tankMovement.left = true;
                    break;
                case 'd':
                case 'D':
                    tankMovement.right = true;
                    break;
                case 'ArrowLeft':
                    turretRotation.left = true;
                    break;
                case 'ArrowRight':
                    turretRotation.right = true;
                    break;
            }
        }

    }

    function onKeyUp(event) {
        if(isViewModeActive){
            switch (event.key) {
                case 'w':
                case 'W':
                    cameraMovement.forward = false;
                    break;
                case 's':
                case 'S':
                    cameraMovement.backward = false;
                    break;
                case 'a':
                case 'A':
                    cameraMovement.left = false;
                    break;
                case 'd':
                case 'D':
                    cameraMovement.right = false;
                    break;
                case 'q':
                case 'Q':
                    cameraMovement.up = false;
                    break;
                case 'e':
                case 'E':
                    cameraMovement.down = false;
                    break;
            }
        } else {
            switch (event.key){
                case 'w':
                case 'W':
                    tankMovement.forward = false;
                    break;
                case 's':
                case 'S':
                    tankMovement.backward = false;
                    break;
                case 'a':
                case 'A':
                    tankMovement.left = false;
                    break;
                case 'd':
                case 'D':
                    tankMovement.right = false;
                    break;
                case 'ArrowLeft':
                    turretRotation.left = false;
                    break;
                case 'ArrowRight':
                    turretRotation.right = false;
                    break;
            }
        }
    }

    function updateTankPosition(time){
        const forward = new THREE.Vector3();
        const up = new THREE.Vector3(0, 1, 0);
        tankGroup.getWorldDirection(forward);
        forward.normalize();
        forward.crossVectors(up, forward);

        if(tankMovement.forward){
            tankGroup.position.add(forward.negate().multiplyScalar(movementSpeed));
            tracks.animateTracks(time, 'Left', 0);
            tracks.animateTracks(time, 'Right', 0);
            leftGears.forEach(gear => animateCubes(gear, time * 1.1, 0));
            rightGears.forEach(gear => animateCubes(gear, time * 1.1, 0));
        }
        if(tankMovement.backward){
            tankGroup.position.add(forward.multiplyScalar(movementSpeed));
            tracks.animateTracks(time, 'Left', 1);
            tracks.animateTracks(time, 'Right', 1);
            leftGears.forEach(gear => animateCubes(gear, time * 1.1, 1));
            rightGears.forEach(gear => animateCubes(gear, time * 1.1, 1));
        }
        if(tankMovement.right){
            tankGroup.rotation.y -= degToRad(movementSpeed) * 2.7;
            tracks.animateTracks(time/1.5, 'Left', 1);
            tracks.animateTracks(time/1.5, 'Right', 0);
            leftGears.forEach(gear => animateCubes(gear, time * 1.1, 1));
            rightGears.forEach(gear => animateCubes(gear, time * 1.1, 0));
        }
        if(tankMovement.left){
            tankGroup.rotation.y += degToRad(movementSpeed) * 2.7;
            tracks.animateTracks(time/1.5, 'Left', 0);
            tracks.animateTracks(time/1.5, 'Right', 1);
            leftGears.forEach(gear => animateCubes(gear, time * 1.1, 0));
            rightGears.forEach(gear => animateCubes(gear, time * 1.1, 1));

        }
    }

    function updateCameraPosition() {
        const forward = new THREE.Vector3();
        const right = new THREE.Vector3();
        const up = new THREE.Vector3(0, 1, 0);

        camera.getWorldDirection(forward);
        forward.y = 0;
        forward.normalize();

        right.crossVectors(forward, up).normalize();

        if (cameraMovement.forward) camera.position.add(forward.clone().multiplyScalar(movementSpeed));
        if (cameraMovement.backward) camera.position.add(forward.clone().negate().multiplyScalar(movementSpeed));
        if (cameraMovement.left) camera.position.add(right.clone().negate().multiplyScalar(movementSpeed));
        if (cameraMovement.right) camera.position.add(right.clone().multiplyScalar(movementSpeed));
        if (cameraMovement.up) camera.position.y += movementSpeed;
        if (cameraMovement.down) camera.position.y -= movementSpeed;
    }

    function updateTurretRotation(){
        if(turretRotation.left){
            turretTheta += turretSpeed;
        }
        if(turretRotation.right){
            turretTheta -= turretSpeed;
        }

        turret.rotateTurret(turretTheta);
    }

    showText("Modo camara", {x: 50, y: 50});
    renderer.domElement.addEventListener("mousedown", onMouseDown);
    renderer.domElement.addEventListener("mouseup", onMouseUp);
    renderer.domElement.addEventListener("mousemove", onMouseMove);
    renderer.domElement.addEventListener("wheel", onMouseWheel);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    updateCameraDirection();
    rememberUserPosition();

    const globalIlumination = new THREE.AmbientLight(0xffffff, .7);
    scene.add(globalIlumination);

    const sunGeometry = new THREE.SphereGeometry(2, 32, 32);
    const sunMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffdd22,
        emissive: 0xffffff,
        emissiveIntensity: 25000,
    });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sun.position.set(0, 100, 0);
    scene.add(sun);


    const sunLight = new THREE.PointLight(0xffffff, 22000, 200);
    sunLight.position.set(0, 100, 0);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 0.1;
    sunLight.shadow.camera.far = 100;
    scene.add(sunLight);

    const leftTracks = tracks.leftTracks();
    leftTracks.forEach((elem) => tracksGroup.add(elem));
    const rightTracks = tracks.rightTracks();
    rightTracks.forEach((elem) => tracksGroup.add(elem));

    tankGroup.receiveShadow = true;
    tankGroup.castShadow = true;
    plane.receiveShadow = true;

    const leftFoot = body.leftGroup;
    const rightFoot = body.rightGroup;
    const mainBody = body.mainBodyGroup;
    const turretGroup = turret.turretGroup;


    tankGroup.add(leftFoot);
    tankGroup.add(rightFoot);
    tankGroup.add(tracksGroup);
    tankGroup.add(mainBody);
    tankGroup.add(turretGroup);

    leftGears.push(leftFoot.children[3], leftFoot.children[4]);
    rightGears.push(rightFoot.children[3], rightFoot.children[4]);

    scene.add(plane);
    scene.add(tankGroup);

    renderer.render(scene, camera);

    requestAnimationFrame(render);
}

function resizeRenderer(renderer) {
    const canvas = renderer.domElement;
    const pixelRatio = window.devicePixelRatio || 1;
    const width = Math.floor(canvas.clientWidth * pixelRatio);
    const height = Math.floor(canvas.clientHeight * pixelRatio);
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
        renderer.setSize(width, height, false);
    }
    return needResize;
}

main();
