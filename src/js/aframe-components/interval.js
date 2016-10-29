import AFRAME from 'aframe';
import '../systems/mathbox';

// const coordinates = AFRAME.utils.coordinates;

AFRAME.registerComponent('mathbox-interval', {
  init() {
    if (!this.el.sceneEl.renderStarted) {
      return this.el.sceneEl.addEventListener('renderstart', this.init.bind(this));
    }

    const camera = this.el.sceneEl.camera;
    const renderer = this.el.sceneEl.renderer;
    const scene = this.el.sceneEl.object3D;
    const context = this.el.sceneEl.systems.mathbox.context;
    const view = this.el.sceneEl.systems.mathbox.view;

    console.log(this.el.sceneEl);
    view.axis({
      detail: 30,
    });

    view.axis({
      axis: 2,
    });

    view.scale({
      divide: 10,
    })
    view.ticks({
      classes: ['foo', 'bar'],
      width: 2
    });

    view.grid({
      divideX: 30,
      width: 1,
      opacity: 0.5,
      zBias: -5,
    });

    view.interval({
      id: 'sampler',
      width: 14,
      expr: function (emit, x, i, t) {
        y = Math.sin(x + t) * 7;
        emit(x, y);
      },
      channels: 2,
    });

    view.line({
      points: '#sampler',
      color: 0x3090FF,
      width: 5,
    });

    const frame = () => {
      requestAnimationFrame(frame);
      context.frame();
      renderer.render(scene, camera);
    };

    requestAnimationFrame(frame);
  },
});

AFRAME.registerPrimitive('a-mb-interval', {
  defaultComponents: { 'mathbox-interval': {} },
});

// AFRAME.registerComponent('interval', {

//   init() {
//     this.system = this.el.sceneEl.systems.physics;

//     if (this.system) {
//       this.system.addBehavior(this, this.system.Phase.RENDER);
//     }

//     this.el.setAttribute('scale', { x: 0.1, y: 0.1, z: 0.1 });
//     console.log(this.scale);
//   },

//   remove() {
//     if (this.system) {
//       this.system.removeBehavior(this, this.system.Phase.RENDER);
//     }
//   },

//   tick(t, dt) {
//     // if (!dt) return;
//     // if (this.system) return;
//     this.step(t, dt);
//   },

//   step(t, dt) {
//     //console.log('time:' + t / 1000);
//     //console.log('dt: ' + dt);
//     const physics = this.el.sceneEl.systems.physics || { data: { maxInterval: 1 / 10 } };

//     const position = this.el.getAttribute('position') || { x: 0, y: 0, z: 0 };

//     dt = Math.min(dt, physics.data.maxInterval * 1000); // eslint-disable-line no-param-reassign

//     this.el.setAttribute('position', {
//       x: Math.cos(position.x + (t / 1000)),
//       y: 0,
//       z: 0,
//     });
//   },
// });
