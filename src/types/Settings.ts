import { type MediaDeviceInfoLike } from '@pexip/media-control'
// TODO (02) Import Effect type

export interface Settings {
  audioInput: MediaDeviceInfoLike | undefined
  audioOutput: MediaDeviceInfoLike | undefined
  videoInput: MediaDeviceInfoLike | undefined
  // TODO (03) Add effect property
}
