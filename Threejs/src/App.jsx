import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const App = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(
      -1, 1, 1, -1, 0, 1
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // Mouse position
    let mouse = new THREE.Vector2(0.5, 0.5);

    window.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX / window.innerWidth;
      mouse.y = 1.0 - e.clientY / window.innerHeight;
    });

    // Shaders
    const uniforms = {
      u_time: { value: 0 },
      u_mouse: { value: mouse },
      u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: `
        void main() {
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        precision highp float;

        uniform vec2 u_resolution;
        uniform vec2 u_mouse;
        uniform float u_time;

        void main() {
          vec2 st = gl_FragCoord.xy / u_resolution;
          vec2 dist = st - u_mouse;

          // Distance for the ripple
          float ripple = 0.03 / length(dist);

          // Color shifting
          vec3 color = vec3(
            0.5 + 0.5 * sin(u_time + ripple * 20.0),
            0.5 + 0.5 * cos(u_time + ripple * 10.0),
            0.5 + 0.5 * sin(u_time + ripple * 15.0)
          );

          // Blur-like soft edges
          float blur = smoothstep(0.0, 0.5, ripple);
          color *= blur;

          gl_FragColor = vec4(color, 1.0);
        }
      `,
    });

    // Fullscreen quad
    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Animate
    const animate = () => {
      uniforms.u_time.value += 0.01;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    // Handle resize
    window.addEventListener("resize", () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      uniforms.u_resolution.value.set(window.innerWidth, window.innerHeight);
    });
  }, []);

  return <div ref={containerRef} style={{ width: "100vw", height: "100vh" }} />;
};

export default App;
