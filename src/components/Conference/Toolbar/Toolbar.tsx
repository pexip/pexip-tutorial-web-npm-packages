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
  onDisconnect: () => void;
}

function Toolbar(props: ToolbarProps) {

  const className = [props.className, "Toolbar"].join(" ");

  const handleHangUp = () => {
    props.onDisconnect();
  };

  return (
    <div className={className}>
      <Button onClick={handleHangUp} icon={<CallEndIcon />} />
    </div>
  );
}

export default Toolbar;
