import { PerspectiveCamera } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { canvas } from './canvas';

export interface CameraOptions {
  fov?: number;
  aspect?: number;
  near?: number;
  far?: number;
}

export const createCamera = ({
  fov = 60,
  aspect = 2,
  near = 0.1,
  far = 5000,
}: CameraOptions): { camera: PerspectiveCamera; controls: OrbitControls } => {
  const camera = new PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(40, 10, 30);
  camera.lookAt(0, 5, 0);

  const controls = new OrbitControls(camera, canvas());
  controls.enableDamping = true;
  controls.dampingFactor = 0.2;
  controls.target.set(0, 0, 0);
  controls.update();

  return { camera, controls };
};
