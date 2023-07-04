import React, { useEffect, useState } from 'react';
import Toolbar from './Toolbar/Toolbar';

import './Conference.css';

interface VideoProps {
  className: string;
  mediaStream: MediaStream | null;
  muted?: boolean;
  onClick?: (event: React.MouseEvent<HTMLVideoElement>) => void;
}

const Video = React.memo((props: VideoProps) => {
  return <video className={props.className} autoPlay playsInline
    muted={ props.muted }
    onClick={ props.onClick }
    ref={ (element) => {
      if (element) element.srcObject = props.mediaStream;
    }}
  />
});

interface ConferenceProps {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  presentationStream: MediaStream | null;
  onAudioMute: (mute: boolean) => void;
  onVideoMute: (mute: boolean) => void;
  onScreenShare: (share: boolean, onEnded: () => void) => void;
  onDisconnect: () => void;
}

function Conference(props: ConferenceProps) {

  const [presentationInMain, setPresentationInMain] = useState(true);

  const switchVideos = (event: React.MouseEvent<HTMLVideoElement>) => {
    if (event.target instanceof HTMLVideoElement) {
      if (event.target.className === 'presentation-video') {
        setPresentationInMain(true);
      } else {
        setPresentationInMain(false);
      }
    }
  };
  const memoizedSwitchVideos = React.useCallback(switchVideos , []);

  const additionalClasses = presentationInMain && props.presentationStream
  ? ' presentation-in-main' : '';

  useEffect(() => {
    if (!props.presentationStream) {
      setPresentationInMain(true)
    }
  }, [props.presentationStream]);

  return (
    <div className={'Conference' + additionalClasses}>
      <Video className='remote-video'
         mediaStream={props.remoteStream} onClick={ memoizedSwitchVideos }/>
      { props.localStream &&
        <Video className='local-video' mediaStream={props.localStream}/>
      }
      { props.presentationStream &&
        <Video className='presentation-video'
          mediaStream={props.presentationStream} onClick={ memoizedSwitchVideos }/>
      }
      <Toolbar
        className='toolbar'
        onAudioMute={props.onAudioMute}
        onVideoMute={props.onVideoMute}
        onScreenShare={async (share: boolean, onEnded: () => void) => {
          setPresentationInMain(false);
          await props.onScreenShare(share, onEnded);
        }}
        onDisconnect={props.onDisconnect}
      />
    </div>
  );
}

export default Conference;
