import AFRAME, { THREE } from 'aframe';

AFRAME.registerComponent('ui-modal', {

  schema: {
    trigger: {
      default: 'click',
    },
    zpos: {
      default: -4,
    },
  },

  init() {
    console.log(this.data.trigger);
    document.querySelector('a-scene').addEventListener(this.data.trigger, this.eventHandler.bind(this));

    this.cameraEl = document.querySelector('a-entity[camera]');

    this.yaxis = new THREE.Vector3(0, 1, 0);
    this.zaxis = new THREE.Vector3(0, 0, 1);

    this.pivot = new THREE.Object3D();
    this.el.object3D.position.set(0, this.cameraEl.object3D.getWorldPosition().y, this.data.zpos);

    this.el.sceneEl.object3D.add(this.pivot);
    this.pivot.add(this.el.object3D);
  },

  eventHandler(evt) { // eslint-disable-line no-unused-vars
    console.log(evt);
    if (this.el.getAttribute('visible') === false) {
      const direction = this.zaxis.clone();
      direction.applyQuaternion(this.cameraEl.object3D.quaternion);
      const ycomponent = this.yaxis.clone().multiplyScalar(direction.dot(this.yaxis));
      direction.sub(ycomponent);
      direction.normalize();

      this.pivot.quaternion.setFromUnitVectors(this.zaxis, direction);
      this.pivot.position.copy(this.cameraEl.object3D.getWorldPosition());

      this.el.setAttribute('visible', true);
    } else if (this.el.getAttribute('visible') === true) {
      this.el.setAttribute('visible', false);
    }
  },

  update(oldData) {}, // eslint-disable-line no-unused-vars

  remove() {}, // eslint-disable-line no-unused-vars

});
