// TODO (04) Add useEffect to the react importation
import { useState } from 'react'
import { type MediaDeviceInfoLike } from '@pexip/media-control'
import { type Settings } from '../../types/Settings'
import { SettingsModal } from './SettingsModal/SettingsModal'
import { Video } from '@pexip/components'
import { Toolbar } from './Toolbar/Toolbar'

import './Conference.css'

interface ConferenceProps {
  localVideoStream: MediaStream | undefined
  remoteStream: MediaStream | undefined
  // TODO (05) Add presentationStream to the props
  devices: MediaDeviceInfoLike[]
  settings: Settings
  onAudioMute: (mute: boolean) => Promise<void>
  onVideoMute: (mute: boolean) => Promise<void>
  onSettingsChange: (settings: Settings) => Promise<void>
  onDisconnect: () => Promise<void>
}

export const Conference = (props: ConferenceProps): JSX.Element => {
  const [settingsOpened, setSettingsOpened] = useState(false)

  // TODO (06) Add presentationInMain state

  // TODO (07) Add switchVideos function

  // TODO (08) Use useEffect when props.presentationStream changes

  // TODO (09) Add additionalClasses constant

  return (
    // TODO (10) Add additionalClasses to the className
    <div className="Conference">
      <div className="VideoContainer">
        <Video
          className="remote-video"
          srcObject={props.remoteStream}
          // TODO (11) Add onClick prop to call switchVideos
        />

        {props.localVideoStream != null && (
          <Video
            className="local-video"
            srcObject={props.localVideoStream}
            isMirrored={true}
          />
        )}

        {/* TODO (12) Add Video component to display the presentationStream */}

        <Toolbar
          className="toolbar"
          settingsOpened={settingsOpened}
          onAudioMute={props.onAudioMute}
          onVideoMute={props.onVideoMute}
          onOpenSettings={() => {
            setSettingsOpened(true)
          }}
          onDisconnect={props.onDisconnect}
        />

        <SettingsModal
          isOpen={settingsOpened}
          onClose={() => {
            setSettingsOpened(false)
          }}
          devices={props.devices}
          settings={props.settings}
          onSettingsChange={props.onSettingsChange}
        />
      </div>
    </div>
  )
}
