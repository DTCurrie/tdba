import { ColorRepresentation, AmbientLight } from 'three';

export const createAmbientLight = (
  color: ColorRepresentation,
  intensity: number
) => {
  const pointLight = new AmbientLight(color, intensity);
  return pointLight;
};
