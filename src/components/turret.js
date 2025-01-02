import * as THREE from 'three';
import {createTruncatedPyramid, degToRad} from "../utils/utils.js";


const textureLoader = new THREE.TextureLoader();
const baseBump = textureLoader.load('./textures/bump_base.png');
const baseNormal = textureLoader.load('./textures/normal_base.png');
const baseRough = textureLoader.load('./textures/rough_base.png');
const camouflage = textureLoader.load('./textures/camouflage.png');

const cannonNormal = textureLoader.load('./textures/normal_cannon.png');
cannonNormal.repeat.set(4, 4);
cannonNormal.wrapT = THREE.RepeatWrapping;
cannonNormal.wrapS = THREE.RepeatWrapping;
const cannonColor = textureLoader.load('./textures/color_cannon.png');
const cannonRough = textureLoader.load('./textures/rough_cannon.png');
const baseMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x505050,
    bumpMap: baseBump,
    normalMap: baseNormal,
    roughnessMap: baseRough,
    map: camouflage
});

const cannonMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x454545,
    side: THREE.DoubleSide,
    normalMap: cannonNormal,
    map: cannonColor,
    roughnessMap: cannonRough
});

export const turretGroup = new THREE.Group();
let turretBody, cannon;

function createTurret(){
    const turretBase = createTruncatedPyramid(1, 0.2, 0.4, baseMaterial);
    turretBase.position.y = 2.3;
    turretBase.position.x = 0.3;
    turretBase.scale.set(1.8, 0.3, 1.8);
    turretBase.castShadow = true;
    turretBase.receiveShadow = true;

    turretBody = createTruncatedPyramid(0.2, 0.9, 1, baseMaterial);
    turretBody.position.y = 2.49;
    turretBody.position.x = 0.3;
    turretBody.scale.set(1.1, 1.2, 1.1);
    turretBody.castShadow = true;
    turretBody.receiveShadow = true;

    cannon = createCannon();
    cannon[0].position.x = 0;
    cannon[0].position.y = 2.8;
    cannon[0].scale.set(0.6, 0.7, 0.6);
    cannon[0].rotation.z = degToRad(-90);
    cannon[0].castShadow = true;
    cannon[0].receiveShadow = false;

    cannon[1].position.x = 0;
    cannon[1].position.y = 2.8;
    cannon[1].scale.set(0.6, 0.7, 0.6);
    cannon[1].rotation.z = degToRad(-90);
    cannon[1].castShadow = true;
    cannon[1].receiveShadow = true;

    turretBody.position.y += 0.045;
    turretBody.scale.set(0.97, 1, 0.97);
    turretBody.position.x += 0.01;

    const mouthGeometry = new THREE.TorusGeometry(0.27, 0.04, 32, 32);
    const mouth = new THREE.Mesh(mouthGeometry, cannonMaterial);

    mouth.position.y = 2.8;
    mouth.position.x = -5.62;
    mouth.rotation.y = degToRad(90);

    cannon[2] = mouth;

    return [turretBase, turretBody, ...cannon];
}

function createCannon(){
    const outerCurve = new THREE.CubicBezierCurve3(
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0.8, 0, 1),
        new THREE.Vector3(0, 0, -5),
        new THREE.Vector3(0.5, 0, -8)
    );

    const innerCurve = new THREE.CubicBezierCurve3(
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0.7, 0, 1),
        new THREE.Vector3(0, 0, -5),
        new THREE.Vector3(0.4, 0, -8)
    );

    const outerPoints = outerCurve.getPoints(50)
        .map(p => new THREE.Vector2(p.x, p.z)).reverse();
    const innerPoints = innerCurve.getPoints(50)
        .map(p => new THREE.Vector2(p.x, p.z)).reverse();
    const outerGeometry = new THREE.LatheGeometry(outerPoints, 32);
    const innerGeometry = new THREE.LatheGeometry(innerPoints, 32);

    return [new THREE.Mesh(outerGeometry, cannonMaterial), new THREE.Mesh(innerGeometry, cannonMaterial)];
}

export function rotateTurret(theta){
    turretBody.rotation.y = degToRad(theta);
    cannon[0].rotation.y = degToRad(theta);
    cannon[1].rotation.y = degToRad(theta);
    cannon[2].position.x = -5.62 * Math.cos(degToRad(theta));
    cannon[2].position.z = 5.62 * Math.sin(degToRad(theta));
    cannon[2].rotation.y = degToRad(theta + 90);
}

createTurret().forEach(elem => turretGroup.add(elem));