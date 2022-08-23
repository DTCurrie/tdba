import { ColorRepresentation, PointLight } from 'three';

export const createPointLight = (
  color: ColorRepresentation,
  intensity: number
) => {
  const directionalLight = new PointLight(color, intensity);
  directionalLight.position.x = 0;
  directionalLight.position.y = 100;
  directionalLight.position.z = 100;

  return directionalLight;
};
