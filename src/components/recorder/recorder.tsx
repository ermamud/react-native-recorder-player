import React, {useEffect, useState} from 'react';
import AudioRecorderPlayer, {
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AudioEncoderAndroidType,
  AudioSet,
  AudioSourceAndroidType,
} from 'react-native-audio-recorder-player';
import {Button, Card, Divider, Title} from 'react-native-paper';

export const Recorder = () => {
  const [audioRecorderPlayer] = useState(new AudioRecorderPlayer());
  const [settings, setSettings] = useState({
    isLoggingIn: false,
    recordSecs: 0,
    recordTime: '00:00:00',
    currentPositionSec: 0,
    currentDurationSec: 0,
    playTime: '00:00:00',
    duration: '00:00:00',
  });

  useEffect(() => {
    audioRecorderPlayer.setSubscriptionDuration(0.09);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onStartRecord = async () => {
    const path = 'hello.m4a';
    const audioSet = {
      AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
      AudioSourceAndroid: AudioSourceAndroidType.MIC,
      AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
      AVNumberOfChannelsKeyIOS: 2,
      AVFormatIDKeyIOS: AVEncodingOption.aac,
    };

    console.log('audioSet', audioSet);
    const uri = await audioRecorderPlayer.startRecorder(path, audioSet);

    audioRecorderPlayer.addRecordBackListener((e: any) => {
      setSettings({
        ...settings,
        recordSecs: e.current_position,
        recordTime: audioRecorderPlayer.mmssss(Math.floor(e.current_position)),
      });
    });
    console.log(`uri: ${uri}`);
  };

  const onStopRecord = async () => {
    const result = await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();

    setSettings({
      ...settings,
      recordSecs: 0,
    });

    console.log(result);
  };

  const onPausePlay = async () => {
    await audioRecorderPlayer.pausePlayer();
  };

  const onStartPlay = async () => {
    console.log('onStartPlay');
    const path = 'hello.m4a';
    const msg = await audioRecorderPlayer.startPlayer(path);
    audioRecorderPlayer.setVolume(1.0);
    console.log(msg);

    audioRecorderPlayer.addPlayBackListener((e: any) => {
      if (e.current_position === e.duration) {
        console.log('finished');
        audioRecorderPlayer.stopPlayer();
      }

      setSettings({
        ...settings,
        currentPositionSec: e.current_position,
        currentDurationSec: e.duration,
        playTime: audioRecorderPlayer.mmssss(Math.floor(e.current_position)),
        duration: audioRecorderPlayer.mmssss(Math.floor(e.duration)),
      });
    });
  };
  const onStopPlay = () => {
    console.log('onStopPlay');
    audioRecorderPlayer.stopPlayer();
    audioRecorderPlayer.removePlayBackListener();
  };

  return (
    <Card>
      <Card.Title title="Card Title" subtitle="Card Subtitle"></Card.Title>
      <Card.Content>
        <Title>{settings.recordTime}</Title>
        <Button
          mode="contained"
          icon="record"
          onPress={() => onStartRecord()}
          style={{marginBottom: 10}}>
          RECORD
        </Button>
        <Button
          icon="stop"
          mode="outlined"
          onPress={() => onStopRecord()}
          style={{marginBottom: 10}}>
          STOP
        </Button>
        <Divider />
        <Title style={{marginBottom: 10}}>
          {settings.playTime} / {settings.duration}
        </Title>
        <Button
          mode="contained"
          icon="play"
          onPress={() => onStartPlay()}
          style={{marginBottom: 10}}>
          PLAY
        </Button>
        <Button
          icon="pause"
          mode="contained"
          onPress={() => onPausePlay()}
          style={{marginBottom: 10}}>
          PAUSE
        </Button>
        <Button
          icon="stop"
          mode="outlined"
          onPress={() => onStopPlay()}
          style={{marginBottom: 10}}>
          STOP
        </Button>
      </Card.Content>
    </Card>
  );
};
