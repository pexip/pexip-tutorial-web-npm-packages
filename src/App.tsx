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

function App() {
  return (
    <div className="App" data-testid='App'>
    </div>
  );
}

export default App;
