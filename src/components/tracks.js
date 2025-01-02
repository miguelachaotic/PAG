import * as THREE from 'three';

const trackSegmentCount = 30;
const trackLinkGeometry = new THREE.BoxGeometry(0.05, 0.45, 0.7);

const textureLoader = new THREE.TextureLoader();
const normalTexture = textureLoader.load("./textures/normal_tracks_metal_plate.png");
const bumpTexture = textureLoader.load('./textures/bump_tracks_metal_plate.png');
const diffuseTexture = textureLoader.load('./textures/diffuse_tracks_metal_plate.png');
const metalnessTexture = textureLoader.load('./textures/metal_tracks_metal_plate.png')

const trackLinkMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x666666,
    roughnessMap: bumpTexture,
    reflectivity: 1,
    normalMap: normalTexture,
    bumpMap: bumpTexture,
    map: diffuseTexture,
    metalnessMap: metalnessTexture
});

class Tracks {
    constructor(x, y, z) {
        this.trackCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-3 + x, 0.8 + y, z),
            new THREE.Vector3(-1 + x, 1 + y, z),
            new THREE.Vector3(1 + x, 1 + y, z),
            new THREE.Vector3(3 + x, 0.8 + y, z),
            new THREE.Vector3(3 + x, -0.8 + y, z),
            new THREE.Vector3(1 + x, -1 + y, z),
            new THREE.Vector3(-1 + x, -1 + y, z),
            new THREE.Vector3(-3 + x, -0.8 + y, z),
        ]);
        this.trackCurve.closed = true;
        this.trackLinks = [];
    }

    getTrackCurve() {
        return this.trackCurve;
    }

    generateLinks() {
        for (let i = 0; i < trackSegmentCount; i++) {
            const t = i / trackSegmentCount;
            const position = this.trackCurve.getPointAt(t);
            const tangent = this.trackCurve.getTangentAt(t);

            const link = new THREE.Mesh(trackLinkGeometry, trackLinkMaterial);
            link.receiveShadow = true;
            link.castShadow = true;

            link.position.copy(position);
            const axis = new THREE.Vector3(0, 1, 0);
            const quaternion = new THREE.Quaternion().setFromUnitVectors(axis, tangent);
            link.quaternion.copy(quaternion);
            this.trackLinks.push(link);
        }
    }
}

let left = new Tracks(0, 0, -2.5);
let right = new Tracks(0, 0, 2.5);

export function leftTracks()  {
    left.generateLinks();
    return left.trackLinks;
}

export function rightTracks()  {
    right.generateLinks();
    return right.trackLinks;
}



export function animateTracks(deltaTime, which, forward) {
    const trackCurve = (which === 'Left') ? left.getTrackCurve() : right.getTrackCurve();
    let trackOffset = deltaTime * .25;
    const trackLinks = (which === 'Left') ? left.trackLinks : right.trackLinks;

    trackLinks.forEach((link, i) => {
        let t = (i / trackSegmentCount + trackOffset) % 1;
        t = (forward) ? t : 1 - t;
        const position = trackCurve.getPointAt(t);
        const tangent = trackCurve.getTangentAt(t);

        link.position.copy(position);
        const axis = new THREE.Vector3(0, 1, 0);
        const quaternion = new THREE.Quaternion().setFromUnitVectors(axis, tangent);
        link.quaternion.copy(quaternion);
    });
}

