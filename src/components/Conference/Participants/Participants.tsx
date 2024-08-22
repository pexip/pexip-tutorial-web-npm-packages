import { Box, BoxHeader, Icon, IconTypes, Tooltip } from '@pexip/components'
import { type Participant } from '@pexip/infinity'

import './Participants.css'

interface ParticipantsProps {
  participants: Participant[]
  me: Participant | undefined
}

export const Participants = (props: ParticipantsProps): JSX.Element => {
  return (
    <Box className="Participants">
      <BoxHeader>Participants</BoxHeader>
      <div className="ParticipantsBody">
        <div className="ParticipantsInner">
          {props.participants.map((participant) => (
            <div className="Participant" key={participant.uuid}>
              <span
                className={
                  participant.uuid === props.me?.uuid ? 'selected' : ''
                }
              >
                {participant.displayName}
                {participant.uuid === props.me?.uuid && ' (You)'}
              </span>

              <span className="ParticipantStatus">
                {participant.isMuted && (
                  <Tooltip text="Microphone Muted">
                    <Icon source={IconTypes.IconMicrophoneOff} size="compact" />
                  </Tooltip>
                )}

                {participant.isCameraMuted && (
                  <Tooltip text="Camera Muted">
                    <Icon source={IconTypes.IconVideoOff} size="compact" />
                  </Tooltip>
                )}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Box>
  )
}
