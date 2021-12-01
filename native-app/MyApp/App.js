import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import MyVideoPlayer from './components/MyVideoPlayer';

const styles = StyleSheet.create({
  TouchableOpacityStyle:{
    position: 'absolute',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 30,
    borderRadius: 25,
    backgroundColor: '#f4511e',
  },
 
  FloatingButtonStyle: {
    resizeMode: 'contain',
    width: 50,
    height: 50,
  }
});

const chooseFileAndUpload = async (updateVideoList) => {
  let fileObj;
  try {
    fileObj = await DocumentPicker.pick({
      type: [DocumentPicker.types.video],
    });
  } catch (err) {
    //Handling any exception (If any)
    if (DocumentPicker.isCancel(err)) {
      //If user canceled the document selection
      console.log('Canceled from single doc picker');
    } else {
      //For Unknown Error
      console.log('Unknown Error: ' + JSON.stringify(err));
      throw err;
    }
  }
  console.log(fileObj);
  if (fileObj.length < 1) return;
    
  // Create FormData
  const data = new FormData();
  data.append("file", fileObj[0]);
  
  const url = "http://localhost:3000/upload";
  try {
    await fetch(url, {
      method: "POST",
      body: data,
      headers: {
        Accept: "*/*",
      }
    });

    let res = await fetch (url, { method: "GET" });
    let { video_ids } = await res.json();
    updateVideoList(video_ids);
  } catch (err) {
    console.log('hello')
    console.log(err);
  }
};

function App() {
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    const url = "http://localhost:3000/upload";

    fetch (url, { method: "GET" })
      .then((res) => res.json())
      .then(({ video_ids }) => setData(video_ids));
  }, [])
  console.log(data);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <FlatList 
        style={{ flex: 1, width: '100%'}}
        data={data}
        renderItem={({ item }) => <MyVideoPlayer item={item} />}
        showsVerticalScrollIndicator={false}
      />
      <TouchableOpacity activeOpacity={0.5} onPress={() => chooseFileAndUpload(setData)} style={styles.TouchableOpacityStyle} >
        <Text style={{ fontSize: 40, color: "#ffffff" }}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

export default App;
