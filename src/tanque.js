import * as THREE from 'three';

function main() {
    const canvas = document.querySelector('#canvas');
    const renderer = new THREE.WebGLRenderer({antialias: true, canvas});

    const fov = 75;
    const aspect = 2;
    const near = 0.1;
    const far = 100;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

    camera.position.z = 4;
    camera.position.y = 2;

    camera.lookAt(0, 0, 0);

    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();

    const scene = new THREE.Scene();
    renderer.setClearColor(0xffffff);

    const box = new THREE.BoxGeometry(1, 1, 1);
    const boxMaterial = new THREE.MeshBasicMaterial({color: 0x00bb44});
    const cube = new THREE.Mesh(box, boxMaterial);
    const boxWireframe = new THREE.WireframeGeometry(box);
    const lines = new THREE.LineBasicMaterial({color: 0x000000});
    const cubeLines = new THREE.LineSegments(boxWireframe, lines);

    const planeGeometry = new THREE.PlaneGeometry(100, 100, 1);
    planeGeometry.rotateX(-Math.PI / 2);
    planeGeometry.translate(0, -2, 0);
    const planeMaterial = new THREE.MeshBasicMaterial({color: 0xbbbbbb});
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);

    function render(time) {
        time *= 0.001;
        if (resizeRenderer(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix()
        }

        cube.rotation.x = -time;
        cube.rotation.y = time;
        cubeLines.rotation.x = -time;
        cubeLines.rotation.y = time;
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }

    scene.add(cube);
    scene.add(cubeLines);
    scene.add(plane);


    renderer.render(scene, camera);

    requestAnimationFrame( render );


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
