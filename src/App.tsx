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
// TODO (05) Import MediaDeviceInfoLike, Settings and LocalStorageKey

import './App.css'

const infinityClientSignals = createInfinityClientSignals([])
const callSignals = createCallSignals([])

let infinityClient: InfinityClient

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

  // TODO (06) Add devices state

  // TODO (07) Add audioInput, audioOutput and videoInput states

  const handleStartConference = async (
    nodeDomain: string,
    conferenceAlias: string,
    displayName: string
  ): Promise<void> => {
    setNodeDomain(nodeDomain)
    setConferenceAlias(conferenceAlias)
    setDisplayName(displayName)
    setConnectionState(ConnectionState.Connecting)

    // TODO (08) Call refreshDevices to get the audioInput and videoInput devices

    const localAudioStream = await navigator.mediaDevices.getUserMedia({
      // TODO (09) Constraint the audio to a specific deviceId
      audio: true
    })
    const localVideoStream = await navigator.mediaDevices.getUserMedia({
      // TODO (10) Constraint the video to a specific deviceId
      video: true
    })

    setLocalAudioStream(localAudioStream)
    setLocalVideoStream(localVideoStream)

    const response = await infinityClient.call({
      callType: ClientCallType.AudioVideo,
      node: nodeDomain,
      conferenceAlias,
      displayName,
      bandwidth: 0,
      mediaStream: new MediaStream([
        ...localAudioStream.getTracks(),
        ...localVideoStream.getTracks()
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
        // TODO (11) Constraint the audio to a specific deviceId
        audio: true
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
    } else {
      const localVideoStream = await navigator.mediaDevices.getUserMedia({
        // TODO (12) Constraint the video to a specific deviceId
        video: true
      })

      setLocalVideoStream(localVideoStream)

      infinityClient.setStream(
        new MediaStream([
          ...(localAudioStream?.getTracks() ?? []),
          ...localVideoStream.getTracks()
        ])
      )
    }
    await infinityClient.muteVideo({ muteVideo: mute })
  }

  // TODO (13) Add handleSettingsChange function

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

  // TODO (14) Add refreshDevices function

  useEffect(() => {
    infinityClient = createInfinityClient(infinityClientSignals, callSignals)
  }, [error])

  useEffect(() => {
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

    // TODO (15) Add handleDeviceChange function

    window.addEventListener('beforeunload', disconnectBrowserClosed)
    // TODO (16) Add event listeners for devicechange to call handleDeviceChange
    return () => {
      window.removeEventListener('beforeunload', disconnectBrowserClosed)
      // TODO (17) Remove event listeners for devicechange
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
          localVideoStream={localVideoStream}
          remoteStream={remoteStream}
          // TODO (18) Add devices prop
          // TODO (19) Add settings prop
          onAudioMute={handleAudioMute}
          onVideoMute={handleVideoMute}
          // TODO (20) Add onSettingsChange prop
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

// TODO (21) Add getMediaDeviceInfo function
