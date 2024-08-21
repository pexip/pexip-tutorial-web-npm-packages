import { Video } from '@pexip/components'
import { Toolbar } from './Toolbar/Toolbar'

import './Conference.css'

interface ConferenceProps {
  localVideoStream: MediaStream | undefined
  remoteStream: MediaStream | undefined
  onDisconnect: () => Promise<void>
}

export const Conference = (props: ConferenceProps): JSX.Element => {
  return (
    <div className="Conference">
      <div className="VideoContainer">
        <Video className="remote-video" srcObject={props.remoteStream} />

        <Video
          className="local-video"
          srcObject={props.localVideoStream}
          isMirrored={true}
        />

        <Toolbar className="toolbar" onDisconnect={props.onDisconnect} />
      </div>
    </div>
  )
}
