import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'
import AgoraRTC from 'agora-rtc-sdk-ng'
import config from './config.js'

let channelParams= {
  localAudioTrack:null,
  localVideoTrack:null,
  remoteAudioTrack:null,
  remoteVideoTrack:null,
  remoteuid:null,
}