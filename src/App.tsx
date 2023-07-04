import React, { useEffect, useState } from 'react';

import Preflight from './components/Preflight/Preflight';
import {
  ClientCallType,
  InfinityClient,
  createCallSignals,
  createInfinityClient,
  createInfinityClientSignals
} from '@pexip/infinity';
import Conference from './components/Conference/Conference';
import Error from './components/Error/Error';
import Loading from './components/Loading/Loading';
import Pin from './components/Pin/Pin';

import './App.css';

// TODO (05) Define an enum with all the possible connection states

// TODO (01) Create constant with the Infinity Client Signals
// TODO (02) Create constant with the Call Signals

// TODO (03) Define the variable that will contain the Infinity Client

function App() {

  // TODO (06) Define all the variables for the state with the useState hook

  // TODO (07) Define the function handleStartConference

  // TODO (08) Define handleDisconnect

  // TODO (04) Create the Infinity Client inside a useEffect hook

  // TODO (09) Bind the signals to function in a useEffect hook

  // TODO (10) Create a switch statement that will select the component to display

  return (
    <div className="App" data-testid='App'>
      {/* TODO (11) Return the component that was chosen in the switch */}
    </div>
  );
}

export default App;
