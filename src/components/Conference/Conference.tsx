import React, { useEffect, useState } from 'react';
import Toolbar from './Toolbar/Toolbar';

import './Conference.css';

// TODO (12) Define the props for the Video component

// TODO (13) Define the Video component

interface ConferenceProps {
  // TODO (14) Define the props for the Conference (localStream, remoteStream and onDisconnect)
}

function Conference(props: ConferenceProps) {
  return (
    <div className='Conference'>
      {/* TODO (15) Render the remote video */}
      {/* TODO (16) Render the local video */}
      {/* TODO (17) Render the toolbar */}
    </div>
  );
}

export default Conference;
