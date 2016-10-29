// A-Frame
import 'aframe';
// Aframe React
import { Entity, Scene } from 'aframe-react';
import React from 'react';
import ReactDOM from 'react-dom';
import extras from 'aframe-extras';

// Components form NPM
import 'aframe-sprite-component';
import 'aframe-look-at-component';
// Local aframe components
//import './aframe-components/interval';
import './aframe-components/three-function';
import './aframe-components/grid';
import './aframe-components/ui-modal';

import 'babel-polyfill';

import Camera from './components/Camera';
import Cursor from './components/Cursor';
import Sky from './components/Sky';

extras.registerAll();

class BoilerplateScene extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      color: 'orange',
    };
  }

  changeColor(e) {
    const colors = ['red', 'orange', 'yellow', 'green', 'blue'];
    this.setState({
      color: colors[Math.floor(Math.random() * colors.length)],
    });
    console.log('yes'); // eslint-disable-line no-console
    console.log(e); // eslint-disable-line no-console
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
          orbit-controls="
            autoRotate: true;
            target: #target;
            enableDamping: true;
            dampingFactor: 0.125;
            rotateSpeed:0.25;
            minDistance:3;
            maxDistance:100;"
          universal-controls
        >
          <Cursor
            cursor="fuse: true; fuseTimeout: 500;"
          />
        </Camera>

        <Sky />

        {/* <a-mb-interval position="0 0 0"></a-mb-interval> */}

        <Entity three-function rotation="0 0 0" position="0 0 0"></Entity>

        <Entity hand-controls="hand: left" />
        <Entity hand-controls="hand: right" />

        {/* <Entity ui-modal visible="false">
          <a-plane width="3" height="1" color="red" position="0 -1.2 0"></a-plane>
          <a-plane width="3" height="1" color="green" position="0 0 0"></a-plane>
          <a-plane width="3" height="1" color="blue" position="0 1.2 0"></a-plane>
        </Entity> */}

        <Entity id="z-axis" position="0 0 0">
          <Entity mixin="blue" line="path: 0 -5 0, 0 5 0" />
        </Entity>

        <Entity light={{ type: 'ambient', color: '#888' }} />
        <Entity light={{ type: 'directional', intensity: 0.5 }} position={[-1, 1, 0]} />
        <Entity light={{ type: 'directional', intensity: 1 }} position={[1, 1, 0]} />

        <Entity
          id="target"
          geometry="primitive: sphere"
          material={{ color: this.state.color }}
          onClick={e => this.changeColor(e)}
          position="0 0 -5"
          interval
        />
      </Scene>
    );
  }
}

ReactDOM.render(<BoilerplateScene />, document.querySelector('.scene-container'));
