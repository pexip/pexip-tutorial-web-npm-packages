import { Video } from '@pexip/components'
import { Toolbar } from './Toolbar/Toolbar'

import './Conference.css'

interface ConferenceProps {
  localVideoStream: MediaStream | undefined
  remoteStream: MediaStream | undefined
  // TODO (05) Add onAudioMute prop
  // TODO (06) Add onVideoMute prop
  onDisconnect: () => Promise<void>
}

export const Conference = (props: ConferenceProps): JSX.Element => {
  return (
    <div className="Conference">
      <div className="VideoContainer">
        <Video className="remote-video" srcObject={props.remoteStream} />

        {/* TODO (07) Only render if props.localVideoStream != null */}
        <Video
          className="local-video"
          srcObject={props.localVideoStream}
          isMirrored={true}
        />

        <Toolbar
          className="toolbar"
          // TODO (08) Pass onAudioMute prop
          // TODO (09) Pass onVideoMute prop
          onDisconnect={props.onDisconnect}
        />
      </div>
    </div>
  )
}
