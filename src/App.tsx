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

enum ConnectionState {
  Disconnected,
  Connecting,
  Connected,
  Error
};

const infinityClientSignals = createInfinityClientSignals([]);
const callSignals = createCallSignals([]);

let infinityClient: InfinityClient;

function App() {

  const [connectionState, setConnectionState] = useState<ConnectionState>(ConnectionState.Disconnected);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState('');

  const handleStartConference = async (nodeDomain: string, conferenceAlias: string, displayName: string) => {
    setConnectionState(ConnectionState.Connecting);
    const localStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true
    });
    setLocalStream(localStream);
    const response = await infinityClient.call({
      callType: ClientCallType.AudioVideo,
      node: nodeDomain,
      conferenceAlias,
      displayName,
      bandwidth: 0,
      mediaStream: localStream
    });
    if (response != null) {
      if (response.status !== 200) {
        localStream.getTracks().forEach((track) => track.stop());
        setLocalStream(null);
      }
      switch (response.status) {
        case 200:
          setConnectionState(ConnectionState.Connected);
          break;
        case 403: {
          setConnectionState(ConnectionState.Error);
          setError('The conference is protected by PIN');
          break;
        }
        case 404: {
          setConnectionState(ConnectionState.Error);
          setError('The conference doesn\'t exist');
          break;
        }
        default: {
          setConnectionState(ConnectionState.Error);
          setError('Internal error');
          break;
        }
      }
    } else {
      setConnectionState(ConnectionState.Error);
      setError('The server isn\'t available');
    }
  };

  const handleDisconnect = () => {
    localStream?.getTracks().forEach((track) => track.stop());
    infinityClient.disconnect({reason: 'User initiated disconnect'});
    setConnectionState(ConnectionState.Disconnected);
  };

  useEffect(() => {
    infinityClient = createInfinityClient(
      infinityClientSignals,
      callSignals,
    );
  }, [error]);

  useEffect(() => {
    callSignals.onRemoteStream.add((stream) => setRemoteStream(stream));
    infinityClientSignals.onError.add((error) => {
      setConnectionState(ConnectionState.Error);
      setError(error.error);
    });
    infinityClientSignals.onDisconnected.add(() => setConnectionState(ConnectionState.Disconnected));
    const disconnectBrowserClosed = () => {
      infinityClient.disconnect({reason: 'Browser closed'});
    };
    window.addEventListener('beforeunload', disconnectBrowserClosed);
    return () => window.removeEventListener('beforeunload', disconnectBrowserClosed);
  }, []);

  let component;
  switch (connectionState) {
    case ConnectionState.Connecting:
      component = <Loading />;
      break;
    case ConnectionState.Connected:
      component = (
        <Conference
          localStream={localStream}
          remoteStream={remoteStream}
          onDisconnect={handleDisconnect}
        />
      );
      break;
    case ConnectionState.Error:
      component = <Error message={error} onClose={() => setConnectionState(ConnectionState.Disconnected)}/>;
      break;
    default:
      component = <Preflight onSubmit={ handleStartConference }/>;
      break;
  }

  return (
    <div className="App" data-testid='App'>
      {component}
    </div>
  );
}

export default App;
