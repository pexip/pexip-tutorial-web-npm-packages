import { useState } from 'react'
import { Button, Icon, IconTypes, Tooltip } from '@pexip/components'

import './Toolbar.css'

interface ToolbarProps {
  className: string
  // TODO (39) Add settingsOpened property
  onAudioMute: (mute: boolean) => Promise<void>
  onVideoMute: (mute: boolean) => Promise<void>
  // TODO (40) Add onOpenSettings property
  onDisconnect: () => Promise<void>
}

export const Toolbar = (props: ToolbarProps): JSX.Element => {
  const className = [props.className, 'Toolbar'].join(' ')

  const [audioMuted, setAudioMuted] = useState(false)
  const [videoMuted, setVideoMuted] = useState(false)

  const [processingAudioMute, setProcessingAudioMute] = useState(false)
  const [processingVideoMute, setProcessingVideoMute] = useState(false)

  const handleAudioMute = async (): Promise<void> => {
    setProcessingAudioMute(true)
    await props.onAudioMute(!audioMuted)
    setAudioMuted(!audioMuted)
    setProcessingAudioMute(false)
  }

  const handleVideoMute = async (): Promise<void> => {
    setProcessingVideoMute(true)
    await props.onVideoMute(!videoMuted)
    setVideoMuted(!videoMuted)
    setProcessingVideoMute(false)
  }

  const handleHangUp = async (): Promise<void> => {
    await props.onDisconnect()
  }

  return (
    <div className={className}>
      <Tooltip text={`${audioMuted ? 'Unmute' : 'Mute'} audio`}>
        <Button
          onClick={() => {
            handleAudioMute().catch(console.error)
          }}
          variant="translucent"
          modifier="square"
          isActive={!audioMuted}
          colorScheme="light"
          disabled={processingAudioMute}
        >
          <Icon
            source={
              audioMuted
                ? IconTypes.IconMicrophoneOff
                : IconTypes.IconMicrophoneOn
            }
          />
        </Button>
      </Tooltip>

      <Tooltip text={`${videoMuted ? 'Unmute' : 'Mute'} video`}>
        <Button
          onClick={() => {
            handleVideoMute().catch(console.error)
          }}
          variant="translucent"
          modifier="square"
          isActive={!videoMuted}
          colorScheme="light"
          disabled={processingVideoMute}
        >
          <Icon
            source={videoMuted ? IconTypes.IconVideoOff : IconTypes.IconVideoOn}
          />
        </Button>
      </Tooltip>

      {/* TODO (41) Add button to display the settings panel */}

      <Tooltip text="Disconnect">
        <Button
          onClick={() => {
            handleHangUp().catch(console.error)
          }}
          variant="danger"
          modifier="square"
          colorScheme="light"
        >
          <Icon source={IconTypes.IconPhoneHorisontal} />
        </Button>
      </Tooltip>
    </div>
  )
}
