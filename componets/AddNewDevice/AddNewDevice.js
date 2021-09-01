import React, { useState,useEffect } from 'react';
import { Text, View, SafeAreaView, Button, TextInput, StyleSheet, ScrollView } from 'react-native';
import { GlobalStyles } from '@shared/styles';
import { GlobalColors } from '@shared/colors';
import ToggleButton from '../ToggleButton/ToggleButton';
import { GlobalIcons } from '../../shared/icons';
import Zeroconf from 'react-native-zeroconf'
import {  useNavigation } from '@react-navigation/native';

const ESPRGB = require('esprgb_libjs');

const zeroconf = new Zeroconf();
var lastTap = null;
var myDevice;
const AddNewDevice = ({saveDevice}) => {
  const navigation = useNavigation();
  const [ipAddress,setIpAddress] = useState('');
  const [devices,setDevices] = useState([]);
  const [currentMessage,setCurrentMessage] = useState('Scan your network for esprgb devices');
  const [currentIcon,setCurrentIcon] = useState(GlobalIcons.search);
  const [hideMessage,setHideMessage] = useState(false);
  const [disableSearch, setDisableSearch] = useState(false);
  const [connectedText,setConnectText] = useState('');
  const [conButtonText,setConButtonText] = useState('Connect');

  useEffect(() => {
    myDevice = new ESPRGB('');
    myDevice.on('connected:change', (e)=> {
      if(e.connected) {
        setConnectText("Connected");
        setConButtonText('Disconnect');
      }
      else {
        setConnectText("Disconnected");
        setConButtonText('Connect');
      }
    });
  
    zeroconf.on('start', () => {
      setDevices([]);
      setHideMessage(false);
      setDisableSearch(true);
      setCurrentMessage('Searching for your esprgb devices');
    });
    zeroconf.on('stop', () => {
      if(devices.length == 0) setCurrentMessage("Couldn't find any esprgb devices in your network");
      setCurrentIcon( GlobalIcons.refresh );
      setDisableSearch(false);
    });
    zeroconf.on('resolved', service => {
      const newDevice = {
        name: service['host'].split('-')[1],
        hostname: service['host'],
        ipAddress: service['addresses'][0],
      }
      if (devices.filter(e => e.ipAddress === newDevice.ipAddress).length > 0)  return;
      setHideMessage(true);
      setDevices(item=>[...item, newDevice ])
    })
  }, []);
  
  return (
    <SafeAreaView style={GlobalStyles.container}>
      <View style={{marginTop:10}}>
          <View style={{flexDirection: 'row', height:30, justifyContent:'center'}} >
            <View style={GlobalStyles.formItem}>
              <TextInput
                style={styles.textBox}
                onChangeText={setIpAddress}
                value={ipAddress}
                placeholder="ipaddress"
              />
            </View>
            <View style={GlobalStyles.formIcon}>
              <ToggleButton
                disabled={disableSearch}
                icon={currentIcon}
                toggleColor={GlobalColors.white}
                onPress={()=> {      
                  zeroconf.scan('esprgb', 'tcp', 'local.');
                  setTimeout(() => {
                    zeroconf.stop()
                  }, 30000);
                }}
                buttonStyle={{ width:35, height:35, justifyContent: 'center', alignItems: 'center'}}
                noText={true}/>
            </View>
          </View>
          <View style={{ flexDirection:'row', justifyContent:'flex-end', alignItems:'center', marginTop:20,  }} >
            <Text style={GlobalStyles.text}>{connectedText}</Text>
            <ToggleButton
              noImage={true}
              textStyle={{ color:GlobalColors.white,fontSize:14,fontWeight:'bold' }}
              onPress={() => {
                if(myDevice.CheckIfConnected()) myDevice.ipaddress = ipAddress;
                myDevice.ConnectToggle();
              }}
              buttonStyle={{
                height:35, width: 100 , backgroundColor:GlobalColors.grey, justifyContent: 'center', 
                alignItems: 'center',
                marginRight:10,
                marginLeft:10
              }}
              text={conButtonText}/>
            <ToggleButton
              noImage={true}
              textStyle={{ color:GlobalColors.white,fontSize:14,fontWeight:'bold' }}
              onPress={()=>saveDevice(navigation, ipAddress)}
              buttonStyle={{height:35, width: 100, backgroundColor:GlobalColors.green, justifyContent: 'center', alignItems:'center'}}
              text={'Save'}/>
            </View>
          <View style={{width:'100%',alignItems:'center', marginTop:15 }}>
            <ScrollView style={{backgroundColor: GlobalColors.darkBlue, padding:10, height: '85%',width:'100%' }} >
              { !hideMessage && <Text style={GlobalStyles.text}>{currentMessage}</Text> }
              <View style={{flexDirection:'row', flexWrap: 'wrap',  }} >
                {
                  devices.map((item, i)=>{
                    return <ToggleButton
                      key={i}
                      icon={ GlobalIcons.esprgb_45 }
                      toggleColor={GlobalColors.white}
                      onPress={()=>{
                        const now = Date.now();
                        const DOUBLE_PRESS_DELAY = 300;
                        if (lastTap && (now - lastTap) < DOUBLE_PRESS_DELAY) saveDevice(navigation, ipAddress);
                        else {
                          lastTap = now;
                          setIpAddress(item.hostname);
                        }  
                      }}
                      textStyle={{ color:GlobalColors.white,fontSize:11, textAlign:'center', marginTop:3 }}
                      buttonStyle={{width:90,height:110,margin:5, backgroundColor:GlobalColors.grey, justifyContent: 'center', alignItems: 'center'}}
                      text={`${item.name}\n${item.ipAddress}`}
                    />
                  })
                }
              </View>
            </ScrollView>
          </View>
      </View>
  </SafeAreaView>
  );
}
export default AddNewDevice;

const styles = StyleSheet.create({
  textBox:{
    borderColor: '#6e6e6e',
    backgroundColor: GlobalColors.white,
    color: '#000000',
    borderWidth: 1,
    height:35,
  }
})