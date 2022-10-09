import {
  Clock,
  Group,
  Mesh,
  MeshToonMaterial,
  Raycaster,
  Scene,
  Vector2,
  Vector3,
} from 'three';
import { Pathfinding, PathfindingHelper } from 'three-pathfinding';
import { createCapsule } from './geometry/capsule';
import { createAmbientLight } from './lib/ambient-light';
import { createCamera } from './lib/camera';
import { gLTFLoader } from './lib/loader';
import { createPointLight } from './lib/point-light';
import { createRenderer, render, requestRender } from './lib/renderer';
import { createScene } from './lib/scene';
import { screenSize } from './lib/screen-size';
import './style.css';

const { aspect, width, height } = screenSize();

const renderer = createRenderer(width(), height());
const mainScene = createScene();

const { camera, controls } = createCamera({});
camera.aspect = aspect();
camera.updateProjectionMatrix();

const point = createPointLight(0xffffff, 0.5);
const ambient = createAmbientLight(0x404040, 0.25);
mainScene.add(point, ambient);

const actor = new Scene();
const capsule = createCapsule(0.5, 0.5);
actor.add(capsule);
actor.position.y = 3;
capsule.position.y = 0.5;
mainScene.add(actor);

const pathfinding = new Pathfinding();

const helper = new PathfindingHelper();
helper.setTargetPosition(new Vector3(-3.5, 0.5, 5.5));
mainScene.add(helper);

const ZONE = 'level';
const SPEED = 5;
const OFFSET = 0.2;

const targetPosition = new Vector3();

let level: Group;
let navmesh: Mesh;
let groupID: number;
let path: Vector3[] | null;

const clock = new Clock();
const mouse = new Vector2();
const mouseDown = new Vector2();
const raycaster = new Raycaster();

gLTFLoader().load(
  'assets/test-level.glb',
  ({ scene }) => {
    const levelMesh = scene.getObjectByName('Cube') as Mesh;
    const levelMat = new MeshToonMaterial({
      color: 0x00ff00,
      depthTest: true,
      depthWrite: true,
    });
    levelMesh.material = levelMat;
    level = scene;
    mainScene.add(scene);
  },
  (e) => {
    console.info('assets/test-level.glb progress', e);
  },
  (e) => {
    console.error('assets/test-level.glb error', e);
  }
);

gLTFLoader().load(
  'assets/test-level-nav.glb',
  ({ scene }) => {
    console.log('scene', scene);
    const _navmesh = scene.getObjectByName('Navmesh') as Mesh;
    _navmesh.material = new MeshToonMaterial({
      color: 0xffffff,
      opacity: 0.75,
      depthTest: true,
      depthWrite: true,
      transparent: true,
    });

    console.time('createZone()');
    const zone = Pathfinding.createZone(_navmesh.geometry);
    console.timeEnd('createZone()');

    pathfinding.setZoneData(ZONE, zone);

    const navWireframe = new Mesh(
      _navmesh.geometry,
      new MeshToonMaterial({
        color: 0x808080,
        depthTest: true,
        depthWrite: true,
        wireframe: true,
        visible: true,
      })
    );
    navWireframe.position.y = OFFSET / 2;
    scene.add(navWireframe);

    navmesh = new Mesh(_navmesh.geometry);

    // Set the player's navigation mesh group
    groupID = pathfinding.getGroup(ZONE, actor.position);
    mainScene.add(scene);
  },
  (e) => {
    console.info('assets/test-level-nav.glb progress', e);
  },
  (e) => {
    console.error('assets/test-level-nav.glb error', e);
  }
);

function onDocumentPointerDown(event: MouseEvent) {
  mouseDown.x = (event.clientX / width()) * 2 - 1;
  mouseDown.y = -(event.clientY / height()) * 2 + 1;
}

function onDocumentPointerUp(event: MouseEvent) {
  mouse.x = (event.clientX / width()) * 2 - 1;
  mouse.y = -(event.clientY / height()) * 2 + 1;
  console.log('onDocumentPointerUp', { mouse });

  if (
    Math.abs(mouseDown.x - mouse.x) > 0 ||
    Math.abs(mouseDown.y - mouse.y) > 0
  ) {
    console.log(
      'onDocumentPointerUp Prevent unwanted click when rotate camera'
    );
    return; // Prevent unwanted click when rotate camera.
  }

  camera.updateMatrixWorld();
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObject(navmesh);
  console.log('onDocumentPointerUp', { intersects });

  if (!intersects.length) return;

  targetPosition.copy(intersects[0].point);
  console.log('onDocumentPointerUp', { targetPosition });

  helper.reset().setPlayerPosition(actor.position);

  // Teleport on ctrl/cmd click or RMB.
  if (event.metaKey || event.ctrlKey || event.button === 2) {
    path = null;
    groupID = pathfinding.getGroup(ZONE, targetPosition, true);
    const closestNode = pathfinding.getClosestNode(
      actor.position,
      ZONE,
      groupID,
      true
    );

    helper.setPlayerPosition(actor.position.copy(targetPosition));
    if (closestNode) helper.setNodePosition(closestNode.centroid);

    return;
  }

  const targetGroupID = pathfinding.getGroup(ZONE, targetPosition, true);
  const closestTargetNode = pathfinding.getClosestNode(
    targetPosition,
    ZONE,
    targetGroupID,
    true
  );

  helper.setTargetPosition(targetPosition);
  if (closestTargetNode) helper.setNodePosition(closestTargetNode.centroid);

  // Calculate a path to the target and store it
  path = pathfinding.findPath(actor.position, targetPosition, ZONE, groupID);

  if (path && path.length) {
    helper.setPath(path);
  } else {
    const closestPlayerNode = pathfinding.getClosestNode(
      actor.position,
      ZONE,
      groupID
    );
    const clamped = new Vector3();

    // TODO(donmccurdy): Don't clone targetPosition, fix the bug.
    pathfinding.clampStep(
      actor.position,
      targetPosition.clone(),
      closestPlayerNode,
      ZONE,
      groupID,
      clamped
    );

    helper.setStepPosition(clamped);
  }
}

function tick(dt: number) {
  if (!level || !(path || []).length) return;
  console.log('tick', { dt, level, path });

  let targetPosition = path?.[0];
  const velocity = targetPosition?.clone().sub(actor.position);

  if (velocity && velocity.lengthSq() > 0.05 * 0.05) {
    velocity.normalize();
    // Move player to target
    actor.position.add(velocity.multiplyScalar(dt * SPEED));
    helper.setPlayerPosition(actor.position);
  } else {
    // Remove node from the path we calculated
    path?.shift();
  }
}

function animate() {
  requestAnimationFrame(animate);
  tick(clock.getDelta());
  requestRender(renderer, mainScene, camera);
}

document.addEventListener('pointerdown', onDocumentPointerDown, false);
document.addEventListener('pointerup', onDocumentPointerUp, false);

controls.addEventListener('change', () =>
  requestRender(renderer, mainScene, camera)
);

window.addEventListener('resize', () => {
  renderer.setSize(width(), height());
  camera.aspect = aspect();
  camera.updateProjectionMatrix();
  requestRender(renderer, mainScene, camera);
});

camera.lookAt(mainScene.position);
render(renderer, mainScene, camera);
animate();
