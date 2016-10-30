// A-Frame
import 'aframe';
// Components form NPM
import 'aframe-sprite-component';
import 'aframe-look-at-component';
import 'aframe-text-component';
// Local aframe components
// import './aframe-components/interval';
import './aframe-components/three-function';
import './aframe-components/grid';
import './aframe-components/ui-modal';

import 'babel-polyfill';
// Aframe React
import { Entity, Scene } from 'aframe-react';
import React from 'react';
import ReactDOM from 'react-dom';
import extras from 'aframe-extras';

import Camera from './components/Camera';
import Sky from './components/Sky';
import Text from './components/Text';

extras.registerAll();

class VRScene extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      color: 'orange',
      animation: false,
    };
  }

  changeColor() {
    const colors = ['red', 'orange', 'yellow', 'green', 'blue'];
    this.setState({
      color: colors[Math.floor(Math.random() * colors.length)],
    });
  }

  toggleAnimation() {
    this.setState({
      animation: !this.state.animation,
    });
  }

  render() {
    return (
      <Scene grid>

        <a-assets>
          <a-mixin id="blue" line="color: blue"></a-mixin>
        </a-assets>

        <Camera
          position="5 1.8 5"
          rotation="-8.5 43 0"
          orbit-controls={{
            autoRotate: true,
            target: '#target',
            enableDamping: true,
            dampingFactor: 0.125,
            rotateSpeed: 0.25,
            minDistance: 3,
            maxDistance: 100,
          }}
          universal-controls
        >
          <a-cursor animation__click="property: scale; startEvents: click; from: 0.1 0.1 0.1; to: 1 1 1; dur: 150"></a-cursor>
        </Camera>

        <Sky />

        <Text
          text="f(x,y) = x^2 + y^2"
          color={this.state.color}
          position="-1.75 2 -3"
        />

        {/* <a-mb-interval position="0 0 0"></a-mb-interval> */}

        {/* Three.js math function */}
        <Entity
          three-function={{
            equation: 'x^2 + y^2',
            segments: 100,
            xMin: -1,
            xMax: 1,
            yMin: -1,
            yMax: 1,
            zMin: -4,
            zMax: 4,
            animation: this.state.animation,
            animateXBy: 0.01,
            animateYBy: 0.01,
          }}
          rotation="0 0 0"
          position="0 0 0"
          scale="1 1 1"
        ></Entity>

        <Entity vive-controls="hand: left" raycaster="objects: .collidable" />
        <Entity vive-controls="hand: right" raycaster="objects: .collidable" />

        <Entity ui-modal={{ trigger: 'keyup' }} visible="false">
          <a-plane width="3" height="1" color="red" position="0 -1.2 0" onClick={() => this.toggleAnimation()}></a-plane>
          <a-plane width="3" height="1" color="green" position="0 0 0"></a-plane>
          <a-plane width="3" height="1" color="blue" position="0 1.2 0"></a-plane>
        </Entity>

        <Entity id="z-axis" position="0 0 0">
          <Entity mixin="blue" line="path: 0 -5 0, 0 5 0" />
        </Entity>

        <Entity light={{ type: 'ambient', color: '#888' }} />
        <Entity light={{ type: 'directional', intensity: 0.5 }} position={[-1, 1, 0]} />
        <Entity light={{ type: 'directional', intensity: 1 }} position={[1, 1, 0]} />

        <Entity
          className="collidable"
          id="target"
          geometry="primitive: sphere"
          material={{ color: this.state.color }}
          onClick={() => this.changeColor()}
          position="0 0 -5"
        />

        <Text
          text="Click on sphere to toggle animation"
          color="#DADADA"
          position="5 2 4"
        />

        <Entity
          className="collidable"
          id="animation"
          geometry="primitive: sphere"
          material={{ color: 'orange' }}
          onClick={() => this.toggleAnimation()}
          position="5 0 4"
        />

      </Scene>
    );
  }
}

ReactDOM.render(<VRScene />, document.querySelector('.scene-container'));
