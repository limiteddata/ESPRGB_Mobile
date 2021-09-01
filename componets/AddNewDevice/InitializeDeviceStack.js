import React, { useState, useEffect, useContext, useRef } from 'react';
import { AppState, Text, View, SafeAreaView,RefreshControl, StyleSheet, ScrollView, PermissionsAndroid } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { GlobalStyles } from '@shared/styles';
import { GlobalColors } from '@shared/colors';
import { GlobalIcons } from '../../shared/icons';
import Config from '../Config/Config';
import ToggleButton from '../ToggleButton/ToggleButton';
import WifiManager from "react-native-wifi-reborn";
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';

import { createContext } from "react";

export const InitializeContext = createContext(null)

const Stack = createStackNavigator();

const tabsOptions = {
    headerStyle: {
        backgroundColor: GlobalColors.darkBlue,
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },  
}
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const MessageScreen = ({navigation}) =>{
  const initializeState = useContext(InitializeContext);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(async () => {
    await scanForDevices();
  }, []);
  
    const [foundDevices, setFoundDevices] = useState([]);

    const scanForDevices = async ()=>{
      try {
        setRefreshing(true);
        setFoundDevices([]);   
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location permission is required for WiFi connections',
              message:
                'This app needs location permission as this is required  ' +
                'to scan for wifi networks.',
              buttonNegative: 'DENY',
              buttonPositive: 'ALLOW',
            },
          );
        const locationEnabled = await RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({interval: 10000,fastInterval: 5000,})
        if(granted !== PermissionsAndroid.RESULTS.GRANTED && (locationEnabled ==="already-enabled"|| locationEnabled === "enabled" )) return

        if(!(await WifiManager.isEnabled()) ) {
          setRefreshing(true);
          WifiManager.setEnabled(true);
          await wait(6500);
          setRefreshing(false);
        }     
        const currentSSID = await WifiManager.getCurrentWifiSSID();
        if(currentSSID.match(/ESPRGB_Config/)) {
          navigation.navigate('Add Device');
          setRefreshing(false);
          return true;
        }
        initializeState.setConnectedSSID(currentSSID);
        const freq = await WifiManager.getFrequency();
        if(freq === 5240)  {
          alert('You are connected to a 5GHz Wi-Fi please connect to 2.4GHz one');
          setRefreshing(false);
          return false;
        }
        const nearWifi = (await WifiManager.reScanAndLoadWifiList()).filter( word => word.SSID.match(/ESPRGB_Config/) );
        setFoundDevices(nearWifi.map(e=>{
          return { 
            SSID: e.SSID, 
            ShortName: e.SSID.split('(')[0],
            Identifier: e.SSID.split('(')[1].split(')')[0], 
            frequency:e.frequency, 
            level:e.level
          }}));
        setRefreshing(false);
        return true;
      } 
      catch (e) {
          setRefreshing(false);
          return false;
      }
    }
    useEffect(()=>{    
      scanForDevices();
    },[]);    
    
    return(
    <SafeAreaView style={GlobalStyles.container}>
        
        <ScrollView 
                style={{marginTop:10, backgroundColor:GlobalColors.darkBlue, flex:1, padding:25,  }}
                contentContainerStyle={{alignItems:'center',}}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh} />
                  }>  
                  <Text style={styles.message}>Connected to:{'\n'}{ initializeState.connectedSSID}</Text>
          { 
            foundDevices.length === 0 ? 
              <View style={styles.message} >
                <Text style={styles.message} >No device found.</Text>
                <Text style={styles.message} >Please make sure that you Wi-Fi and Location turned on</Text>
                <Text style={styles.message} >Also check if there's any hotspot with 'ESPRGB_Config(XX:XX:XX)' in the Wi-Fi settings and connect to it</Text>
                <ToggleButton
                  noImage={true}
                  textStyle={{ color:GlobalColors.white,fontSize:16,fontWeight:'bold'}}
                  onPress={()=>scanForDevices()}
                  buttonStyle={{...GlobalStyles.buttonStyle, width:120, alignSelf:'center', margin:10}}
                  text={'Refresh'}/>
              </View>: 
              
                <>     
                <Text style={styles.message} >Devices found:</Text>
                {
                  foundDevices.map((e,i)=>{
                    return(
                      <ToggleButton
                        key={i}
                        icon={ GlobalIcons.esprgb_45 }
                        toggleColor={GlobalColors.white}
                        onPress={()=>{
                          console.log(e)
                          setRefreshing(true);
                          WifiManager.connectToProtectedSSID(e.SSID,"",false).then(
                            () => {
                              setRefreshing(false);
                              navigation.navigate('Add Device');
                            }, (e) => setRefreshing(false));
                        }}
                        textStyle={{ color:GlobalColors.white,fontSize:14, textAlign:'center', marginTop:3 }}
                        buttonStyle={{width:'80%',height:135,margin:5, backgroundColor:GlobalColors.grey, justifyContent: 'center', alignItems: 'center'}}
                        text={`${e.ShortName}\nIdentifier:${e.Identifier}\nRSSI:${e.level}`}
                      />
                  )})
                  }
                </>
                }

        </ScrollView>
    </SafeAreaView>
    )
}

export default function InitializeDeviceStack(){
    const [connectedSSID,setConnectedSSID] = useState('');
    return(
      <InitializeContext.Provider value={{connectedSSID,setConnectedSSID}}>
        <Stack.Navigator>
            
              <Stack.Screen name="Message Screen" 
              options={{ ...tabsOptions, headerShown:false }}
              component={ MessageScreen } />
              <Stack.Screen name="Add Device" 
              options={{ ...tabsOptions, headerShown:false }}
              children={ ()=> <Config ipaddress={'192.168.1.1'} currentSSID={connectedSSID} notConfigured={true} />  } 
              />
           
        </Stack.Navigator>
      </InitializeContext.Provider>
    )
}

const styles = StyleSheet.create({
  message:{
    ...GlobalStyles.text,
    fontSize:21,
    textAlign:'center',
    marginTop:10,
    marginBottom:10
  }
})