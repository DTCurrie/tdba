import { Camera, Scene, WebGLRenderer } from 'three';

export const animate = (
  renderer: WebGLRenderer,
  scene: Scene,
  camera: Camera,
  animation?: () => void
) => {
  requestAnimationFrame(() => animate(renderer, scene, camera, animation));
  animation?.();
  renderer.render(scene, camera);
};
