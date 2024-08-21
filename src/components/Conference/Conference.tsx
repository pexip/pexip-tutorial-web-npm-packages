// TODO (22) Import useState, MediaDeviceInfoLike, Settings and SettingsModal
import { Video } from '@pexip/components'
import { Toolbar } from './Toolbar/Toolbar'

import './Conference.css'

interface ConferenceProps {
  localVideoStream: MediaStream | undefined
  remoteStream: MediaStream | undefined
  // TODO (23) Add devices property
  // TODO (24) Add settings property
  onAudioMute: (mute: boolean) => Promise<void>
  onVideoMute: (mute: boolean) => Promise<void>
  // TODO (25) Add onSettingsChange property
  onDisconnect: () => Promise<void>
}

export const Conference = (props: ConferenceProps): JSX.Element => {
  // TODO (26) Add settingsOpened state

  return (
    <div className="Conference">
      <div className="VideoContainer">
        <Video className="remote-video" srcObject={props.remoteStream} />

        {props.localVideoStream != null && (
          <Video
            className="local-video"
            srcObject={props.localVideoStream}
            isMirrored={true}
          />
        )}

        <Toolbar
          className="toolbar"
          // TODO (27) Pass settingsOpened state
          onAudioMute={props.onAudioMute}
          onVideoMute={props.onVideoMute}
          // TODO (28) Define onOpenSettings property
          onDisconnect={props.onDisconnect}
        />

        {/* TODO (29) Render SettingsModal */}
      </div>
    </div>
  )
}
