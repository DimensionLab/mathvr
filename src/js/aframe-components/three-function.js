import AFRAME, { THREE } from 'aframe';
import squareImage from './square.png';

// parameters for the equations
let a = 0.01, b = 0.01, c = 0.01, d = 0.01;
let segments = 20,
  xMin = -10, xMax = 10, xRange = xMax - xMin,
  yMin = -10, yMax = 10, yRange = yMax - yMin,
  zMin = -10, zMax = 10, zRange = zMax - zMin;

let graphMesh;

AFRAME.registerComponent('three-function', {
  schema: {},

  init() {
    const scene = this.el.object3D;

    // "wireframe texture"
    const wireTexture = new THREE.ImageUtils.loadTexture( squareImage );
    wireTexture.wrapS = wireTexture.wrapT = THREE.RepeatWrapping;
    wireTexture.repeat.set( 40, 40 );
    const wireMaterial = new THREE.MeshBasicMaterial( { map: wireTexture, vertexColors: THREE.VertexColors, side:THREE.DoubleSide } );
    const vertexColorMaterial  = new THREE.MeshBasicMaterial( { vertexColors: THREE.VertexColors } );

    xRange = xMax - xMin;
    yRange = yMax - yMin;

    const meshFunction = function(x, y) {
      x = xRange * x + xMin;
      y = yRange * y + yMin;
      const z = Math.cos(x) * Math.sqrt(y);
      if ( isNaN(z) )
        return new THREE.Vector3(0,0,0); // TODO: better fix
      else
        return new THREE.Vector3(x, z, y);
    };

    // true => sensible image tile repeat...
    const graphGeometry = new THREE.ParametricGeometry( meshFunction, segments, segments, true );

    ///////////////////////////////////////////////
    // calculate vertex colors based on Z values //
    ///////////////////////////////////////////////
    graphGeometry.computeBoundingBox();
    zMin = graphGeometry.boundingBox.min.z;
    zMax = graphGeometry.boundingBox.max.z;
    zRange = zMax - zMin;
    let color, point, face, numberOfSides, vertexIndex;
    // faces are indexed using characters
    const faceIndices = [ 'a', 'b', 'c', 'd' ];
    // first, assign colors to vertices as desired
    for ( let i = 0; i < graphGeometry.vertices.length; i++ ) {
      point = graphGeometry.vertices[ i ];
      color = new THREE.Color( 0x0000ff );
      color.setHSL( 0.7 * (zMax - point.z) / zRange, 1, 0.5 );
      graphGeometry.colors[i] = color; // use this array for convenience
    }
    // copy the colors as necessary to the face's vertexColors array.
    for ( let i = 0; i < graphGeometry.faces.length; i++ ) {
      face = graphGeometry.faces[ i ];
      numberOfSides = ( face instanceof THREE.Face3 ) ? 3 : 4;
      for( let j = 0; j < numberOfSides; j++ ) {
        vertexIndex = face[ faceIndices[ j ] ];
        face.vertexColors[ j ] = graphGeometry.colors[ vertexIndex ];
      }
    }
    ///////////////////////
    // end vertex colors //
    ///////////////////////

    // material choices: vertexColorMaterial, wireMaterial , normMaterial , shadeMaterial

    if (graphMesh) {
      scene.remove( graphMesh );
      // renderer.deallocateObject( graphMesh );
    }
    wireMaterial.map.repeat.set( segments, segments );

    graphMesh = new THREE.Mesh( graphGeometry, wireMaterial );
    graphMesh.doubleSided = true;
    scene.add(graphMesh);
  },

  remove() {
    const scene = this.el.object3D;
    scene.remove(scene.getObjectByName('three-function'));
  },
});
