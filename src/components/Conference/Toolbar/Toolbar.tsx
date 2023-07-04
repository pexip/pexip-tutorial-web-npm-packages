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
  onAudioMute: (mute: boolean) => void;
  onVideoMute: (mute: boolean) => void;
  onDisconnect: () => void;
}

function Toolbar(props: ToolbarProps) {

  const className = [props.className, "Toolbar"].join(" ");

  const [audioMuted, setAudioMuted] = useState(false);
  const [videoMuted, setVideoMuted] = useState(false);

  const handleAudioMute = () => {
    props.onAudioMute(!audioMuted);
    setAudioMuted(!audioMuted);
  };

  const handleVideoMute = async () => {
    props.onVideoMute(!videoMuted);
    setVideoMuted(!videoMuted);
  };

  const handleHangUp = () => {
    props.onDisconnect();
  };

  return (
    <div className={className}>
      <Button
        onClick={handleAudioMute}
        selected={audioMuted}
        icon={audioMuted ? <MicOffIcon /> : <MicIcon />}
      />
      <Button
        onClick={handleVideoMute}
        selected={videoMuted}
        icon={videoMuted ? <VideocamOffIcon /> : <VideocamIcon />}
      />
      <Button onClick={handleHangUp} icon={<CallEndIcon />} />
    </div>
  );
}

export default Toolbar;
