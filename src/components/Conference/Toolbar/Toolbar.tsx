import React, { useState } from "react";

import Button from "./Button/Button";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import CallEndIcon from "@mui/icons-material/CallEnd";

import "./Toolbar.css";

interface ToolbarProps {
  className: string;
  // TODO (10) Add property onAudioMute
  // TODO (11) Add property onVideoMute
  onDisconnect: () => void;
}

function Toolbar(props: ToolbarProps) {

  const className = [props.className, "Toolbar"].join(" ");

  // TODO (12) Add state for audioMuted
  // TODO (13) Add state for videoMuted

  // TODO (14) Define function handleAudioMute

  // TODO (15) Define function handleVideoMute

  const handleHangUp = () => {
    props.onDisconnect();
  };

  return (
    <div className={className}>
      {/* TODO (16) Add button to mute the audio */}
      {/* TODO (17) Add button to mute the video */}
      <Button onClick={handleHangUp} icon={<CallEndIcon />} />
    </div>
  );
}

export default Toolbar;
