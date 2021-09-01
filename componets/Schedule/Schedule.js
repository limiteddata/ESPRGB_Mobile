import React, { useEffect, useState } from 'react';
import { View, SafeAreaView, Text, Modal, ScrollView, StyleSheet } from 'react-native';
import { GlobalStyles } from '@shared/styles';
import { GlobalColors } from '@shared/colors';
import ToggleButton from '../ToggleButton/ToggleButton';
import { GlobalIcons } from '../../shared/icons';
import ToggleSwitch from 'toggle-switch-react-native'
import AddSchedule from './AddSchedule';


const ScheduleItem = ({device, item})=>{
  const [enable, setEnable] = useState(item.enable);
  const time = new Date(item.Timestamp * 1000);
  const [showAddNew, setShowAddNew ] = useState(false);
  useEffect(()=>setEnable(item.enable));

  return(
      <View style={{flexDirection:'row', height:60, backgroundColor:GlobalColors.lightBlue, marginBottom:20, paddingRight:5}}>
          <View style={{flexDirection:'row'}}>
            <ToggleButton
                noImage={true}
                textStyle={{ color:GlobalColors.white,fontSize:15,fontWeight:'bold' }}
                onPress={()=>device.TimeSchedule.Remove(item.Timestamp)}
                buttonStyle={{justifyContent: 'center',alignItems:'center', backgroundColor:GlobalColors.lightRed,width:20, height:'100%'}}
                text={'X'}/>
            <ToggleButton
                noText={true}
                icon={GlobalIcons.gear}
                textStyle={{ color:GlobalColors.white,fontSize:15,fontWeight:'bold' }}
                onPress={()=>setShowAddNew(true)}
                buttonStyle={{justifyContent: 'center',alignItems:'center',backgroundColor:GlobalColors.grey,width:20, height:'100%', padding:5}}
                />
          </View>
          <View style={{height:'100%', justifyContent:'center', marginLeft:5, marginRight:5}} >
            <Text style={{...GlobalStyles.text, fontSize:22}}>{("0"+time.getHours()).slice(-2)}:{("0"+time.getMinutes()).slice(-2)}</Text>
          </View>
          <View style={{width:80 ,height:'100%', justifyContent:'center'}} >
            <Text style={{...GlobalStyles.text, fontSize:13, fontWeight:'bold'}} numberOfLines={1}>{item.Label}</Text>
            <Text style={{...GlobalStyles.text, fontSize:10}}>{item.playingAnimation}</Text>
          </View>
          <View style={{flex:1, flexDirection:'row', flexWrap: 'wrap', alignContent:'center',}}>
            <Text style={{...styles.daysStyle, color:item.Days[0]?GlobalColors.green:GlobalColors.white}}>Su</Text>
            <Text style={{...styles.daysStyle,color:item.Days[1]?GlobalColors.green:GlobalColors.white}}>Mo</Text>
            <Text style={{...styles.daysStyle,color:item.Days[2]?GlobalColors.green:GlobalColors.white}}>Tu</Text>
            <Text style={{...styles.daysStyle,color:item.Days[3]?GlobalColors.green:GlobalColors.white}}>We</Text>
            <Text style={{...styles.daysStyle,color:item.Days[4]?GlobalColors.green:GlobalColors.white}}>Th</Text>
            <Text style={{...styles.daysStyle,color:item.Days[5]?GlobalColors.green:GlobalColors.white}}>Fr</Text>
            <Text style={{...styles.daysStyle,color:item.Days[6]?GlobalColors.green:GlobalColors.white}}>Sa</Text>
          </View>
          <ToggleSwitch
            isOn={enable}
            onColor={GlobalColors.green}
            offColor="#cccccc"
            animationSpeed={200}
            onToggle={isOn => {
              setEnable(isOn);
              device.TimeSchedule.EnableSchedule(item.Timestamp,isOn)
            }}/>
          {
            showAddNew&&
            <AddSchedule 
              myDevice={device}
              visible={showAddNew} 
              onCancel={()=>setShowAddNew(false)}
              params={item}
            />
          }
      </View>
  )
}

const Schedule = ({myDevice}) => {
  const [enable, setEnable] = useState(false);
  const [schedules, setSchedules ] = useState([]);
  const [showAddNew, setShowAddNew ] = useState(false);
  useEffect(() => {
    if(myDevice){
      myDevice.TimeSchedule.on('Enabled:change', (e)=>setEnable(e.Enabled) );
      myDevice.TimeSchedule.on('Schedules:change', (e)=> setSchedules(e.Schedules));
    }
  },[])
  return (
    <SafeAreaView style={ GlobalStyles.container }>
        <Text style={{...GlobalStyles.text, fontSize:16 }} >Time schedule:</Text>
        <ScrollView style={{flex:1, padding:15, backgroundColor:GlobalColors.darkBlue, marginBottom: 15}}>
          { schedules.map((item,i)=> <ScheduleItem key={i} device={myDevice} item={item} />) }
        </ScrollView>
        <View style={{ alignItems:'center', flexDirection:'row' }}>
        <ToggleSwitch
            isOn={enable}
            onColor={GlobalColors.green}
            offColor="#cccccc"
            label="Enable"
            labelStyle={{ color: "white", fontWeight: "900", fontSize:17 }}
            size="medium"
            animationSpeed={200}
            onToggle={isOn => {
              setEnable(isOn);
              myDevice.TimeSchedule.enable(isOn)
            }}
          />
          <ToggleButton
              noImage={true}
              textStyle={{ color:GlobalColors.white,fontSize:13,fontWeight:'bold' }}
              onPress={()=>setShowAddNew(true)}
              buttonStyle={{...GlobalStyles.buttonStyle, width: 80, height:40}}
              text={'ADD NEW'}/>
          </View>
          { showAddNew && <AddSchedule myDevice={myDevice} onCancel={()=> setShowAddNew(false)}/> }
    </SafeAreaView>
  );
}

export default Schedule;


const styles = StyleSheet.create({
  daysStyle:{
    fontSize:10,
    marginRight:2
  }
});