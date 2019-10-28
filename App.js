/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import * as React from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';import { RNCamera } from 'react-native-camera';
import {accelerometer, setUpdateIntervalForType, SensorTypes} from "react-native-sensors";
import RNSimpleCompass from 'react-native-simple-compass';

// const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       flexDirection: 'column',
//       backgroundColor: 'black'
//     },
//     preview: {
//       flex: 1,
//       justifyContent: 'flex-end',
//       alignItems: 'center'
//     },
//     capture: {
//       flex: 0,
//       backgroundColor: '#fff',
//       borderRadius: 5,
//       padding: 15,
//       paddingHorizontal: 20,
//       alignSelf: 'center',
//       margin: 20
//     }
//   });

setUpdateIntervalForType(SensorTypes.accelerometer, 400);
const degree_update_rate = 1; // Number of degrees changed before the callback is triggered

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  headline: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  valueContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  valueValue: {
    width: 200,
    fontSize: 16
  },
  valueName: {
    width: 60,
    fontSize: 16,
    fontWeight: 'bold'
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
});

  const Value = ({name, value}) => (
    <View style={styles.valueContainer}>
      <Text style={styles.valueName}>{name}:</Text>
      <Text style={styles.valueValue}>{new String(value).substr(0, 8)}</Text>
    </View>
  )



export default class App extends React.Component {
  state = {
    x: 0,
    y: 0,
    z: 0,
    degree: 0
  }
  
  sub;

  componentDidMount() {

    this.sub =  accelerometer.subscribe(({x, y, z}) => {
      this.setState({x,y,z});
    });

    RNSimpleCompass.start(degree_update_rate, (degree) => {
      //console.log('You are facing', degree);
      // RNSimpleCompass.stop();
      this.setState({degree})
    });

    
  }

  componentWillUnmount() {
    RNSimpleCompass.stop()
    this.sub.unsubscribe()
  }

  render() {
    return (
      <View style={styles.container}>
        <RNCamera
            ref={ref => {
              this.camera = ref;
            }}
            style = {styles.preview}
            type={RNCamera.Constants.Type.back}
            flashMode={RNCamera.Constants.FlashMode.on}
            permissionDialogTitle={'Permission to use camera'}
            permissionDialogMessage={'We need your permission to use your camera phone'}
            onGoogleVisionBarcodesDetected={({ barcodes }) => {
              console.log(barcodes)
            }}
        />
        {/* <View style={{flex: 0, flexDirection: 'row', justifyContent: 'center',}}>
          <TouchableOpacity
              onPress={this.takePicture.bind(this)}
              style = {styles.capture}>
              <Text style={{fontSize: 14}}> SNAP </Text>
          </TouchableOpacity>
        </View> */}
        <Text style={styles.headline}>
          Accelerometer values
        </Text>
        <Value name="x" value={this.state.x} />
        <Value name="y" value={this.state.y} />
        <Value name="z" value={this.state.z} />
        <Text style={styles.headline}>
          Compass
        </Text>
        <Value name="degree" value={this.state.degree} />

      </View>
    );
  }
  
  takePicture = async function() {
    if (this.camera) {
      const options = { quality: 0.5, base64: true };
      const data = await this.camera.takePictureAsync(options)
      console.log(data.uri);
    }
  };
}
