import { useEffect, useState } from 'react'
import {
  ClientCallType,
  createCallSignals,
  createInfinityClient,
  createInfinityClientSignals,
  type InfinityClient
} from '@pexip/infinity'
import { Loading } from './components/Loading/Loading'
import { Conference } from './components/Conference/Conference'
import { Error } from './components/Error/Error'
import { Preflight } from './components/Preflight/Preflight'
import { Pin } from './components/Pin/Pin'
import { type MediaDeviceInfoLike } from '@pexip/media-control'
import { type Settings } from './types/Settings'
import { LocalStorageKey } from './types/LocalStorageKey'
import { Effect } from './types/Effect'
import { type VideoProcessor } from '@pexip/media-processor'
import { getVideoProcessor } from './utils/video-processor'

import './App.css'

const infinityClientSignals = createInfinityClientSignals([])
const callSignals = createCallSignals([])

let infinityClient: InfinityClient

let videoProcessor: VideoProcessor

enum ConnectionState {
  Disconnected,
  Connecting,
  Connected,
  PinRequired,
  PinOptional,
  Error
}

export const App = (): JSX.Element => {
  const [connectionState, setConnectionState] = useState<ConnectionState>(
    ConnectionState.Disconnected
  )

  const [localAudioStream, setLocalAudioStream] = useState<MediaStream>()
  const [localVideoStream, setLocalVideoStream] = useState<MediaStream>()
  const [remoteStream, setRemoteStream] = useState<MediaStream>()

  const [error, setError] = useState('')

  const [nodeDomain, setNodeDomain] = useState<string>('')
  const [conferenceAlias, setConferenceAlias] = useState<string>('')
  const [displayName, setDisplayName] = useState<string>('')

  const [devices, setDevices] = useState<MediaDeviceInfoLike[]>([])

  const [audioInput, setAudioInput] = useState<MediaDeviceInfoLike>()
  const [audioOutput, setAudioOutput] = useState<MediaDeviceInfoLike>()
  const [videoInput, setVideoInput] = useState<MediaDeviceInfoLike>()

  const [processedStream, setProcessedStream] = useState<MediaStream>()
  const [effect, setEffect] = useState<Effect>(
    (localStorage.getItem(LocalStorageKey.Effect) as Effect) ?? Effect.None
  )

  const [presentationStream, setPresentationStream] = useState<MediaStream>()

  const handleStartConference = async (
    nodeDomain: string,
    conferenceAlias: string,
    displayName: string
  ): Promise<void> => {
    setNodeDomain(nodeDomain)
    setConferenceAlias(conferenceAlias)
    setDisplayName(displayName)
    setConnectionState(ConnectionState.Connecting)

    const { audioInput, videoInput } = await refreshDevices()

    const localAudioStream = await navigator.mediaDevices.getUserMedia({
      audio: { deviceId: audioInput?.deviceId }
    })
    const localVideoStream = await navigator.mediaDevices.getUserMedia({
      video: { deviceId: videoInput?.deviceId }
    })

    setLocalAudioStream(localAudioStream)
    setLocalVideoStream(localVideoStream)

    const processedStream = await getProcessedStream(localVideoStream, effect)
    setProcessedStream(processedStream)

    const response = await infinityClient.call({
      callType: ClientCallType.AudioVideo,
      node: nodeDomain,
      conferenceAlias,
      displayName,
      bandwidth: 0,
      mediaStream: new MediaStream([
        ...localAudioStream.getTracks(),
        ...processedStream.getTracks()
      ])
    })

    if (response != null) {
      if (response.status !== 200) {
        localAudioStream.getTracks().forEach((track) => {
          track.stop()
        })
        localVideoStream.getTracks().forEach((track) => {
          track.stop()
        })
        setLocalAudioStream(undefined)
        setLocalVideoStream(undefined)
        setProcessedStream(undefined)
      }

      switch (response.status) {
        case 200:
          setConnectionState(ConnectionState.Connected)
          break
        case 403: {
          console.warn('The conference is protected by PIN')
          break
        }
        case 404: {
          setConnectionState(ConnectionState.Error)
          setError("The conference doesn't exist")
          break
        }
        default: {
          setConnectionState(ConnectionState.Error)
          setError('Internal error')
          break
        }
      }
    } else {
      setConnectionState(ConnectionState.Error)
      setError("The server isn't available")
    }
  }

  const handleSetPin = async (pin: string): Promise<void> => {
    const currentPin = pin !== '' ? pin : 'none'
    infinityClient.setPin(currentPin)
    setConnectionState(ConnectionState.Connecting)
    await handleStartConference(nodeDomain, conferenceAlias, displayName)
  }

  const handleAudioMute = async (mute: boolean): Promise<void> => {
    if (mute) {
      localAudioStream?.getTracks().forEach((track) => {
        track.stop()
      })
      setLocalAudioStream(undefined)
    } else {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { deviceId: audioInput?.deviceId }
      })
      setLocalAudioStream(stream)
    }
    await infinityClient.mute({ mute })
  }

  const handleVideoMute = async (mute: boolean): Promise<void> => {
    if (mute) {
      localVideoStream?.getTracks().forEach((track) => {
        track.stop()
      })
      setLocalVideoStream(undefined)
      setProcessedStream(undefined)
    } else {
      const localVideoStream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: videoInput?.deviceId }
      })

      setLocalVideoStream(localVideoStream)

      const processedStream = await getProcessedStream(localVideoStream, effect)
      setProcessedStream(processedStream)

      infinityClient.setStream(
        new MediaStream([
          ...(localAudioStream?.getTracks() ?? []),
          ...processedStream.getTracks()
        ])
      )
    }
    await infinityClient.muteVideo({ muteVideo: mute })
  }

  const handleSettingsChange = async (settings: Settings): Promise<void> => {
    let newAudioStream: MediaStream | null = null
    let newVideoStream: MediaStream | null = null
    let newProcessedStream: MediaStream | null = null

    // Get the new audio stream if the audio input has changed
    if (settings.audioInput !== audioInput) {
      localAudioStream?.getTracks().forEach((track) => {
        track.stop()
      })

      setAudioInput(settings.audioInput)
      localStorage.setItem(
        LocalStorageKey.AudioInput,
        JSON.stringify(settings.audioInput)
      )

      newAudioStream = await navigator.mediaDevices.getUserMedia({
        audio: { deviceId: settings.audioInput?.deviceId }
      })
      setLocalAudioStream(newAudioStream)
    }

    // Get the new video stream if the video input has changed
    if (settings.videoInput !== videoInput) {
      localVideoStream?.getTracks().forEach((track) => {
        track.stop()
      })

      setVideoInput(settings.videoInput)
      localStorage.setItem(
        LocalStorageKey.VideoInput,
        JSON.stringify(settings.videoInput)
      )

      newVideoStream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: settings.videoInput?.deviceId }
      })
      setLocalVideoStream(newVideoStream)

      newProcessedStream = await getProcessedStream(
        newVideoStream,
        settings.effect
      )
      setProcessedStream(newProcessedStream)
    }

    // Set the new effect if it has changed
    if (settings.effect !== effect) {
      setEffect(settings.effect)
      localStorage.setItem(LocalStorageKey.Effect, settings.effect)

      // Get the new processed stream if the effect has changed
      if (settings.videoInput === videoInput && localVideoStream != null) {
        newProcessedStream = await getProcessedStream(
          localVideoStream,
          settings.effect
        )
        setProcessedStream(newProcessedStream)
      }
    }

    // Send the new audio and video stream to Pexip Infinity
    if (newAudioStream != null || newProcessedStream != null) {
      infinityClient.setStream(
        new MediaStream([
          ...(newAudioStream?.getTracks() ??
            localAudioStream?.getTracks() ??
            []),
          ...(newProcessedStream?.getTracks() ??
            processedStream?.getTracks() ??
            [])
        ])
      )
    }

    // Change the speaker if the audio output has changed
    if (settings.audioOutput !== audioOutput) {
      setAudioOutput(settings.audioOutput)
      localStorage.setItem(
        LocalStorageKey.AudioOutput,
        JSON.stringify(settings.audioOutput)
      )
    }
  }

  const handleDisconnect = async (): Promise<void> => {
    localAudioStream?.getTracks().forEach((track) => {
      track.stop()
    })
    localVideoStream?.getTracks().forEach((track) => {
      track.stop()
    })
    await infinityClient.disconnect({ reason: 'User initiated disconnect' })
    setConnectionState(ConnectionState.Disconnected)
  }

  const refreshDevices = async (): Promise<Settings> => {
    const devices = await navigator.mediaDevices.enumerateDevices()
    setDevices(devices)

    const audioInput = getMediaDeviceInfo(devices, 'audioinput')
    setAudioInput(audioInput)

    const audioOutput = getMediaDeviceInfo(devices, 'audiooutput')
    setAudioOutput(audioOutput)

    const videoInput = getMediaDeviceInfo(devices, 'videoinput')
    setVideoInput(videoInput)

    return {
      audioInput,
      audioOutput,
      videoInput,
      effect
    }
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
    infinityClient = createInfinityClient(infinityClientSignals, callSignals)
  }, [error])

  useEffect(() => {
    callSignals.onRemotePresentationStream.add((stream) => {
      setPresentationStream(stream)
    })

    callSignals.onRemoteStream.add((stream) => {
      setRemoteStream(stream)
    })

    infinityClientSignals.onError.add((error) => {
      setConnectionState(ConnectionState.Error)
      setError(error.error)
    })

    infinityClientSignals.onDisconnected.add(() => {
      setConnectionState(ConnectionState.Disconnected)
    })

    infinityClientSignals.onPinRequired.add(({ hasHostPin, hasGuestPin }) => {
      if (hasHostPin && hasGuestPin) {
        setConnectionState(ConnectionState.PinRequired)
      } else {
        setConnectionState(ConnectionState.PinOptional)
      }
    })

    const disconnectBrowserClosed = (): void => {
      infinityClient
        .disconnect({ reason: 'Browser closed' })
        .catch(console.error)
    }

    const handleDeviceChange = (): void => {
      refreshDevices().catch(console.error)
    }

    window.addEventListener('beforeunload', disconnectBrowserClosed)
    window.addEventListener('devicechange', handleDeviceChange)
    return () => {
      window.removeEventListener('beforeunload', disconnectBrowserClosed)
      window.removeEventListener('devicechange', handleDeviceChange)
    }
  }, [])

  let component
  switch (connectionState) {
    case ConnectionState.PinRequired:
      component = <Pin onSubmit={handleSetPin} required={true} />
      break
    case ConnectionState.PinOptional:
      component = <Pin onSubmit={handleSetPin} required={false} />
      break
    case ConnectionState.Connecting:
      component = <Loading />
      break
    case ConnectionState.Connected:
      component = (
        <Conference
          localVideoStream={processedStream}
          remoteStream={remoteStream}
          presentationStream={presentationStream}
          devices={devices}
          settings={{
            audioInput,
            audioOutput,
            videoInput,
            effect
          }}
          onAudioMute={handleAudioMute}
          onVideoMute={handleVideoMute}
          onSettingsChange={handleSettingsChange}
          onDisconnect={handleDisconnect}
        />
      )
      break
    case ConnectionState.Error:
      component = (
        <Error
          message={error}
          onClose={() => {
            setConnectionState(ConnectionState.Disconnected)
          }}
        />
      )
      break
    default:
      component = <Preflight onSubmit={handleStartConference} />
      break
  }

  return <div className="App">{component}</div>
}

const getMediaDeviceInfo = (
  devices: MediaDeviceInfoLike[],
  kind: MediaDeviceKind
): MediaDeviceInfoLike | undefined => {
  let storageKey: string

  switch (kind) {
    case 'audioinput': {
      storageKey = LocalStorageKey.AudioInput
      break
    }
    case 'audiooutput': {
      storageKey = LocalStorageKey.AudioOutput
      break
    }
    case 'videoinput': {
      storageKey = LocalStorageKey.VideoInput
      break
    }
  }

  const mediaDeviceStored = localStorage.getItem(storageKey)

  let mediaDeviceInfo: MediaDeviceInfoLike | undefined

  if (mediaDeviceStored != null) {
    mediaDeviceInfo = JSON.parse(mediaDeviceStored) as MediaDeviceInfo
    const found = devices.some(
      (device) => device.deviceId === mediaDeviceInfo?.deviceId
    )
    if (!found) {
      mediaDeviceInfo = devices.find((device) => device.kind === kind)
    }
  } else {
    mediaDeviceInfo = devices.find((device) => device.kind === kind)
  }
  return mediaDeviceInfo
}
