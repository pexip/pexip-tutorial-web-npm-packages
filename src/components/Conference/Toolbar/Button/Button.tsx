import React from 'react';

import './Button.css'

interface ButtonProps {
  icon: any;
  onClick: () => void;
  selected?: boolean;
}

function Button (props: ButtonProps) {
  const className = ['Button', props.selected ? 'selected' : ''].filter(Boolean).join(' ')

  return <button className={className} onClick={props.onClick}>
    {props.icon}
  </button>;
}

export default Button;
