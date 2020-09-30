import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Box from './components/box';
import Box2 from './components/box2';

import LineGraph from './components/LineGraph'
import WorldMap from './components/Map'
import * as serviceWorker from './serviceWorker';
import StatsBox from './components/StatsBox'
ReactDOM.render(
 
  
  <Box/>

,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
