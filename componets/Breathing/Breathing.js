import React, { useState, useEffect } from 'react';
import { Text, View, TextInput, SafeAreaView } from 'react-native';
import { GlobalStyles } from '@shared/styles';
import { GlobalColors } from '@shared/colors';
import ToggleButton from '../ToggleButton/ToggleButton';
import ColorPicker from 'react-native-wheel-color-picker'
import Slider from "react-native-sliders";
import { GlobalIcons } from '../../shared/icons';
import  { hexToColor, rgbToHex_4, listfromx4, isHexColor }  from '../Utils/ESPRGBUtils'

function Breathing ({myDevice,forwardedRef,settings}) {
  const [color,setColor] = useState(settings?rgbToHex_4(settings.staticColorBreathing):"#ffffff");
  const [hexColor,setHexColor] = useState(settings?rgbToHex_4(settings.staticColorBreathing):"#ffffff");
  const [startAnimation, setStartAnimation] = useState(false);
  const [useColorList, setUseColorList] = useState(settings?settings.useColorList:false);
  const [speed,setSpeed] = useState(settings?settings.breathingSpeed:50);
  const [colorList, setColorList] = useState(settings?listfromx4(settings.colorListBreathing):[]);

  useEffect(() => {
    if(myDevice){
      myDevice.Breathing.on('Speed:change', (e)=> setSpeed(e.Speed));
      myDevice.Breathing.on('useColorList:change', (e)=> setUseColorList(e.useColorList) );
      myDevice.Breathing.on('StaticColor:change', (e)=>{ 
        setColor(e.Hex); 
        setHexColor(e.Hex);
      });
      myDevice.Breathing.on('colorList:change', (e)=> setColorList(e.colorList) );
      myDevice.on('playingAnimation:change', (e)=> setStartAnimation(e.playingAnimation === "Breathing") );
    }
  }, []);
  if(forwardedRef){
    useEffect(()=>{
      forwardedRef.current = {
          speed:speed,
          color:color,
          colorList:colorList,
          useColorList:useColorList,
      }
    })
  }
  return (
      <View style={myDevice&&{...GlobalStyles.container}}>
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
                minimumValue={1}
                maximumValue={200}
                value={speed}
                onValueChange={(value) => {
                  value = parseInt(value);
                  if(myDevice) myDevice.Breathing.setSpeed(value);  
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
                  if(myDevice) myDevice.playAnimation('Breathing',!startAnimation);
                }}
                buttonStyle={{width:30,height:30, borderRadius:50, justifyContent: 'center', alignItems: 'center'}}
                noText={true}/>
            </View>
            }
          </View>

          <View style={{flexDirection: 'row', justifyContent: "flex-end", alignItems:'center', height:30, marginTop:10}} >
              <Text style={{...GlobalStyles.text, marginRight: 10 }}>Speed: {speed}</Text>
            <Text style={GlobalStyles.text} >Use Color List</Text>
            <View style={GlobalStyles.formIcon}>
            <ToggleButton
              icon={(useColorList)? GlobalIcons.checkboxOn:GlobalIcons.checkboxOff }
              toggleColor={(useColorList)?GlobalColors.green:GlobalColors.white}
              onPress={() => {
                setUseColorList(!useColorList);
                if(myDevice) myDevice.Breathing.setUseColorList(!useColorList);
              }}
              buttonStyle={{width:25,height:25, borderRadius:50, justifyContent: 'center', alignItems: 'center'}}
              noText={true}/>
            </View>
          </View>

          <View>
            <View style={{ flexDirection:'row',  height:30, marginTop:10, backgroundColor:GlobalColors.darkBlue }} >
              { colorList.map((element,i) => {
                return <View key={i} style={{flex:1, backgroundColor:`rgb(${element[0]},${element[1]},${element[2]})`, borderWidth:0.4, borderColor:'black'  }}></View>
              })}
            </View>
            <View style={{ flexDirection:'row', justifyContent: 'flex-end', marginTop:10 }}>
              <ToggleButton
                noImage={true}
                textStyle={{ color:GlobalColors.white,fontSize:17,fontWeight:'bold' }}
                onPress={() => {
                  if(myDevice){
                    const newColor = myDevice.hexToColor(color);
                    myDevice.Breathing.addColortoList(newColor.r, newColor.g, newColor.b);
                  }else setColorList(prev=>[...prev, hexToColor(color)]);
                }}
                buttonStyle={{width:30,height:30, backgroundColor:GlobalColors.green, justifyContent: 'center', alignItems: 'center'}}
                text={'+'}/>
              <ToggleButton
                noImage={true}
                onPress={() => { 
                  if(myDevice) myDevice.Breathing.removeLastfromList() 
                  else setColorList(colorList.slice(0, -1));
                }}
                buttonStyle={{width:30,height:30, marginRight:10,marginLeft:10, backgroundColor:GlobalColors.red, justifyContent: 'center', alignItems: 'center'}}
                textStyle={{ color:GlobalColors.white, fontSize:17, fontWeight:'bold' }}
                text={'-'}/>
              <ToggleButton
                noImage={true}
                onPress={() => { 
                  if(myDevice) myDevice.Breathing.clearList() 
                  else setColorList([]);
                }}
                buttonStyle={{width:30,height:30, backgroundColor:GlobalColors.aquaBlue, justifyContent: 'center', alignItems: 'center'}}
                textStyle={{color:GlobalColors.white, fontSize:17,fontWeight:'bold'}}
                text={'C'}/>
            </View>
          </View>
          
          <View style={{ alignItems:'center', marginTop: 20}}>
            <View style={{ width:300,  height:300 }}>
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
                    if(myDevice) myDevice.Breathing.setHexColor(_color);            
                  }}/>
                  <TextInput
                  value={hexColor}
                  placeholder="#FFFFFF"
                  style={{ color:GlobalColors.white, position:'absolute', bottom:-15, left:0, fontSize:16 }}
                  maxLength={7}
                  onChangeText={(e)=>{
                    if(e.length === 0)  e = '#';
                    setHexColor(e);
                    if (myDevice && myDevice.isHexColor(e)) myDevice.Breathing.setHexColor(e);
                    else {
                      if(isHexColor(e)) setColor(e);
                    }
                  }}/>
            </View>
          </View>
        </View>
  );
}

export default Breathing;