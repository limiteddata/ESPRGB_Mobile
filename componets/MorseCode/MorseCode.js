import React, { useState, useEffect } from 'react';
import { ScrollView, TextInput, View, Text, SafeAreaView, StyleSheet } from 'react-native';
import { GlobalStyles } from '@shared/styles';
import { GlobalColors } from '@shared/colors';
import ToggleButton from '../ToggleButton/ToggleButton';
import Slider from "react-native-sliders";
import ColorPicker from 'react-native-wheel-color-picker'
import { GlobalIcons } from '../../shared/icons';
import  { hexToColor, rgbToHex_4, listfromx4, isHexColor, encodeMessage, decodeMessage }  from '../Utils/ESPRGBUtils'

function MorseCode ({myDevice,forwardedRef,settings}) {

  const [color,setColor] = useState(settings?rgbToHex_4(settings.colorMorseCode):"#ffffff");
  const [hexColor,setHexColor] = useState(settings?rgbToHex_4(settings.colorMorseCode):"#ffffff");
  const [encodedText, setEncodedText] = React.useState(settings?settings.encodedMorseCode:'');
  const [decodedText, setDecodedText] = React.useState(settings?decodeMessage(settings.encodedMorseCode):'');
  const [startAnimation, setStartAnimation] = useState(false);
  const [useBuzzer, setUseBuzzer] = useState(settings?settings.useBuzzer:false);
  const [speed,setSpeed] = useState(settings?settings.unitTimeMorseCode:35);
  
  useEffect(() => {
    if(myDevice){
      myDevice.on('playingAnimation:change', (e)=> setStartAnimation(e.playingAnimation === "Morse Code") );
      myDevice.MorseCode.on('Speed:change', (e)=> setSpeed(e.Speed) );
      myDevice.MorseCode.on('useBuzzer:change', (e)=> setUseBuzzer(e.useBuzzer) );
      myDevice.MorseCode.on('encodedText:change', (e)=> {
        setEncodedText(e.EncodedText);
        setDecodedText(e.PlainText);
      });
      myDevice.MorseCode.on('Color:change', (e)=>{ 
        setColor(e.Hex); 
        setHexColor(e.Hex);
      });
    }
  }, []);

  if(forwardedRef){
    useEffect(()=>{
      forwardedRef.current = {
          speed:speed,
          color:color,   
          useBuzzer:useBuzzer,
          encodedText:encodedText,
      }
    })
  }

  return (
    <SafeAreaView style={myDevice ? GlobalStyles.container: { width:'100%'}}>
        <View style={{flexDirection: 'row', height:30, justifyContent:'center'}} >

            <View style={GlobalStyles.formItem}>
                <Slider
                trackStyle={{
                  height: 30,
                  borderRadius: 1,
                  backgroundColor: '#d5d8e8',
                }}
                thumbStyle={GlobalStyles.thumb}
                minimumTrackTintColor={GlobalColors.green}
                minimumValue={35}
                maximumValue={550}
                value={speed}
                onValueChange={(value) => {
                  value = parseInt(value);
                  if(myDevice) myDevice.MorseCode.setSpeed(value);  
                  setSpeed(value); 
                }}
                style={GlobalStyles.formItem}/>

            </View>
            {
            myDevice&&
            <View style={GlobalStyles.formIcon}>
              <ToggleButton
                icon={(startAnimation)? GlobalIcons.checkboxOn:GlobalIcons.checkboxOff }
                toggleColor={(startAnimation)?GlobalColors.green:GlobalColors.white}
                onPress={() => {
                  setStartAnimation(!startAnimation);
                  if(myDevice) myDevice.playAnimation('Morse Code',!startAnimation);
                }}
                buttonStyle={{width:30,height:30, borderRadius:50, justifyContent: 'center', alignItems: 'center'}}
                noText={true}/>
            </View>
            }
          </View>

          <View style={{flexDirection: 'row', justifyContent: "flex-end", alignItems:'center', height:30, marginTop:10}} >
              <Text style={{...GlobalStyles.text, marginRight: 10 }}>Speed: {speed}</Text>
            <Text style={GlobalStyles.text} >Use buzzer</Text>
            <View style={GlobalStyles.formIcon}>
            <ToggleButton
              icon={(useBuzzer)? GlobalIcons.checkboxOn:GlobalIcons.checkboxOff }
              toggleColor={(useBuzzer)?GlobalColors.green:GlobalColors.white}
              onPress={() => {
                setUseBuzzer(!useBuzzer);
                if(myDevice) myDevice.MorseCode.setUseBuzzer(!useBuzzer);
              }}
              buttonStyle={{width:25,height:25, borderRadius:50, justifyContent: 'center', alignItems: 'center'}}
              noText={true}/>
            </View>
          </View>


        <Text style={{...GlobalStyles.text, fontSize: 17, }}>Plain message:</Text>
        <TextInput
          multiline={true}
          numberOfLines={4}
          maxLength={75}
          onChangeText={text => {
            setDecodedText(text);
            //here maybe useeffect on this
            if(myDevice) setEncodedText(myDevice.MorseCode.setText(text));
            else setEncodedText(encodeMessage(text));
          }}
          value={decodedText}
          style={styles.textBox}/>
        <Text style={{...GlobalStyles.text, fontSize: 17, marginTop: 15}}>Encoded message:</Text>
        <View style={styles.textBox}>
          <ScrollView>
            <Text style={GlobalStyles.text}>{encodedText}</Text>
          </ScrollView>
        </View>

        <View style={{ alignItems:'center', }}>
            <View style={{ width:200,  height:200 }}>
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
                    if(myDevice) myDevice.MorseCode.setHexColor(_color);            
                  }}/>
                  <TextInput
                  value={hexColor}
                  placeholder="#FFFFFF"
                  style={{ color:GlobalColors.white, position:'absolute', bottom:-15, left:-20, fontSize:16 }}
                  maxLength={7}
                  onChangeText={(e)=>{
                    if(e.length === 0)  e = '#';
                    setHexColor(e);
                    if (myDevice && myDevice.isHexColor(e))  myDevice.MorseCode.setHexColor(e);     
                    else {
                      if(isHexColor(e)) setColor(e);
                    }         
                  }}/>
            </View>
          </View>
         
  </SafeAreaView>
  );
}
export default MorseCode;

const styles = StyleSheet.create({
    textBox:{
      padding: 10,
      borderColor: '#6e6e6e',
      backgroundColor: GlobalColors.darkBlue,
      color: GlobalColors.white,
      borderWidth: 1,
      marginTop: 10,
      height: '15%',
    }
})