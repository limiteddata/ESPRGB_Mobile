import React, { useState, useContext, useMemo } from 'react';
import { View, SafeAreaView, Alert, Text } from 'react-native';
import { GlobalStyles } from '@shared/styles';
import { GlobalColors } from '@shared/colors';
import ToggleButton from '../ToggleButton/ToggleButton';
import { GlobalIcons } from '../../shared/icons';
import { DeviceContext } from '../DeviceContext';
import {  useNavigation } from '@react-navigation/native';

const showConfirmDialog = (message,callback) => {
    return Alert.alert("Are your sure?", message,[{text: "Yes",onPress: () => callback()},{text: "No"}]);
};
const Other = ({myDevice}) => {
  const navigation = useNavigation();
  const [connectText, setConnectText] = useState('Connect');
  const [connected, setConnected] = useState(false);
  const [powerIfConnected, setPowerIfConnected] = useState(false);
  const [version, setVersion] = useState('0.0.0.0');
  useMemo(() => {
    myDevice.on('powerConnected:change', (e)=> setPowerIfConnected( e.powerConnected ) );
    myDevice.on('Version:change', (e)=> setVersion(e.Version) );
    myDevice.on('connected:change', (e)=> {
      if(e.connected) {
        setConnectText("Disconnect");
        setConnected(true); 
      }
      else {
        setConnectText("Connect");
        setConnected(false); 
      }
    });
  }, []);
  const appState = useContext(DeviceContext);
  return (
    <SafeAreaView style={ GlobalStyles.container }>
        <View style={{flex:1, marginTop: 35, flexDirection: 'row', justifyContent:'center',flexWrap: 'wrap'}} >
          <ToggleButton
            icon={(connected)? GlobalIcons.wifiOn : GlobalIcons.wifiOff}
            toggleColor={(connected)?GlobalColors.green:GlobalColors.white}
            onPress={()=> myDevice.ConnectToggle() }
            text={connectText}/>
          <ToggleButton
            icon={(powerIfConnected)? GlobalIcons.powerOn : GlobalIcons.powerOff}
            toggleColor={(powerIfConnected)?GlobalColors.green:GlobalColors.white}
            onPress={()=> { setPowerIfConnected(!powerIfConnected); myDevice.powerConnectedToggle(); }}
            text={'Power if Connected'}/>
          <ToggleButton
            icon={ GlobalIcons.refresh }
            toggleColor={GlobalColors.white}
            onPress={()=>{ showConfirmDialog("Are you sure you want to restart this device?",()=>myDevice.restart())} }
            text={'Restart Device'}/>
          <ToggleButton
            icon={ GlobalIcons.config }
            toggleColor={GlobalColors.white}
            onPress={()=> {  navigation.navigate('Config')  } }
            text={'Config'}/>
          <ToggleButton
            icon={ GlobalIcons.format }
            toggleColor={GlobalColors.white}
            onPress={()=>{ showConfirmDialog("Are you sure you want to format this device?",()=>myDevice.format()) } }
            text={'Format Device'}/>
          <ToggleButton
            icon={ GlobalIcons.userConfig }
            toggleColor={GlobalColors.white}
            onPress={()=>{ showConfirmDialog("Are you sure you want to remove all the user data from this device?",()=>myDevice.removeUserData()) } }
            text={'Remove User Data'}/>
          <ToggleButton
            icon={ GlobalIcons.remove }
            toggleColor={ GlobalColors.white }
            onPress={()=> { 
              showConfirmDialog("Are you sure you want to remove this device?",()=>{
                if(!myDevice.CheckIfConnected()) myDevice.Disconnect();
                myDevice.removeEvents();
                appState.saveDevices( appState.devices.filter(device=> device.ipAddress !== myDevice.ipaddress ) )
              })
            } }
            text={'Remove Device'}/>
        </View>
        <Text style={GlobalStyles.text}>ESPRGB Version: {version}</Text>
    </SafeAreaView>
  );
}

export default Other;