import { Entity } from 'aframe-react';
import React from 'react';

export default props => (
  <Entity>
    <Entity camera="" {...props} />
  </Entity>
);
