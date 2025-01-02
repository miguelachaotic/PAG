import * as THREE from 'three';


export const degToRad = (deg) => deg * (Math.PI / 180);

export function createTruncatedPyramid(baseSize, topSize, height, material) {

    const vertices = [
        // Base inferior
        -baseSize, 0, -baseSize, // 0
        baseSize, 0, -baseSize, // 1
        baseSize, 0,  baseSize, // 2
        -baseSize, 0,  baseSize, // 3
        // Base superior
        -topSize, height, -topSize, // 4
        topSize, height, -topSize, // 5
        topSize, height,  topSize, // 6
        -topSize, height,  topSize  // 7
    ];

    const indices = [
        0, 5, 1,  0, 4, 5, // Lado 1
        1, 6, 2,  1, 5, 6, // Lado 2
        2, 7, 3,  2, 6, 7, // Lado 3
        3, 4, 0,  3, 7, 4, // Lado 4
        0, 2, 3,  0, 1, 2, // base inferior
        4, 6, 5,  4, 7, 6  // base superior
    ];

    const uvs = new Float32Array([
        1, 0, 1, 0.3, 0, 0,       1, 0, 0, 0.3, 1, 0.3,
        1, 0, 1, 0.3, 0, 0,       1, 0, 0, 0.3, 1, 0.3,
        1, 0, 1, 0.3, 0, 0,       1, 0, 0, 0.3, 1, 0.3,
        1, 0, 1, 0.3, 0, 0,       1, 0, 0, 0.3, 1, 0.3,
        0, 0, 1, 1, 0, 1,         0, 0, 1, 0, 1, 1,
        0, 0, 1, 1, 0, 1,         0, 0, 1, 0, 1, 1,
    ]);


    const geometry = new THREE.PolyhedronGeometry(vertices, indices, 1, 0);
    geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));


    return new THREE.Mesh(geometry, material);
}

export function createGear(radius, height, cubeCount, cubeSize, cubeMaterial, cylinderMaterial) {
    // Crear el grupo que contendrá el cilindro y los cubos
    const group = new THREE.Group();

    const cylinderGeometry = new THREE.CylinderGeometry(radius - 1, radius - 1, height, 32);
    const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
    group.add(cylinder);

    const cubes = [];
    const cubeGeometry = new THREE.BoxGeometry(cubeSize / 1.2, height, cubeSize / 1.5);

    for (let i = 0; i < cubeCount; i++) {
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        group.add(cube);
        cubes.push(cube);
    }

    const points = [];
    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / (cubeCount / 2)) {
        points.push(new THREE.Vector3(Math.cos(angle) * (radius - 0.8), 0, Math.sin(angle) * (radius - 0.8)));
    }
    const curve = new THREE.CatmullRomCurve3(points, true);

    cubes.forEach((cube, i) => {
        const t = (i / cubes.length) % 1;
        const position = curve.getPointAt(t);
        const tangent = curve.getTangentAt(t);
        cube.position.copy(position);

        const up = new THREE.Vector3(0, 0, 1);
        const quaternion = new THREE.Quaternion().setFromUnitVectors(up, tangent);
        cube.quaternion.copy(quaternion);
    });

    group.userData.cubes = cubes;
    group.userData.curve = curve;

    return group;
}

export function animateCubes(group, time, forward) {
    const { cubes, curve } = group.userData;

    let offset = time * .25;

    cubes.forEach((cube, i) => {
        let t = (i / cubes.length + offset) % 1;
        t = (forward) ? t : 1 - t;
        const position = curve.getPointAt(t);
        const tangent = curve.getTangentAt(t);
        cube.position.copy(position);

        const up = new THREE.Vector3(0, 0, 1);
        const quaternion = new THREE.Quaternion().setFromUnitVectors(up, tangent);
        cube.quaternion.copy(quaternion);
    });
}
