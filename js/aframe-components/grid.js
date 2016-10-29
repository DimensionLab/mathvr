import AFRAME, { THREE } from 'aframe';

/**
 * GridHelper component for A-Frame.
 */
AFRAME.registerComponent('grid', {
  schema: {
    size: { default: 10 },
    step: { default: 1 },
    colorCenterLine: { default: 'red' },
    colorGrid: { default: 'black' },
  },

  init() {
    const scene = this.el.object3D;
    const data = this.data;

    const size = data.size;
    const step = data.step;
    const colorCenterLine = data.colorCenterLine;
    const colorGrid = data.colorGrid;

    const gridHelper = new THREE.GridHelper(size, step);
    gridHelper.setColors(colorCenterLine, colorGrid);
    gridHelper.name = 'grid';
    scene.add(gridHelper);
  },

  remove() {
    const scene = this.el.object3D;
    scene.remove(scene.getObjectByName('grid'));
  },
});
