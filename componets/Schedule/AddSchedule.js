import React, { useState, useEffect, useContext, useRef, forwardRef } from 'react';
import { Text, View,Modal,TextInput, StyleSheet, TouchableHighlight } from 'react-native';
import { GlobalStyles } from '@shared/styles';
import { GlobalColors } from '@shared/colors';
import { GlobalIcons } from '../../shared/icons';
import ToggleButton from '../ToggleButton/ToggleButton';
import DatePicker from 'react-native-date-picker'
import SolidColor from '../SolidColor/SolidColor';
import ColorCycle from '../ColorCycle/ColorCycle';
import Breathing from '../Breathing/Breathing';
import MorseCode from '../MorseCode/MorseCode';
import { hexToColor_4, listtox4 } from '../Utils/ESPRGBUtils';


function NoParameters() {
    return(
        <View style={{width:'100%', flex:0.9, backgroundColor:GlobalColors.darkBlue, justifyContent:'center', alignItems:'center' }}>
            <Text style={GlobalStyles.text} >No parameters for this animation</Text>
        </View>
    )
}

function AddSchedule({visible,onCancel, myDevice , params}){
    const [label, setLabel] = useState(params?params.Label:'Schedule');
    const [date, setDate] = useState(params?new Date(params.Timestamp * 1000):new Date())
    const [Su, setSu] = useState(params?params.Days[0]:true);
    const [Mo, setMo] = useState(params?params.Days[1]:true);
    const [Tu, setTu] = useState(params?params.Days[2]:true);
    const [We, setWe] = useState(params?params.Days[3]:true);
    const [Th, setTh] = useState(params?params.Days[4]:true);
    const [Fr, setFr] = useState(params?params.Days[5]:true);
    const [Sa, setSa] = useState(params?params.Days[6]:true);
    const [animations, setAnimations] = useState(['Power Off', 'Power On' , 'Solid Color', 'Color Cycle', 'Breathing', 'Morse Code']);
    const [selected, setSelected] = useState(params?params.playingAnimation:'Power Off');
    const [currentIndex, setCurrentIndex] = useState(0);
    
    const currentRef = useRef();
    const navigate = ()=>{
        if(currentIndex==0) return (
            <View style={{width:'100%', flex:0.9, backgroundColor:GlobalColors.darkBlue, padding:30, justifyContent:'center', alignItems:'center' }}>
                <View style={{width:'85%', marginBottom:15}}>
                    <Text style={GlobalStyles.text}>Label</Text>
                    <View style={{width:'100%', height:35}} >  
                        <TextInput
                            style={{...GlobalStyles.input,fontSize:13}}
                            textStyle={{color:'black'}}
                            onChangeText={setLabel}
                            value={label}
                            placeholder="Label"
                        />
                    </View>
                </View>
                <DatePicker 
                    mode='time'
                    textColor={GlobalColors.white}
                    fadeToColor={GlobalColors.lightBlue}
                    date={date} 
                    onDateChange={setDate} />
                <View style={{flexDirection:'row', marginTop:15}}>
                    <View style={{marginLeft:10}}>
                        <Text style={GlobalStyles.text}>Su</Text>
                        <ToggleButton
                            icon={(Su)? GlobalIcons.squareOn:GlobalIcons.squareOff }
                            toggleColor={(Su)?GlobalColors.green:GlobalColors.white}
                            onPress={() => setSu(!Su)}
                            buttonStyle={{width:20,height:20, borderRadius:50, justifyContent: 'center', alignItems: 'center'}}
                            noText={true}
                        />
                    </View>
                <View style={{marginLeft:10}}>
                    <Text style={GlobalStyles.text}>Mo</Text>
                    <ToggleButton
                        icon={(Mo)? GlobalIcons.squareOn:GlobalIcons.squareOff }
                        toggleColor={(Mo)?GlobalColors.green:GlobalColors.white}
                        onPress={() => setMo(!Mo)}
                        buttonStyle={{width:20,height:20, borderRadius:50, justifyContent: 'center', alignItems: 'center'}}
                        noText={true}
                    />
                </View>
                <View style={{marginLeft:10}}>
                    <Text style={GlobalStyles.text}>Tu</Text>
                    <ToggleButton
                        icon={(Tu)? GlobalIcons.squareOn:GlobalIcons.squareOff }
                        toggleColor={(Tu)?GlobalColors.green:GlobalColors.white}
                        onPress={() => setTu(!Tu)}
                        buttonStyle={{width:20,height:20, borderRadius:50, justifyContent: 'center', alignItems: 'center'}}
                        noText={true}
                    />
                </View>
                <View style={{marginLeft:10}}>
                    <Text style={GlobalStyles.text}>We</Text>
                    <ToggleButton
                        icon={(We)? GlobalIcons.squareOn:GlobalIcons.squareOff }
                        toggleColor={(We)?GlobalColors.green:GlobalColors.white}
                        onPress={() => setWe(!We)}
                        buttonStyle={{width:20,height:20, borderRadius:50, justifyContent: 'center', alignItems: 'center'}}
                        noText={true}
                    />
                </View>
                <View style={{marginLeft:10}}>
                    <Text style={GlobalStyles.text}>Th</Text>
                    <ToggleButton
                        icon={(Th)? GlobalIcons.squareOn:GlobalIcons.squareOff }
                        toggleColor={(Th)?GlobalColors.green:GlobalColors.white}
                        onPress={() => setTh(!Th)}
                        buttonStyle={{width:20,height:20, borderRadius:50, justifyContent: 'center', alignItems: 'center'}}
                        noText={true}
                    />
                </View>
                <View style={{marginLeft:10}}>
                    <Text style={GlobalStyles.text}>Fr</Text>
                    <ToggleButton
                        icon={(Fr)? GlobalIcons.squareOn:GlobalIcons.squareOff }
                        toggleColor={(Fr)?GlobalColors.green:GlobalColors.white}
                        onPress={() => setFr(!Fr)}
                        buttonStyle={{width:20,height:20, borderRadius:50, justifyContent: 'center', alignItems: 'center'}}
                        noText={true}
                    />
                </View>
                <View style={{marginLeft:10}}>
                    <Text style={GlobalStyles.text}>Sa</Text>
                    <ToggleButton
                        icon={(Sa)? GlobalIcons.squareOn:GlobalIcons.squareOff }
                        toggleColor={(Sa)?GlobalColors.green:GlobalColors.white}
                        onPress={() => setSa(!Sa)}
                        buttonStyle={{width:20,height:20, borderRadius:50, justifyContent: 'center', alignItems: 'center'}}
                        noText={true}
                    />
                </View>
            </View>
        </View>
        )
        if(currentIndex==1) return (
            <View style={{width:'100%', flex:0.9, backgroundColor:GlobalColors.darkBlue, alignItems:'center' }}>
                {
                    animations.map((item,i)=>{
                        return(
                            <TouchableHighlight 
                                style={{ width:'100%', padding:10, backgroundColor: item == selected ? '#0078d7' : 'transparent' }} key={i} 
                                onPress={()=>setSelected(item)}>
                                <Text style={GlobalStyles.text}>{item}</Text>
                            </TouchableHighlight>
                        )
                    })
                }
            </View>
        )
        if(currentIndex==2) {      
            if(selected=='Solid Color') return (
                <View style={{width:'100%', padding:20 ,  flex:0.9, backgroundColor:GlobalColors.darkBlue, alignItems:'center' }}>
                    <SolidColor forwardedRef={currentRef} settings={params && params.parameters.SolidColor && params.parameters.SolidColor }/>
                </View>
            )
            else if(selected=='Color Cycle') return (
                <View style={{width:'100%', padding:20 ,  flex:0.9, backgroundColor:GlobalColors.darkBlue, alignItems:'center' }}>
                    <ColorCycle forwardedRef={currentRef} settings={params && params.parameters.ColorCycle && params.parameters.ColorCycle }/>
                </View>
            )
            else if(selected=='Breathing') return (
                <View style={{width:'100%', padding:20 ,  flex:0.9, backgroundColor:GlobalColors.darkBlue, alignItems:'center' }}>
                    <Breathing forwardedRef={currentRef} settings={params && params.parameters.Breathing && params.parameters.Breathing }/>
                </View>
            )
            else if(selected=='Morse Code') return (
                <View style={{width:'100%', padding:20 ,  flex:0.9, backgroundColor:GlobalColors.darkBlue, alignItems:'center' }}>
                    <MorseCode forwardedRef={currentRef} settings={params && params.parameters.MorseCode && params.parameters.MorseCode }/>
                </View>
            )
            else return <NoParameters/>
        }
    }
    const finishSchedule = ()=>{
        const newParam = {};
        if(selected=='Solid Color')
            newParam["SolidColor"] = {
                "Color":hexToColor_4(currentRef.current.color),
                "Brightness": currentRef.current.brightness[0].toFixed(3)
            }      
        else if(selected=='Color Cycle') newParam["ColorCycle"] = {"ColorCycleSpeed": currentRef.current.speed}
        else if(selected=='Breathing')
            newParam["Breathing"] = {
                "breathingSpeed": currentRef.current.speed,
                "colorListBreathing": listtox4(currentRef.current.colorList),
                "staticColorBreathing": hexToColor_4(currentRef.current.color),
                "useColorList": currentRef.current.useColorList,
            }
        else if(selected=='Morse Code')
            newParam["MorseCode"] = {
                "colorMorseCode": hexToColor_4(currentRef.current.color),
                "encodedMorseCode": currentRef.current.encodedText,
                "unitTimeMorseCode": currentRef.current.speed,
                "useBuzzer": currentRef.current.useBuzzer,
            }
            console.log(newParam)
        if(!params) myDevice.TimeSchedule.addSchedule(label,[Su,Mo,Tu,We,Th,Fr,Sa],date.getTime()/1000,selected,newParam);
        else myDevice.TimeSchedule.editSchedule(params.Timestamp,label,[Su,Mo,Tu,We,Th,Fr,Sa],date.getTime()/1000,selected,newParam);
        onCancel();
        
    }

    return(
        <Modal visible={visible} onRequestClose={onCancel}>
            <View style={{...GlobalStyles.container, justifyContent:'center', alignItems:'center' }} >
                <Text style={{...GlobalStyles.text, fontSize:17, marginBottom:10 }}>Time schedule</Text>
                {navigate()}         
                <View style={{flexDirection:'row', justifyContent:'center', marginTop:20}}>
                    <ToggleButton
                        noImage={true}
                        textStyle={{ color:GlobalColors.white,fontSize:13,fontWeight:'bold' }}
                        onPress={onCancel}
                        buttonStyle={{...GlobalStyles.buttonStyle, width: 80, height:40}}
                        text={'Cancel'}/>
                    <ToggleButton
                        disabled={currentIndex==0?true:false}
                        noImage={true}
                        textStyle={{ color:GlobalColors.white,fontSize:13,fontWeight:'bold' }}
                        onPress={()=>{if(currentIndex>0) setCurrentIndex(currentIndex-1);}}
                        buttonStyle={{...GlobalStyles.buttonStyle, width: 80, height:40}}
                        text={'Back'}/>
                    <ToggleButton
                        noImage={true}
                        textStyle={{ color:GlobalColors.white,fontSize:13,fontWeight:'bold' }}
                        onPress={()=>{
                            if(currentIndex<2) setCurrentIndex(currentIndex+1);
                            else finishSchedule();
                        }}
                        buttonStyle={{...GlobalStyles.buttonStyle, width: 80, height:40}}
                        text={currentIndex==2?'Finish':'Next'}/>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({


})

export default AddSchedule;