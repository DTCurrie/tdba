import { Camera, Scene, sRGBEncoding, WebGLRenderer } from 'three';
import { canvas } from './canvas';

export const createRenderer = (width: number, height: number) => {
  const renderer = new WebGLRenderer({
    antialias: true,
    canvas: canvas(),
  });

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);
  renderer.setClearColor(0xffffff);
  renderer.outputEncoding = sRGBEncoding;

  return renderer;
};

let renderRequested = false;
export const render = (
  renderer: WebGLRenderer,
  scene: Scene,
  camera: Camera
) => {
  renderRequested = false;
  renderer.render(scene, camera);
};

export const requestRender = (
  renderer: WebGLRenderer,
  scene: Scene,
  camera: Camera
) => {
  if (!renderRequested) {
    renderRequested = true;
    requestAnimationFrame(() => render(renderer, scene, camera));
  }
};
