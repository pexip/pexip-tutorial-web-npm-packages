import { useEffect, useState } from 'react'
import { Box, Button, Icon, IconTypes, Modal, Video } from '@pexip/components'
import { type MediaDeviceInfoLike } from '@pexip/media-control'
import { type Settings } from '../../../types/Settings'
import { DevicesSelection } from '@pexip/media-components'
import { Effect } from '../../../types/Effect'
import { type VideoProcessor } from '@pexip/media-processor'
import { getVideoProcessor } from '../../../utils/video-processor'
import { Loading } from '../../Loading/Loading'

import './SettingsModal.css'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  devices: MediaDeviceInfoLike[]
  settings: Settings
  onSettingsChange: (settings: Settings) => Promise<void>
}

let videoProcessor: VideoProcessor

export const SettingsModal = (props: SettingsModalProps): JSX.Element => {
  const [localStream, setLocalStream] = useState<MediaStream>()

  const [audioInput, setAudioInput] = useState<MediaDeviceInfoLike>()
  const [audioOutput, setAudioOutput] = useState<MediaDeviceInfoLike>()
  const [videoInput, setVideoInput] = useState<MediaDeviceInfoLike>()

  const [processedStream, setProcessedStream] = useState<MediaStream>()
  const [loadedVideo, setLoadedVideo] = useState(false)
  const [effect, setEffect] = useState<Effect>(Effect.None)

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

  const handleEffectChange = (effect: Effect): void => {
    setEffect(effect)
    if (localStream != null) {
      setLoadedVideo(false)
      getProcessedStream(localStream, effect)
        .then((stream) => {
          setProcessedStream(stream)
        })
        .catch(console.error)
    }
  }

  const handleSave = (): void => {
    props
      .onSettingsChange({
        audioInput,
        audioOutput,
        videoInput,
        effect
      })
      .catch(console.error)
    props.onClose()
  }

  const getProcessedStream = async (
    localVideoStream: MediaStream,
    effect: Effect
  ): Promise<MediaStream> => {
    if (videoProcessor != null) {
      videoProcessor.close()
      videoProcessor.destroy().catch(console.error)
    }
    videoProcessor = await getVideoProcessor(effect)
    const processedStream = await videoProcessor.process(localVideoStream)
    return processedStream
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

        setEffect(props.settings.effect)

        const processedStream = await getProcessedStream(
          localStream,
          props.settings.effect
        )
        setProcessedStream(processedStream)
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

      {!loadedVideo && (
        <Box className="LoadingVideoPlaceholder">
          <Loading />
        </Box>
      )}
      {processedStream != null && (
        <Video
          srcObject={processedStream}
          isMirrored={true}
          onLoadedData={() => {
            setLoadedVideo(true)
          }}
          style={{ display: loadedVideo ? 'block' : 'none' }}
        />
      )}

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

      <div className="EffectSelectionContainer">
        <h4>Select effect</h4>

        <div className="ButtonSet">
          <Button
            variant="bordered"
            size="large"
            isActive={effect === Effect.None}
            onClick={() => {
              handleEffectChange(Effect.None)
            }}
          >
            <div className="ButtonInner">
              <Icon source={IconTypes.IconBlock} />
              <p>None</p>
            </div>
          </Button>

          <Button
            variant="bordered"
            size="large"
            isActive={effect === Effect.Blur}
            onClick={() => {
              handleEffectChange(Effect.Blur)
            }}
          >
            <div className="ButtonInner">
              <Icon source={IconTypes.IconBackgroundBlur} />
              <p>Blur</p>
            </div>
          </Button>

          <Button
            variant="bordered"
            size="large"
            isActive={effect === Effect.Overlay}
            onClick={() => {
              handleEffectChange(Effect.Overlay)
            }}
          >
            <div className="ButtonInner">
              <Icon source={IconTypes.IconMeetingRoom} />
              <p>Background</p>
            </div>
          </Button>
        </div>
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
