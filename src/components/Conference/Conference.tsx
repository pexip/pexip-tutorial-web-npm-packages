import { useEffect, useState } from 'react'
import { type MediaDeviceInfoLike } from '@pexip/media-control'
import { type Settings } from '../../types/Settings'
import { SettingsModal } from './SettingsModal/SettingsModal'
import { Video } from '@pexip/components'
import { Toolbar } from './Toolbar/Toolbar'
import { type Participant } from '@pexip/infinity'
import { Participants } from './Participants/Participants'

import './Conference.css'

interface ConferenceProps {
  localVideoStream: MediaStream | undefined
  remoteStream: MediaStream | undefined
  presentationStream: MediaStream | undefined
  screenShared: boolean
  devices: MediaDeviceInfoLike[]
  settings: Settings
  participants: Participant[]
  me: Participant | undefined
  onAudioMute: (mute: boolean) => Promise<void>
  onVideoMute: (mute: boolean) => Promise<void>
  onScreenShare: () => Promise<void>
  onSettingsChange: (settings: Settings) => Promise<void>
  onDisconnect: () => Promise<void>
}

export const Conference = (props: ConferenceProps): JSX.Element => {
  const [settingsOpened, setSettingsOpened] = useState(false)

  const [presentationInMain, setPresentationInMain] = useState(true)

  const switchVideos = (event: React.MouseEvent<HTMLVideoElement>): void => {
    if (event.target instanceof HTMLVideoElement) {
      if (event.target.classList.contains('presentation-video')) {
        setPresentationInMain(true)
      } else {
        setPresentationInMain(false)
      }
    }
  }

  const additionalClasses =
    presentationInMain && props.presentationStream != null
      ? ' presentation-in-main'
      : ''

  useEffect(() => {
    if (props.presentationStream == null) {
      setPresentationInMain(true)
    }
  }, [props.presentationStream])

  return (
    <div className={'Conference' + additionalClasses}>
      <Participants participants={props.participants} me={props.me} />

      <div className="VideoContainer">
        <Video
          className="remote-video"
          srcObject={props.remoteStream}
          onClick={switchVideos}
        />

        {props.localVideoStream != null && (
          <Video
            className="local-video"
            srcObject={props.localVideoStream}
            isMirrored={true}
          />
        )}

        {props.presentationStream != null && (
          <Video
            className="presentation-video"
            srcObject={props.presentationStream}
            onClick={switchVideos}
          />
        )}

        <Toolbar
          className="toolbar"
          settingsOpened={settingsOpened}
          screenShared={props.screenShared}
          onAudioMute={props.onAudioMute}
          onVideoMute={props.onVideoMute}
          onScreenShare={async () => {
            await props.onScreenShare()
            setPresentationInMain(false)
          }}
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
