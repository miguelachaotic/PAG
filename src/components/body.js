import * as THREE from 'three';
import {createTruncatedPyramid, degToRad, createGear} from "../utils/utils.js";

export const leftGroup = new THREE.Group();
export const rightGroup = new THREE.Group();
export const mainBodyGroup = new THREE.Group();
export const gears = [];

const textureLoader = new THREE.TextureLoader();
const bodyTexture = textureLoader.load('./textures/camouflage.png');
bodyTexture.wrapT = THREE.RepeatWrapping;
bodyTexture.wrapS = THREE.RepeatWrapping;
bodyTexture.repeat.set(1, 1);
const bodyNormal = textureLoader.load('./textures/normal_body.png');
const bodyRough = textureLoader.load('./textures/rough_body.png');

const footNormal = textureLoader.load('./textures/normal_foot.png');
const roughFoot = textureLoader.load('./textures/rough_foot.png');
roughFoot.repeat.set(10, 1);
roughFoot.wrapS = THREE.RepeatWrapping;
roughFoot.wrapT = THREE.RepeatWrapping;

const footMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x323232,
    reflectivity: 0.3,
    metalness: 0.6,
    normalMap: footNormal,
    roughnessMap: roughFoot
});



const bodyMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x555555,
    reflectivity: 1,
    metalness: 0.6,
    map: bodyTexture,
    normalMap: bodyNormal,
    roughnessMap: bodyRough,
    roughness: 0.7
})

/**
 * Creates the solid foundation for the tank's tracks. Includes some cylinders that act as gears.
 * @param x
 * @param y
 * @param z
 * @returns {Mesh[]}
 */
function createFoot(x, y, z) {

    const footBodyGeometry = new THREE.BoxGeometry(4.6, 1.85, 0.5);

    const sideGeometry = new THREE.CylinderGeometry(0.925, 0.925, 0.5,
        12, 2, false, 0, Math.PI);

    const footBody = new THREE.Mesh(footBodyGeometry, footMaterial);
    const frontSide = new THREE.Mesh(sideGeometry, footMaterial);
    const backSide = new THREE.Mesh(sideGeometry, footMaterial);

    footBody.position.x = x;
    footBody.position.y = y;
    footBody.position.z = z;
    footBody.castShadow = true;
    footBody.receiveShadow = true;

    frontSide.position.x = x + 2.3;
    frontSide.position.y = y;
    frontSide.position.z = z;
    frontSide.rotation.x = Math.PI / 2;
    frontSide.castShadow = true;
    frontSide.receiveShadow = true;

    backSide.position.x = x - 2.3;
    backSide.position.y = y;
    backSide.position.z = z;
    backSide.rotation.y = Math.PI;
    backSide.rotation.x = Math.PI / 2;
    backSide.castShadow = true;
    backSide.receiveShadow = true;

    const frontGear = createGear(1.55, 1, 12, 0.5, footMaterial, footMaterial);
    frontGear.position.x = x - 2.1;
    frontGear.position.y = y;
    frontGear.position.z = z;
    frontGear.rotation.x = Math.PI / 2;
    frontGear.castShadow = true;
    frontGear.receiveShadow = true;

    const backGear = createGear(1.55, 1, 12, 0.5, footMaterial, footMaterial)
    backGear.position.x = x + 2.1;
    backGear.position.y = y;
    backGear.position.z = z;
    backGear.rotation.x = Math.PI / 2;
    backGear.castShadow = true;
    backGear.receiveShadow = true;


    return [footBody, frontSide, backSide, frontGear, backGear];
}


function createMainBody(){
    const lowerBodyGroup = new THREE.Group();
    const baseGeometry = new THREE.BoxGeometry(6, 2, 3.9);
    const base = new THREE.Mesh(baseGeometry, bodyMaterial);
    base.scale.z = 1.01;
    base.position.y = 0.4;
    base.castShadow = true;
    lowerBodyGroup.add(base);

    const frontBaseGeometry = new THREE.BoxGeometry(2, 1, 3.9);
    const lowerFrontBase = new THREE.Mesh(frontBaseGeometry, bodyMaterial);
    lowerFrontBase.position.x = 3.2;
    lowerFrontBase.position.y = 0.4;
    lowerFrontBase.rotation.z = degToRad(30)
    lowerFrontBase.scale.z = 0.99;
    lowerFrontBase.castShadow = true;
    lowerFrontBase.receiveShadow = true;
    lowerBodyGroup.add(lowerFrontBase);

    const upperFrontBase = new THREE.Mesh(frontBaseGeometry, bodyMaterial);
    upperFrontBase.position.x = 3;
    upperFrontBase.position.y = 0.9;
    upperFrontBase.castShadow = true;
    upperFrontBase.receiveShadow = true;
    lowerBodyGroup.add(upperFrontBase);

    const lowerBackBase = new THREE.Mesh(frontBaseGeometry, bodyMaterial);
    lowerBackBase.position.x = -3.2;
    lowerBackBase.position.y = 0.6;
    lowerBackBase.rotation.z = degToRad(-60);
    lowerBackBase.castShadow = true;
    lowerBackBase.receiveShadow = true;
    lowerBodyGroup.add(lowerBackBase);

    const upperBackBase = new THREE.Mesh(frontBaseGeometry, bodyMaterial);
    upperBackBase.position.x = -2.6;
    upperBackBase.position.y = 0.9;
    upperBackBase.scale.z = 0.99;
    upperBackBase.castShadow = true;
    upperBackBase.receiveShadow = true;
    lowerBodyGroup.add(upperBackBase);
    lowerBodyGroup.scale.set(0.99, 1, 0.99);

    const upperBlockGeometry = new THREE.BoxGeometry(7.4, 0.431, 3.9);
    const upperBlock = new THREE.Mesh(upperBlockGeometry, bodyMaterial);
    upperBlock.position.y = 1.55;
    upperBlock.position.x = 0.4;
    upperBlock.scale.set(1.01, 1.1, 1.01);
    upperBlock.castShadow = true;
    upperBlock.receiveShadow = true;

    const cabin = createTruncatedPyramid(2, 1, 1, bodyMaterial);
    cabin.position.y = 1.75;
    cabin.position.x = 0.3;
    cabin.scale.set(3.5, 1.2, 2.2);
    cabin.castShadow = true;
    cabin.receiveShadow = true;

    return [lowerBodyGroup, upperBlock, cabin];
}

createFoot(0, 0, -2.2).forEach(elem => leftGroup.add(elem));
createFoot(0, 0, 2.2).forEach(elem => rightGroup.add(elem));
createMainBody().forEach(elem => mainBodyGroup.add(elem));
