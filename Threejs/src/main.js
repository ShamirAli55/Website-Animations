// main.js
import * as THREE from "three";

// ====== Vertex Shader ======
const vertexShader = `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

// ====== Fragment Shader ======
const fragmentShader = `
    uniform vec2 uMouse;
    uniform float uTime;
    varying vec2 vUv;

    void main() {
        vec2 uv = vUv;
        vec2 mouse = uMouse;

        // Distance from mouse
        float dist = distance(uv, mouse);

        // Make colors ripple with time
        float ripple = sin(dist * 40.0 - uTime * 5.0) * 0.5 + 0.5;

        // Scatter colors
        vec3 color = vec3(
            ripple * 0.9,
            sin(uTime + dist * 5.0) * 0.5 + 0.5,
            cos(uTime * 0.5 + dist * 7.0) * 0.5 + 0.5
        );

        gl_FragColor = vec4(color, 1.0);
    }
`;

// ====== Scene Setup ======
const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
camera.position.z = 1;

const geometry = new THREE.PlaneGeometry(2, 2);

const uniforms = {
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uTime: { value: 0 }
};

const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms
});

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// ====== Mouse Follow with Delay ======
let targetMouse = new THREE.Vector2(0.5, 0.5);
let currentMouse = new THREE.Vector2(0.5, 0.5);

window.addEventListener("mousemove", (e) => {
    targetMouse.x = e.clientX / window.innerWidth;
    targetMouse.y = 1.0 - e.clientY / window.innerHeight;
});

// ====== Animation Loop ======
const clock = new THREE.Clock();
function animate() {
    requestAnimationFrame(animate);

    // Delay mouse movement
    currentMouse.lerp(targetMouse, 0.05);
    uniforms.uMouse.value.copy(currentMouse);

    uniforms.uTime.value = clock.getElapsedTime();

    renderer.render(scene, camera);
}
animate();

// ====== Resize Handling ======
window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
});
