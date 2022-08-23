import { createBox } from './geometry/box';
import { createAmbientLight } from './lib/ambient-light';
import { animate } from './lib/animate';
import { createCamera } from './lib/camera';
import { createPointLight } from './lib/point-light';
import { createRenderer } from './lib/renderer';
import { createScene } from './lib/scene';
import { useWindowSize } from './lib/window-size';
import './style.css';

const { width, height } = useWindowSize();

const scene = createScene();
const camera = createCamera({});
const renderer = createRenderer(width(), height());

const point = createPointLight(0xffffff, 0.5);
const ambient = createAmbientLight(0x404040, 0.25);
scene.add(point, ambient);

const box = createBox(10, 1, 10);
scene.add(box);

animate(renderer, scene, camera, () => {});
