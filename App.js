import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, FlatList, Alert } from 'react-native';
import { RNCamera } from 'react-native-camera';
import axios from 'axios';

const App = () => {
  const [scannedData, setScannedData] = useState([]);
  const [isScanning, setIsScanning] = useState(true);

  const handleBarCodeRead = ({ data }) => {
    if (isScanning) {
      setIsScanning(false);
      setScannedData(prevData => [...prevData, data]);
      Alert.alert("QR Code Scanned", data, [
        { text: "OK", onPress: () => setIsScanning(true) }
      ]);
    }
  };

  const getGPT3Response = async (prompt) => {
    try {
      const response = await axios.post('https://api.openai.com/v1/engines/davinci/completions', {
        prompt: prompt,
        max_tokens: 150
      }, {
        headers: {
          'Authorization': `Bearer YOUR_API_KEY`,
          'Content-Type': 'application/json'
        }
      });
      return response.data.choices[0].text.trim();
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to fetch response from GPT-3");
    }
  };

  const handleAskGPT3 = async () => {
    const lastScanned = scannedData[scannedData.length - 1];
    if (lastScanned) {
      const response = await getGPT3Response(`What can you tell me about this QR code data: ${lastScanned}`);
      Alert.alert("GPT-3 Response", response);
    } else {
      Alert.alert("No Data", "Please scan a QR code first.");
    }
  };

  return (
    <View style={styles.container}>
      <RNCamera
        style={styles.camera}
        onBarCodeRead={handleBarCodeRead}
        captureAudio={false}
      />
      <View style={styles.buttonContainer}>
        <Button title="Ask GPT-3" onPress={handleAskGPT3} />
      </View>
      <FlatList
        data={scannedData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Text style={styles.historyItem}>{item}</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  buttonContainer: {
    margin: 20,
  },
  historyItem: {
    padding: 10,
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default App;