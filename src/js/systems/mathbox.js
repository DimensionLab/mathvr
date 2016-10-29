import AFRAME, { THREE } from 'aframe';
import 'mathbox';
//console.log(MathBox);

AFRAME.registerSystem('mathbox', {
  init() {
    const sceneEl = this.sceneEl;

    if (!sceneEl.renderStarted) {
      return sceneEl.addEventListener('renderstart', this.init.bind(this));
    }

    this.context = new MathBox.Context(sceneEl.renderer, sceneEl.object3D, sceneEl.camera);
    this.context.init();
    console.log(this.context);
    this.mathbox = this.context.api;

    // MathBox elements
    this.view = this.mathbox
      .set({
        focus: 3,
      })
      .cartesian({
        range: [[-2, 2], [-1, 1], [-1, 1]],
        scale: [2, 1, 1],
      });
  },
});
