import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Text, View,Image } from 'react-native';
import { GlobalColors } from '@shared/colors';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SolidColor from '../SolidColor/SolidColor';
import ColorCycle from '../ColorCycle/ColorCycle';
import Breathing from '../Breathing/Breathing';
import MorseCode from '../MorseCode/MorseCode';
import { GlobalIcons } from '../../shared/icons';
import OtherStack from '../Other/OtherStack';
import Schedule from '../Schedule/Schedule';

const Tab = createBottomTabNavigator();
const ESPRGB = require('esprgb_libjs');



const tabsOptions = {
    headerStyle: {
        backgroundColor: GlobalColors.darkBlue,
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
    fontWeight: 'bold',
    },     
    tabBarIcon: () => <View></View>,
}


export default function UserControls({device}){
    const [status,setStatus] = useState("");
    const [wifiSignal,setWifiSignal] = useState( GlobalIcons.wifiLow );
    const myDevice = useRef(new ESPRGB(device.ipAddress))
    useEffect(()=>{
        var timeoutIndex=0;
        const timeoutValues = [3000, 15000, 30000, 60000, 120000];
        var timeInterval = null;
        var currentSec = 3000;
        myDevice.current.on('playingAnimation:change', (e)=> setStatus(`Playing:\n${e.playingAnimation}`));
        myDevice.current.on('RSSI:change', (e)=> {
            if (e.RSSI >= -50) setWifiSignal(GlobalIcons.wifiExcelent);
            else if (e.RSSI < -50 && e.RSSI >= -60) setWifiSignal(GlobalIcons.wifiGood);
            else if (e.RSSI < -60 && e.RSSI >= -70) setWifiSignal(GlobalIcons.wifiMedium);
            else if (e.RSSI < -70) setWifiSignal(GlobalIcons.wifiLow);
        });
        myDevice.current.on('connected:pending', (e)=> setStatus('Connecting'));
        myDevice.current.on('connected:change', (e)=> {
            if(e.connected) {
                setStatus("Connected");
                timeoutIndex = 0;
                currentSec = 3000;
            }
            else {
                setStatus("Disconnected");
                setWifiSignal(GlobalIcons.wifiLow);
            }
        });
        myDevice.current.on('connected:error', (e)=> {
            timeInterval = setInterval(()=>{
                setStatus(`Reconnecting\n in ${currentSec/1000} sec`)
                if(currentSec < 0){
                    console.log('reconnecting')
                    myDevice.current.Connect();
                    if(timeoutIndex != timeoutValues.length-1)  timeoutIndex++;
                    currentSec = timeoutValues[timeoutIndex];
                    clearInterval(timeInterval);
                }
                currentSec -= 1000;
            },1000);
        });
        myDevice.current.Connect();
        return () => {
            clearInterval(timeInterval);
        };
    },[])

    return ( 
        <View style={{flex:1}}>
            <Tab.Navigator screenOptions={{
                    headerShown: false,
                    tabBarLabelStyle: { 
                        color:GlobalColors.white,
                        fontSize:14, 
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        textAlignVertical: 'center',
                    },
                    tabBarStyle: { 
                        borderTopWidth: 0, 
                        alignItems: 'center',
                    },
                    tabBarActiveBackgroundColor:GlobalColors.green,
                    tabBarInactiveBackgroundColor:GlobalColors.darkBlue,
                    lazy:false,
                }}>
                <Tab.Screen 
                options={{ title: 'Solid Color',...tabsOptions, }}
                name="Solid" children={ ()=><SolidColor myDevice={myDevice.current}/>}/>
                <Tab.Screen 
                options={{ title: 'Color Cycle',...tabsOptions }}
                name="Cycle" children={ ()=><ColorCycle myDevice={myDevice.current}/>} />
                <Tab.Screen 
                options={{ title: 'Breathing',...tabsOptions }}
                name="Breathing" children={ ()=><Breathing myDevice={myDevice.current}/>} />
                <Tab.Screen 
                options={{ title: 'Morse Code',...tabsOptions }}
                name="Morse" children={ ()=><MorseCode myDevice={myDevice.current}/>} />
                <Tab.Screen 
                options={{ title: 'Schedule',...tabsOptions }}
                name="Schedule"  children={ ()=><Schedule myDevice={myDevice.current}/>}   />
                <Tab.Screen 
                options={{ title: 'Other',...tabsOptions }}
                name="Others"  children={ ()=><OtherStack myDevice={myDevice.current}/>}   />
            </Tab.Navigator>
            <View style={{backgroundColor: GlobalColors.darkBlue ,  padding:8,  position:'absolute', right:0, bottom:55 }}>
                <Image source={ wifiSignal } style={{ alignSelf:'center' }} fadeDuration={0} />
                <View style={{ justifyContent:'center', alignItems:'center', flex:1 }} >
                    <Text style={{textAlign:'center', color:'white', fontSize:12 }}>{status}</Text>
                </View>
            </View>
        </View>
    );
};
