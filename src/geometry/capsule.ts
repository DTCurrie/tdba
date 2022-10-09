import {
  CapsuleGeometry,
  Mesh,
  ColorRepresentation,
  MeshToonMaterial,
} from 'three';

export const createCapsule = (
  radius?: number,
  length?: number,
  capSegments?: number,
  radialSegments?: number,
  color: ColorRepresentation = 0x0000ff
) => {
  const geometry = new CapsuleGeometry(
    radius,
    length,
    capSegments,
    radialSegments
  );

  const material = new MeshToonMaterial({
    color,
    depthTest: true,
    depthWrite: true,
  });

  const capsule = new Mesh(geometry, material);
  return capsule;
};
