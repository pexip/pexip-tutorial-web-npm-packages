import { type MediaDeviceInfoLike } from '@pexip/media-control'

export interface Settings {
  audioInput: MediaDeviceInfoLike | undefined
  audioOutput: MediaDeviceInfoLike | undefined
  videoInput: MediaDeviceInfoLike | undefined
}
