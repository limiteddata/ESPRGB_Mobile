import React, { useState, useEffect } from 'react';
import { View, TextInput, SafeAreaView} from 'react-native';
import { GlobalStyles } from '@shared/styles';
import { GlobalColors } from '@shared/colors';
import ColorPicker from 'react-native-wheel-color-picker'
import ToggleButton from '../ToggleButton/ToggleButton';
import Slider from "react-native-sliders";
import { GlobalIcons } from '../../shared/icons';
import  { rgbToHex_4 }  from '../Utils/ESPRGBUtils'

function SolidColor ({myDevice,forwardedRef,settings}) {
  const [color,setColor] = useState(settings?rgbToHex_4(settings.Color):"#ffffff");
  const [hexColor,setHexColor] = useState(settings?rgbToHex_4(settings.Color):"#ffffff");
  const [power, setPower] = useState(false);
  const [brightness,setBrightness] = useState(settings?settings.Brightness:1.0);
  useEffect(() => {
    if(myDevice){
      myDevice.SolidColor.on('Color:change', (e)=>{ 
        setColor(e.Hex); 
        setHexColor(e.Hex); 
      });
      myDevice.SolidColor.on('powerButton:change', (e)=> setPower(e.powerButton) );
      myDevice.SolidColor.on('Brightness:change', (e)=> setBrightness(e.Brightness) );
    }
  }, []);

  if(forwardedRef){
    useEffect(()=>{
      forwardedRef.current = {
        color:color,
        brightness:brightness,
      }
    })
  }

  return (
    <SafeAreaView style={myDevice && GlobalStyles.container}>
      <View style={{ flex:1,justifyContent:'center', alignItems:'center' }}>
        <View>
          <View style={{ width:340,  height:340,}}>
            <ColorPicker
              color={color}
              thumbSize={20}
              noSnap={false}
              row={false}
              swatches={ false }
              noSlider={ true }
              onInputChange={(_color)=>{ 
                setHexColor(_color);
                setColor(_color);
                if(myDevice) myDevice.SolidColor.setHexColor(_color);            
              }}/>
          </View>
          {
          myDevice&&
          <View style={{ position:'absolute',  bottom:-15, right:0, }} >
            <ToggleButton
              icon={(power)? GlobalIcons.powerOn:GlobalIcons.powerOff }
              toggleColor={(power)?GlobalColors.green:GlobalColors.white}
              onPress={()=> { 
                setPower(!power);  
                if(myDevice) myDevice.SolidColor.powerButtonToggle(); 
              }}
              buttonStyle={{ width:50, height:50, borderRadius:50, justifyContent: 'center', alignItems: 'center'}}
              noText={true}
            />
          </View>
          }
          <TextInput
            value={hexColor}
            placeholder="#FFFFFF"
            style={{ color:GlobalColors.white, position:'absolute', bottom:-15, left:0, fontSize:16 }}
            maxLength={7}
            onChangeText={(e)=>{
              if(e.length === 0)  e = '#';
              setHexColor(e);
              if (myDevice && myDevice.isHexColor(e))  myDevice.SolidColor.setHexColor(e);          
            }}/>
            
        </View>
        <View style={{width:'100%', marginTop:30}}>
          <Slider
            trackStyle={GlobalStyles.track}
            thumbStyle={GlobalStyles.thumb}
            minimumTrackTintColor={color}
            value={brightness}
            onValueChange={value => {
              setBrightness(value);
              if(myDevice) myDevice.SolidColor.setBrightness(value[0].toFixed(3))          
            }}
            style={{ width:'100%' }}
          />
        </View>
      </View>
  </SafeAreaView>
  );
}

export default SolidColor;

