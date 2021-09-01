import React, { useState } from 'react';
import { GlobalColors } from '@shared/colors';
import { createStackNavigator } from '@react-navigation/stack';
import Other from './Other';
import Config from '../Config/Config'

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

export default function OtherStack({myDevice}){
    return(
        <Stack.Navigator>
            <Stack.Screen name="Other" 
            options={{ headerShown:false }}
            children={ ()=><Other myDevice={myDevice}/>} />
            <Stack.Screen name="Config" 
            options={{ ...tabsOptions, headerShown:false }}
            children={ ()=><Config ipaddress={myDevice.ipaddress}/>} />
        </Stack.Navigator>
    )
}