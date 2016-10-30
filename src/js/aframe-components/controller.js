import AFRAME from 'aframe';

AFRAME.registerComponent('controller', {
  dependencies: ['vive-controls'],

  schema: {
    hand: {default: 'left'}
  },

  init: function () {
    console.log(this.data);
  },
});
