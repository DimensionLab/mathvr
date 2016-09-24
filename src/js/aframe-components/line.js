import AFRAME, { THREE } from 'aframe';

const coordinates = AFRAME.utils.coordinates;

AFRAME.registerComponent('line', {
  // Allow line component to accept vertices and color.
  schema: {
    color: { default: '#333' },

    path: {
      default: [
        { x: -0.5, y: 0, z: 0 },
        { x: 0.5, y: 0, z: 0 },
      ],

      // Deserialize path in the form of comma-separated vec3s: `0 0 0, 1 1 1, 2 0 3`.
      parse(value) {
        return value.split(',').map(coordinates.parse);
      },

      // Serialize array of vec3s in case someone does
      // setAttribute('line', 'path', [...]).
      stringify(data) {
        return data.map(coordinates.stringify).join(',');
      },
    },
  },

  update(oldData) { // eslint-disable-line no-unused-vars
    // Set color with material.
    const material = new THREE.LineBasicMaterial({
      color: this.data.color,
    });

    // Add vertices to geometry.
    const geometry = new THREE.Geometry();
    this.data.path.forEach((vec3) => {
      geometry.vertices.push(
        new THREE.Vector3(vec3.x, vec3.y, vec3.z)
      );
    });

    // Apply mesh.
    this.el.setObject3D('mesh', new THREE.Line(geometry, material));
  },

  remove() {
    this.el.removeObject3D('mesh');
  },

});
