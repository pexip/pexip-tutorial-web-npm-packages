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
  // TODO (05) Add property onAudioMute
  // TODO (06) Add property onVideoMute
  onDisconnect: () => void;
}

function Conference(props: ConferenceProps) {
  return (
    <div className='Conference'>
      <Video className='remote-video'
         mediaStream={props.remoteStream}/>
      {/* TODO (07) Replace the following line and check if localStream exists before render it */}
      <Video className='local-video' mediaStream={props.localStream} muted={true}/>
      <Toolbar
        className='toolbar'
        // TODO (08) Add property onAudioMute
        // TODO (09) Add property onVideoMute
        onDisconnect={props.onDisconnect}
      />
    </div>
  );
}

export default Conference;
