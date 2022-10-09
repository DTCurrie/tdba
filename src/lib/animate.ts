import { Camera, Scene, WebGLRenderer } from 'three';
import { requestRender } from './renderer';

export const animate = (
  renderer: WebGLRenderer,
  scene: Scene,
  camera: Camera,
  animation: () => void
) => {
  requestAnimationFrame(() => animate(renderer, scene, camera, animation));
  animation();
  requestRender(renderer, scene, camera);
};
