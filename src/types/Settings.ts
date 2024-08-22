import { type MediaDeviceInfoLike } from '@pexip/media-control'
import { type Effect } from './Effect'

export interface Settings {
  audioInput: MediaDeviceInfoLike | undefined
  audioOutput: MediaDeviceInfoLike | undefined
  videoInput: MediaDeviceInfoLike | undefined
  effect: Effect
}
