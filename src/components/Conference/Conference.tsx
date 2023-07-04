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
  // TODO (04) Add the property presentationSteam
  onAudioMute: (mute: boolean) => void;
  onVideoMute: (mute: boolean) => void;
  onDisconnect: () => void;
}

function Conference(props: ConferenceProps) {

  // TODO (05) Define the state presentationInMain

  // TODO (06) Create the function switchVideos
  // TODO (07) Use the useCallback hook over the switchVideo function

  // TODO (08) Define the additional classes for the conference component

  // TODO (10) Use the useEffect hook to reset presentationInMain when the presentation is disabled

  return (
    // TODO (09) Add additionalClasses to the className
    <div className='Conference'>
      {/* TODO (11) Add onClick attribute to the video with memoizedSwitchVideos */}
      <Video className='remote-video'
         mediaStream={props.remoteStream}/>
      { props.localStream &&
        <Video className='local-video' mediaStream={props.localStream}/>
      }
      {/* TODO (12) Add the Video HTML video for presentationStream */}
      <Toolbar
        className='toolbar'
        onAudioMute={props.onAudioMute}
        onVideoMute={props.onVideoMute}
        onDisconnect={props.onDisconnect}
      />
    </div>
  );
}

export default Conference;
