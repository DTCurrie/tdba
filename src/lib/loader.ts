import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

let _gLTFLoader: GLTFLoader;
export const gLTFLoader = () => {
  if (!_gLTFLoader) {
    _gLTFLoader = new GLTFLoader();
  }

  return _gLTFLoader;
};

let _fBXLoader: FBXLoader;
export const fBXLoader = () => {
  if (!_fBXLoader) {
    _fBXLoader = new FBXLoader();
  }

  return _fBXLoader;
};
