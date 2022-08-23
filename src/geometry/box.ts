import {
  BoxGeometry,
  Mesh,
  ColorRepresentation,
  MeshToonMaterial,
} from 'three';

export const createBox = (
  width?: number,
  height?: number,
  depth?: number,
  color: ColorRepresentation = 0x00ff00
) => {
  const geometry = new BoxGeometry(width, height, depth);

  const material = new MeshToonMaterial({
    color,
    depthTest: true,
    depthWrite: true,
  });

  const cube = new Mesh(geometry, material);

  return cube;
};
