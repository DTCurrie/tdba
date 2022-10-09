declare module 'three-pathfinding' {
  import { Vector3 } from 'three/src/math/Vector3';
  import { Object3D } from 'three/src/core/Object3D';
  import { SphereBufferGeometry } from 'three/src/geometries/SphereGeometry';
  import { MeshBasicMaterial } from 'three/src/materials/MeshBasicMaterial';
  import { Mesh } from 'three/src/objects/Mesh';
  import { BoxBufferGeometry } from 'three/src/geometries/BoxGeometry';
  import { LineBasicMaterial } from 'three/src/materials/LineBasicMaterial';
  import { BufferGeometry } from 'three/src/core/BufferGeometry';

  export class AStar {
    static init(graph: any): void;
    static cleanUp(graph: any): void;
    static heap(): BinaryHeap;
    static search(graph: any, start: any, end: any): any[];
    static heuristic(pos1: any, pos2: any): number;
    static neighbours(graph: any, node: any): any[];
  }

  export class BinaryHeap {
    constructor(scoreFunction: any);
    content: any[];
    scoreFunction: any;
    push(element: any): void;
    pop(): any;
    remove(node: any): void;
    size(): number;
    rescoreElement(node: any): void;
    sinkDown(n: any): void;
    bubbleUp(n: any): void;
  }

  export class Builder {
    /**
     * Constructs groups from the given navigation mesh.
     * @param  {BufferGeometry} geometry
     * @param  {number} tolerance
     * @return {Zone}
     */
    static buildZone(geometry: BufferGeometry, tolerance: number): Zone;
    /**
     * Constructs a navigation mesh from the given geometry.
     * @param {BufferGeometry} geometry
     * @return {Object}
     */
    static _buildNavigationMesh(geometry: BufferGeometry, tolerance: any): any;
    /**
     * Spreads the group ID of the given polygon to all connected polygons
     * @param {Object} seed
     */
    static _spreadGroupId(seed: any): void;
    static _buildPolygonGroups(navigationMesh: any): any[];
    static _buildPolygonNeighbours(
      polygon: any,
      vertexPolygonMap: any
    ): Set<any>;
    static _buildPolygonsFromGeometry(geometry: any): {
      polygons: {
        vertexIds: any[];
        neighbours: any;
      }[];
      vertices: Vector3[];
    };
    static _getSharedVerticesInOrder(a: any, b: any): any[];
  }

  export class Channel {
    portals: any[];
    push(p1: any, p2: any): void;
    stringPull(): any[];
    path: any[];
  }

  /**
   * Defines an instance of the pathfinding module, with one or more zones.
   */
  export class Pathfinding {
    /**
     * (Static) Builds a zone/node set from navigation mesh geometry.
     * @param  {BufferGeometry} geometry
     * @param  {number} tolerance Vertex welding tolerance.
     * @return {Zone}
     */
    static createZone(geometry: BufferGeometry, tolerance?: number): any;
    zones: {};
    /**
     * Sets data for the given zone.
     * @param {string} zoneID
     * @param {Zone} zone
     */
    setZoneData(zoneID: string, zone: any): void;
    /**
     * Returns a random node within a given range of a given position.
     * @param  {string} zoneID
     * @param  {number} groupID
     * @param  {Vector3} nearPosition
     * @param  {number} nearRange
     * @return {Node}
     */
    getRandomNode(
      zoneID: string,
      groupID: number,
      nearPosition: Vector3,
      nearRange: number
    ): Node;
    /**
     * Returns the closest node to the target position.
     * @param  {Vector3} position
     * @param  {string}  zoneID
     * @param  {number}  groupID
     * @param  {boolean} checkPolygon
     * @return {Node}
     */
    getClosestNode(
      position: Vector3,
      zoneID: string,
      groupID: number,
      checkPolygon?: boolean
    ): Node;
    /**
     * Returns a path between given start and end points. If a complete path
     * cannot be found, will return the nearest endpoint available.
     *
     * @param  {Vector3} startPosition Start position.
     * @param  {Vector3} targetPosition Destination.
     * @param  {string} zoneID ID of current zone.
     * @param  {number} groupID Current group ID.
     * @return {Array<Vector3>} Array of points defining the path.
     */
    findPath(
      startPosition: Vector3,
      targetPosition: Vector3,
      zoneID: string,
      groupID: number
    ): Array<Vector3>;
    /**
     * Returns closest node group ID for given position.
     * @param  {string} zoneID
     * @param  {Vector3} position
     * @return {number}
     */
    getGroup: (zoneID: any, position: any, checkPolygon?: boolean) => number;
    /**
     * Clamps a step along the navmesh, given start and desired endpoint. May be
     * used to constrain first-person / WASD controls.
     *
     * @param  {Vector3} start
     * @param  {Vector3} end Desired endpoint.
     * @param  {Node} node
     * @param  {string} zoneID
     * @param  {number} groupID
     * @param  {Vector3} endTarget Updated endpoint.
     * @return {Node} Updated node.
     */
    clampStep: (
      startRef: any,
      endRef: any,
      node: any,
      zoneID: any,
      groupID: any,
      endTarget: any
    ) => any;
  }
  /**
   * Defines a node (or polygon) within a group.
   *
   * @type {Object}
   * @property {number} id
   * @property {Array<number>} neighbours IDs of neighboring nodes.
   * @property {Array<number>} vertexIds
   * @property {Vector3} centroid
   * @property {Array<Array<number>>} portals Array of portals, each defined by two vertex IDs.
   * @property {boolean} closed
   * @property {number} cost
   */
  export type Node = {
    id: number;
    neighbours: Array<number>;
    vertexIds: Array<number>;
    centroid: Vector3;
    portals: Array<Array<number>>;
    closed: boolean;
    cost: number;
  };

  /**
   * Helper for debugging pathfinding behavior.
   */
  export class PathfindingHelper extends Object3D<import('three').Event> {
    constructor();
    _playerMarker: Mesh<SphereBufferGeometry, MeshBasicMaterial>;
    _targetMarker: Mesh<BoxBufferGeometry, MeshBasicMaterial>;
    _nodeMarker: Mesh<BoxBufferGeometry, MeshBasicMaterial>;
    _stepMarker: Mesh<BoxBufferGeometry, MeshBasicMaterial>;
    _pathMarker: Object3D<import('three').Event>;
    _pathLineMaterial: LineBasicMaterial;
    _pathPointMaterial: MeshBasicMaterial;
    _pathPointGeometry: SphereBufferGeometry;
    _markers: (
      | Object3D<import('three').Event>
      | Mesh<SphereBufferGeometry, MeshBasicMaterial>
      | Mesh<BoxBufferGeometry, MeshBasicMaterial>
    )[];
    /**
     * @param {Array<Vector3>} path
     * @return {this}
     */
    setPath(path: Array<Vector3>): this;
    /**
     * @param {Vector3} position
     * @return {this}
     */
    setPlayerPosition(position: Vector3): this;
    /**
     * @param {Vector3} position
     * @return {this}
     */
    setTargetPosition(position: Vector3): this;
    /**
     * @param {Vector3} position
     * @return {this}
     */
    setNodePosition(position: Vector3): this;
    /**
     * @param {Vector3} position
     * @return {this}
     */
    setStepPosition(position: Vector3): this;
    /**
     * Hides all markers.
     * @return {this}
     */
    reset(): this;
  }

  export class Utils {
    static roundNumber(value: any, decimals: any): number;
    static sample(list: any): any;
    static distanceToSquared(a: any, b: any): number;
    static isPointInPoly(poly: any, pt: any): boolean;
    static isVectorInPolygon(vector: any, polygon: any, vertices: any): boolean;
    static triarea2(a: any, b: any, c: any): number;
    static vequal(a: any, b: any): boolean;
    /**
     * Modified version of BufferGeometryUtils.mergeVertices, ignoring vertex
     * attributes other than position.
     *
     * @param {THREE.BufferGeometry} geometry
     * @param {number} tolerance
     * @return {THREE.BufferGeometry>}
     */
    static mergeVertices(
      geometry: THREE.BufferGeometry,
      tolerance?: number
    ): THREE.BufferGeometry;
  }
}
