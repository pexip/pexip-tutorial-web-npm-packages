import { useState } from 'react'
import { Button, Icon, IconTypes, Tooltip } from '@pexip/components'

import './Toolbar.css'

interface ToolbarProps {
  className: string
  settingsOpened: boolean
  // TODO (16) Add screenShared property
  onAudioMute: (mute: boolean) => Promise<void>
  onVideoMute: (mute: boolean) => Promise<void>
  // TODO (17) Add onScreenShare property
  onOpenSettings: () => void
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

  // TODO (18) Add handleScreenShare function

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

      {/* TODO (19) Add screen share button */}

      <Tooltip text={'Settings'}>
        <Button
          onClick={() => {
            props.onOpenSettings()
          }}
          variant="translucent"
          modifier="square"
          isActive={!props.settingsOpened}
          colorScheme="light"
        >
          <Icon source={IconTypes.IconSettings} />
        </Button>
      </Tooltip>

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
