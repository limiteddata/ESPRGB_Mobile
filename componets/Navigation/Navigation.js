
import React, { useContext, useEffect  } from 'react';
import { StatusBar, View, Text, Button } from 'react-native';
import { GlobalColors } from '@shared/colors';
import AddNewDevice from '../AddNewDevice/AddNewDevice';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserControls from '../UserControls/UserControls';
import InitializeDeviceStack from '../AddNewDevice/InitializeDeviceStack';
import RNBootSplash from "react-native-bootsplash";
import { DeviceContext } from '../DeviceContext';
const Drawer = createDrawerNavigator();

const tabsOptions = {
  headerStyle: {
      backgroundColor: GlobalColors.darkBlue,
  },
  headerTintColor: '#fff',
  headerTitleStyle: {
    fontWeight: 'bold',
  },  
}

const Navigation = () => {
    const context = useContext(DeviceContext);
    useEffect(()=>{
        setTimeout(()=>RNBootSplash.hide({fade:true}),1500)
    },[])
    return (
        <NavigationContainer>
          <StatusBar backgroundColor={GlobalColors.darkBlue} barStyle={'default'} />
          <Drawer.Navigator
              screenOptions={{
                lazy:false,
                optimizationsEnabled:true,
                drawerStyle:{ backgroundColor: GlobalColors.darkBlue, },
                drawerLabelStyle:{color:GlobalColors.white },
                drawerActiveBackgroundColor:GlobalColors.green
                }}>  
                {
                    context.devices.map(item=>{
                        return <Drawer.Screen
                        key={item.id} 
                        options={{ ...tabsOptions, }} 
                        name={item.name} 
                        children={ ()=><UserControls key={item.id}  device={item}/> } />
                    })                   
                }  
                <Drawer.Screen 
                options={{ ...tabsOptions, }}
                name="Add Device" children={ ()=><AddNewDevice saveDevice={(navigation, deviceIp)=>{
                    if(deviceIp.length === 0) 
                        return alert('Enter ipaddress');
                    if (context.devices.filter(e => e.ipAddress === deviceIp).length > 0) 
                        return alert('Device already exists');
                    const newDevice = { id: Date.now(), name: deviceIp, ipAddress: deviceIp};
                    if(deviceIp.split('-')[0]==='esprgb') newDevice.name = deviceIp.split('-')[1];     
                    
                    context.saveDevices([...context.devices, newDevice] , ()=> navigation.navigate(newDevice.name))
                }}/>
                }/>   
                <Drawer.Screen options={{ ...tabsOptions, lazy:true }} name="Initialize Devices" component={InitializeDeviceStack} />   
          </Drawer.Navigator>   
        </NavigationContainer>
    );
}

export default Navigation;