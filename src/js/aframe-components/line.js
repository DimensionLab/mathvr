import AFRAME from 'aframe';

const coordinates = AFRAME.utils.coordinates;

AFRAME.registerComponent('line', {
  // Allow line component to accept vertices and color.
  schema: {
    color: { default: '#333' },

    path: {
      default: [
        { x: -0.5, y: 0, z: 0 },
        { x: 0.5, y: 0, z: 0 }
      ],

      // Deserialize path in the form of comma-separated vec3s: `0 0 0, 1 1 1, 2 0 3`.
      parse: function (value) {
        return value.split(',').map(coordinates.parse);
      },

      // Serialize array of vec3s in case someone does
      // setAttribute('line', 'path', [...]).
      stringify: function (data) {
        return data.map(coordinates.stringify).join(',');
      }
    }
  },

  update: function (oldData) {
    // Set color with material.
    var material = new THREE.LineBasicMaterial({
      color: this.data.color
    });

    // Add vertices to geometry.
    var geometry = new THREE.Geometry();
    this.data.path.forEach(function (vec3) {
      geometry.vertices.push(
        new THREE.Vector3(vec3.x, vec3.y, vec3.z)
      );
    });

    // Apply mesh.
    this.el.setObject3D('mesh', new THREE.Line(geometry, material));
  },

  remove: function () {
    this.el.removeObject3D('mesh');
  }

});
