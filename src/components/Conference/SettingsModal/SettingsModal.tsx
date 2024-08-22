import { useEffect, useState } from 'react'
// TODO (31) Import new components from @pexip/components
import { Button, Modal, Video } from '@pexip/components'
import { type MediaDeviceInfoLike } from '@pexip/media-control'
import { type Settings } from '../../../types/Settings'
import { DevicesSelection } from '@pexip/media-components'
// TODO (32) Import Effect, VideoProcessor, getVideoProcessor and Loading

import './SettingsModal.css'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  devices: MediaDeviceInfoLike[]
  settings: Settings
  onSettingsChange: (settings: Settings) => Promise<void>
}

// TODO (33) Add the videoProcessor variable

export const SettingsModal = (props: SettingsModalProps): JSX.Element => {
  const [localStream, setLocalStream] = useState<MediaStream>()

  const [audioInput, setAudioInput] = useState<MediaDeviceInfoLike>()
  const [audioOutput, setAudioOutput] = useState<MediaDeviceInfoLike>()
  const [videoInput, setVideoInput] = useState<MediaDeviceInfoLike>()

  // TODO (34) Add the processedStream, loadedVideo and effect states

  const handleVideoInputChange = (device: MediaDeviceInfoLike): void => {
    if (device.deviceId !== videoInput?.deviceId) {
      setVideoInput(device)
      if (localStream != null) {
        localStream.getVideoTracks().forEach((track) => {
          track.stop()
        })
        navigator.mediaDevices
          .getUserMedia({
            video: { deviceId: device.deviceId }
          })
          .then((stream) => {
            setLocalStream(stream)
          })
          .catch(console.error)
      }
    }
  }

  // TODO (35) Add the handleEffectChange function

  const handleSave = (): void => {
    props
      .onSettingsChange({
        audioInput,
        audioOutput,
        videoInput
        // TODO (36) Add the effect property
      })
      .catch(console.error)
    props.onClose()
  }

  // TODO (37) Add getProcessedStream function

  useEffect(() => {
    const bootstrap = async (): Promise<void> => {
      if (props.isOpen) {
        setAudioInput(props.settings.audioInput)
        setAudioOutput(props.settings.audioOutput)
        setVideoInput(props.settings.videoInput)

        const localStream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: props.settings.videoInput?.deviceId }
        })
        setLocalStream(localStream)

        // TODO (38) Set the effect from the settings

        // TODO (39) Get the processedStream
        // TODO (40) Set the processedStream
      } else {
        localStream?.getTracks().forEach((track) => {
          track.stop()
        })
        setLocalStream(undefined)
      }
    }
    bootstrap().catch(console.error)
  }, [props.isOpen])

  return (
    <Modal
      isOpen={props.isOpen}
      onClose={props.onClose}
      className="SettingsModal"
      withCloseButton={true}
    >
      <h3 className="Title">Settings</h3>

      {/* TODO (41) Add Loading component to display when the video is loading */}

      {/* TODO (42) Only display the video when the processedStream is defined */}
      <Video
        srcObject={localStream}
        isMirrored={true}
        // TODO (43) Add onLoadedData and change loadedVideo state to true when triggered
        // TODO (44) Add style property to hide the video when it is not loaded
      />

      <div className="DeviceSelectionContainer">
        <h4>Select devices</h4>

        <DevicesSelection
          devices={props.devices}
          audioInput={audioInput}
          audioOutput={audioOutput}
          videoInput={videoInput}
          onAudioInputChange={setAudioInput}
          onAudioOutputChange={setAudioOutput}
          onVideoInputChange={handleVideoInputChange}
          setShowHelpVideo={() => {}}
          videoInputError={{
            title: '',
            description: undefined,
            deniedDevice: undefined
          }}
          audioInputError={{
            title: '',
            description: undefined,
            deniedDevice: undefined
          }}
        />
      </div>

      {/* TODO (45) Render container with buttons to change the effect */}

      <div className="ButtonSet">
        <Button variant="secondary" onClick={props.onClose}>
          Cancel
        </Button>
        <Button onClick={handleSave}>Save</Button>
      </div>
    </Modal>
  )
}
