import { WebGLRenderer } from 'three';

export const createRenderer = (width: number, height: number) => {
  const renderer = new WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);

  document.body.appendChild(renderer.domElement);

  return renderer;
};
