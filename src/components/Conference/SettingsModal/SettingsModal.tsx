import { useEffect, useState } from 'react'
import { Button, Modal, Video } from '@pexip/components'
import { type MediaDeviceInfoLike } from '@pexip/media-control'
import { type Settings } from '../../../types/Settings'
import { DevicesSelection } from '@pexip/media-components'

import './SettingsModal.css'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  devices: MediaDeviceInfoLike[]
  settings: Settings
  onSettingsChange: (settings: Settings) => Promise<void>
}

export const SettingsModal = (props: SettingsModalProps): JSX.Element => {
  const [localStream, setLocalStream] = useState<MediaStream>()

  const [audioInput, setAudioInput] = useState<MediaDeviceInfoLike>()
  const [audioOutput, setAudioOutput] = useState<MediaDeviceInfoLike>()
  const [videoInput, setVideoInput] = useState<MediaDeviceInfoLike>()

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

  const handleSave = (): void => {
    props
      .onSettingsChange({
        audioInput,
        audioOutput,
        videoInput
      })
      .catch(console.error)
    props.onClose()
  }

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

      <Video srcObject={localStream} isMirrored={true} />

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

      <div className="ButtonSet">
        <Button variant="secondary" onClick={props.onClose}>
          Cancel
        </Button>
        <Button onClick={handleSave}>Save</Button>
      </div>
    </Modal>
  )
}
