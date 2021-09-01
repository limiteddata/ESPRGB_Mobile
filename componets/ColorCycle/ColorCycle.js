import React, { useState, useEffect, useRef } from 'react';
import { Text, View, SafeAreaView } from 'react-native';
import { GlobalStyles } from '@shared/styles';
import { GlobalColors } from '@shared/colors';
import ToggleButton from '../ToggleButton/ToggleButton';
import Slider from "react-native-sliders";
import { GlobalIcons } from '../../shared/icons';

function ColorCycle ({myDevice,forwardedRef,settings}) {
  
  const [startAnimation, setStartAnimation] = useState(false);
  const [speed,setSpeed] = useState(settings?settings.ColorCycleSpeed:50);

  useEffect(() => {
    
    if(myDevice){
      myDevice.ColorCycle.on('Speed:change', (e)=> setSpeed(e.Speed));
      myDevice.on('playingAnimation:change', (e)=> setStartAnimation(e.playingAnimation === "Color Cycle") );
    }
  }, []);
  if(forwardedRef){
    useEffect(()=>{
      forwardedRef.current = {
          speed:speed
      }
    })
  }

  return (
      <View style={myDevice&& {width:'100%', padding:20 ,  flex:1, backgroundColor:GlobalColors.lightBlue, alignItems:'center' }}>
        <View style={{flexDirection: 'row', width:'100%' , height:30, justifyContent:'center'}} >
          <View style={GlobalStyles.formItem}>
              <Slider
              trackStyle={{
                height: 30,
                borderRadius: 1,
                backgroundColor: '#d5d8e8',
              }}
              thumbStyle={GlobalStyles.thumb}
              minimumTrackTintColor={GlobalColors.green}
              minimumValue={1}
              maximumValue={200}
              value={speed}
              onValueChange={(value) => {
                value = parseInt(value);
                if(myDevice) myDevice.ColorCycle.setSpeed(value);  
                setSpeed(value); 
              }}
              style={GlobalStyles.formItem}
            />
          </View>
          {
            myDevice&&
          <View style={GlobalStyles.formIcon}>
            <ToggleButton
              icon={(startAnimation)? GlobalIcons.checkboxOn:GlobalIcons.checkboxOff }
              toggleColor={(startAnimation)?GlobalColors.green:GlobalColors.white}
              onPress={() => {
                setStartAnimation(!startAnimation);
                if(myDevice) myDevice.playAnimation('Color Cycle',!startAnimation);
              }}
              buttonStyle={{width:30,height:30, borderRadius:50, justifyContent: 'center', alignItems: 'center'}}
              noText={true}
              disabled={false}
            />
          </View>
          }
        </View>
        <Text style={{...GlobalStyles.text, textAlign: 'right', marginTop: 10 }}>Speed: {speed}</Text>
      </View>
  );
}
export default ColorCycle;