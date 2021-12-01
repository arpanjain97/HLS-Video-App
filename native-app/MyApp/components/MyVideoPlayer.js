import React, { useState } from 'react';
import { View } from 'react-native';
import VideoPlayer from 'react-native-video-controls';
import RNPickerSelect from 'react-native-picker-select';

export default function MyVideoPlayer(props) {
    const [resolutionBasedFileName, setResolutionBasedFileName] = useState('index');
    return (
      <View>
        <VideoPlayer 
          source={{ uri: `http://localhost:3000/${props.item}/${resolutionBasedFileName}.m3u8` }} 
          paused={true} 
          disableBack={true} 
          disableVolume={true} 
          disableFullscreen={true} 
          style={{ width: '100%', height: 300, marginBottom: 5 }}
        />
        <RNPickerSelect 
          value={resolutionBasedFileName}
          onValueChange={setResolutionBasedFileName}
          items={[
              { label: 'Auto', value: 'index' },
              { label: 'SD', value: 'sd_out' },
              { label: 'HD', value: 'hd_out' },
          ]}
          style={{ marginBottom: 10 }}
        />
      </View>
    );
  }