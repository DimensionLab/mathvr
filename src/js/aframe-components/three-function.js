import AFRAME, { THREE } from 'aframe';
import math from 'mathjs';
import squareImage from './square.png';

var parser = math.parser();

// parameters for the equations
let a = 0.01, b = 0.01, c = 0.01, d = 0.01;

let graphMesh;

AFRAME.registerComponent('three-function', {
  schema: {
    equation: { default: 'f(x,y) = x^2 + y^2' },
    segments: { default: 20 },
    xMin: { default: -5 },
    xMax: { default: 5 },
    yMin: { default: -5 },
    yMax: { default: 5 },
    zMin: { default: -5 },
    zMax: { default: 5 },
    animation: { default: false },
    animationType: { default: 'rotation' },
    animateXBy:  { default: 0 },
    animateYBy:  { default: 0 },
    animateZBy:  { default: 0 },

  },

  init() {
    // "wireframe texture"
    const loader = new THREE.TextureLoader();
    const wireTexture = loader.load(squareImage);
    wireTexture.wrapS = wireTexture.wrapT = THREE.RepeatWrapping;
    wireTexture.repeat.set( 40, 40 );
    this.wireMaterial = new THREE.MeshBasicMaterial( { map: wireTexture, vertexColors: THREE.VertexColors, side:THREE.DoubleSide } );
    this.vertexColorMaterial  = new THREE.MeshBasicMaterial( { vertexColors: THREE.VertexColors } );
  },

  tick(t, dt) {
    const data = this.data;

    if (data.animation && data.animationType === 'rotation') {
      graphMesh.rotation.x += data.animateXBy;
      graphMesh.rotation.y += data.animateYBy;
      graphMesh.rotation.z += data.animateZBy;
    }
  },

  update(oldData) {
    const scene = this.el.object3D;
    // Equation parser
    const equation = this.data.equation;
    parser.eval(equation);
    let f1 = parser.get('f');
    parser.clear();

    let segments = this.data.segments;

    let xMin = this.data.xMin;
    let xMax = this.data.xMax;
    let yMin = this.data.yMin;
    let yMax = this.data.yMax;
    let zMin = this.data.zMin;
    let zMax = this.data.zMax;

    let xRange = xMax - xMin;
    let yRange = yMax - yMin;
    let zRange = zMax - zMin;

    xRange = xMax - xMin;
    yRange = yMax - yMin;

    const meshFunction = function(x, y) {
      x = xRange * x + xMin;
      y = yRange * y + yMin;
      const z = f1(x, y)
      //console.log('x is ' + x + ', y is ' + y + ', and f(x,y) = ' + z);
      if ( isNaN(z) ) {
        return new THREE.Vector3(0,0,0); // TODO: better fix
      }

      if (z < zMin) {
        return new THREE.Vector3(x, zMin, y);
      }

      if (z > zMax) {
        return new THREE.Vector3(x, zMax, y);
      }

      return new THREE.Vector3(x, z, y);
    };

    // true => sensible image tile repeat...
    const graphGeometry = new THREE.ParametricGeometry( meshFunction, segments, segments, true );

    ///////////////////////////////////////////////
    // calculate vertex colors based on Z values //
    ///////////////////////////////////////////////
    graphGeometry.computeBoundingBox();
    yMin = graphGeometry.boundingBox.min.y;
    yMax = graphGeometry.boundingBox.max.y;
    yRange = yMax - yMin;
    let color, point, face, numberOfSides, vertexIndex;
    // faces are indexed using characters
    const faceIndices = [ 'a', 'b', 'c', 'd' ];
    // first, assign colors to vertices as desired
    for ( let i = 0; i < graphGeometry.vertices.length; i++ ) {
      point = graphGeometry.vertices[ i ];
      color = new THREE.Color( 0x0000ff );
      color.setHSL( 0.7 * (yMax - point.y) / yRange, 1, 0.5 );
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
    this.wireMaterial.map.repeat.set( segments, segments );

    graphMesh = new THREE.Mesh( graphGeometry, this.wireMaterial );
    graphMesh.doubleSided = true;
    scene.add(graphMesh);
  },

  remove() {
    const scene = this.el.object3D;
    scene.remove(scene.getObjectByName('three-function'));
  },
});
