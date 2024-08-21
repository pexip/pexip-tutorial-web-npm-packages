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

  const handleStartConference = async (
    nodeDomain: string,
    conferenceAlias: string,
    displayName: string
  ): Promise<void> => {
    setNodeDomain(nodeDomain)
    setConferenceAlias(conferenceAlias)
    setDisplayName(displayName)
    setConnectionState(ConnectionState.Connecting)

    const localAudioStream = await navigator.mediaDevices.getUserMedia({
      audio: true
    })
    const localVideoStream = await navigator.mediaDevices.getUserMedia({
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

    window.addEventListener('beforeunload', disconnectBrowserClosed)
    return () => {
      window.removeEventListener('beforeunload', disconnectBrowserClosed)
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
