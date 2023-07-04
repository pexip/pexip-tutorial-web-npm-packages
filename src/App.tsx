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
  PinRequired,
  PinOptional,
  Error
};

const infinityClientSignals = createInfinityClientSignals([]);
const callSignals = createCallSignals([]);

let infinityClient: InfinityClient;

function App() {

  const [connectionState, setConnectionState] = useState<ConnectionState>(ConnectionState.Disconnected);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [presentationStream, setPresentationStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState('');

  const [nodeDomain, setNodeDomain] = useState<string>('');
  const [conferenceAlias, setConferenceAlias] = useState<string>('');
  const [displayName, setDisplayName] = useState<string>('');

  const handleStartConference = async (nodeDomain: string, conferenceAlias: string, displayName: string) => {
    setNodeDomain(nodeDomain);
    setConferenceAlias(conferenceAlias);
    setDisplayName(displayName);
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
          console.warn('The conference is protected by PIN');
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
    presentationStream?.getTracks().forEach((track) => track.stop());
    setPresentationStream(null);
    infinityClient.disconnect({reason: 'User initiated disconnect'});
    setConnectionState(ConnectionState.Disconnected);
  };

  const handleSetPin = (pin: string) => {
    const currentPin = pin !== '' ? pin : 'none';
    infinityClient.setPin(currentPin);
    handleStartConference(nodeDomain, conferenceAlias, displayName);
    setConnectionState(ConnectionState.Connecting);
  };

  const handleAudioMute = (mute: boolean) => {
    infinityClient.mute({mute});
  };

  const handleVideoMute = async (mute: boolean) => {
    infinityClient.muteVideo({muteVideo: mute});
    if (mute) {
      localStream?.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
    } else {
      const stream = await navigator.mediaDevices.getUserMedia({audio: true, video: true});
      setLocalStream(stream);
    }
  };

  const handleScreenShare = async (share: boolean, onEnded: () => void) => {
    if (share) {
      const stream = await navigator.mediaDevices.getDisplayMedia();
      stream.getVideoTracks()[0].onended = () => {
        onEnded();
        setPresentationStream(null);
        infinityClient.stopPresenting();
      }
      infinityClient.present(stream);
      setPresentationStream(stream);
    } else {
      presentationStream?.getTracks().forEach((track) => track.stop());
      setPresentationStream(null);
      infinityClient.stopPresenting();
    }
  };

  useEffect(() => {
    infinityClient = createInfinityClient(
      infinityClientSignals,
      callSignals,
    );
  }, [error]);

  useEffect(() => {
    callSignals.onRemoteStream.add((stream) => setRemoteStream(stream));
    callSignals.onRemotePresentationStream.add((stream) => setPresentationStream(stream));
    infinityClientSignals.onError.add((error) => {
      setConnectionState(ConnectionState.Error);
      setError(error.error);
    });
    infinityClientSignals.onDisconnected.add(() => setConnectionState(ConnectionState.Disconnected));
    const disconnectBrowserClosed = () => {
      infinityClient.disconnect({reason: 'Browser closed'});
    };
    infinityClientSignals.onPinRequired.add(({hasHostPin, hasGuestPin}) => {
      if (hasHostPin && hasGuestPin) {
        setConnectionState(ConnectionState.PinRequired);
      } else {
        setConnectionState(ConnectionState.PinOptional);
      }
    });
    window.addEventListener('beforeunload', disconnectBrowserClosed);
    return () => window.removeEventListener('beforeunload', disconnectBrowserClosed);
  }, []);

  let component;
  switch (connectionState) {
    case ConnectionState.Connecting:
      component = <Loading />;
      break;
      case ConnectionState.PinRequired:
        component = <Pin onSubmit={ handleSetPin } required={true}/>;
        break;
      case ConnectionState.PinOptional:
        component = <Pin onSubmit={ handleSetPin } required={false}/>;
        break;    case ConnectionState.Connected:
      component = (
        <Conference
          localStream={localStream}
          remoteStream={remoteStream}
          presentationStream={presentationStream}
          onAudioMute={handleAudioMute}
          onVideoMute={handleVideoMute}
          onScreenShare={handleScreenShare}
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
