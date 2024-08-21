import { Video } from '@pexip/components'
import { Toolbar } from './Toolbar/Toolbar'

import './Conference.css'

interface ConferenceProps {
  localVideoStream: MediaStream | undefined
  remoteStream: MediaStream | undefined
  onAudioMute: (mute: boolean) => Promise<void>
  onVideoMute: (mute: boolean) => Promise<void>
  onDisconnect: () => Promise<void>
}

export const Conference = (props: ConferenceProps): JSX.Element => {
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
          onAudioMute={props.onAudioMute}
          onVideoMute={props.onVideoMute}
          onDisconnect={props.onDisconnect}
        />
      </div>
    </div>
  )
}
