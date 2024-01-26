import './style.css'
import AgoraRTC from 'agora-rtc-sdk-ng'
import config from './config.js'
// CORE-SDK
import AgoraUIKit from 'agora-react-uikit';

const App = () => { 
  const rtcProps = {
    appId: 'e7f6e9aeecf14b2ba10e3f40be9f56e7', 
    channel: 'test', 
    token: null, // enter your channel token as a string 
  }; 
  return (
    <AgoraUIKit rtcProps={rtcProps} /> 
  ) 
};

export default App; 

let channelParams= {
  localAudioTrack:null,
  localVideoTrack:null,
  remoteAudioTrack:null,
  remoteVideoTrack:null,
  remoteuid:null,
};

const AgoraRTCManager = async(eventsCallback) => {
  let agoraEngine=null;

  const setupAgoraEngine =async () => {
    agoraEngine=new AgoraRTC.createClient({mode:"rtc",codec:"vp9"});
  };

  await setupAgoraEngine();

  const getAgoraEngine = () => {
    return agoraEngine;
  };
};

const join=async(localPlayerContainer,channelParams) => {
  await agoraEngine.join(
    config.appId,
    config.channelName,
    config.token,
    config.uid
  );

  channelParams.localAudioTrack=await AgoraRTC.createMicrophoneAudioTrack();
  channelParams.localVideoTrack=await AgoraRTC.createCameraVideoTrack();
  document.body.append(localPlayerContainer);

  await getAgoraEngine().publish([
    channelParams.localAudioTrack,
    channelParams.localVideoTrack,
  ]);

  channelParams.localVideoTrack.play(localPlayerContainer);
};

agoraEngine.on("user-published",async (user,mediaType) => {
  await agoraEngine.subscribe(user,mediaType);
  console.log("subscribe success");
  eventsCallback("user-published",user,mediaType);
});

agoraEngine.on("user-unpublished",(user) => {
  console.log(user.uid + "has left the channel");
});

const handleVSDKEvents= (eventName, ...args) => {
  switch( eventName)
  {
    case "user-published" :

    if(args[1]== "video")
    {
      channelParams.remoteVideoTrack=args[0].videoTrack;
      channelParams.remoteAudioTrack=args[0].audioTrack;
      channelParams.remoteuid=args[0].uid.toString();
      remotePlayerContainer.id=args[0].uid.toString();
    channelParams.remoteuid=args[0].uid.toString();
    remotePlayerContainer.textContent =
    "Remote User" + args[0].uid.toString();

    document.body.append(remotePlayerContainer);

    channelParams.remoteAudioTrack.play(remotePlayerContainer);
    }
    if(args[1]== "audio")
    {
      channelParams.remoteAudioTrack=args[0].audioTrack;
      channelParams.remoteAudioTrack.play();
    }
  }
};


const leave=async(channelParams) => {
  channelParams.localAudioTrack.close();
  channelParams.localVideoTrack.close();

  await agoraEngine.leave();
};