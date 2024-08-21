// TODO (10) Import useState from react
import { Button, Icon, IconTypes, Tooltip } from '@pexip/components'

import './Toolbar.css'

interface ToolbarProps {
  className: string
  // TODO (11) Add onAudioMute prop
  // TODO (12) Add onVideoMute prop
  onDisconnect: () => Promise<void>
}

export const Toolbar = (props: ToolbarProps): JSX.Element => {
  const className = [props.className, 'Toolbar'].join(' ')

  // TODO (13) Add audioMuted and videoMuted states

  // TODO (14) Add processingAudioMuted and processingVideoMuted states

  // TODO (15) Add handleAudioMute function

  // TODO (16) Add handleVideoMute function

  const handleHangUp = async (): Promise<void> => {
    await props.onDisconnect()
  }

  return (
    <div className={className}>
      {/* TODO (17) Add audio mute button */}
      {/* TODO (18) Add video mute button */}
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
