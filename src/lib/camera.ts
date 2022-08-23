import { OrthographicCamera } from 'three';
import { useWindowSize } from './window-size';

export interface CameraOptions {
  frustrum?: number;
  near?: number;
  far?: number;
}

export const createCamera = ({
  frustrum = 10,
  near = 1,
  far = 1000,
}: CameraOptions) => {
  const { aspect } = useWindowSize();
  const camera = new OrthographicCamera(
    -frustrum * aspect(),
    frustrum * aspect(),
    frustrum,
    -frustrum,
    near,
    far
  );

  camera.position.set(-frustrum, frustrum, frustrum);
  camera.rotation.order = 'YXZ';
  camera.rotation.y = -Math.PI / 4;
  camera.rotation.x = Math.atan(-1 / Math.sqrt(2));

  return camera;
};
