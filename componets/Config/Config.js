import React, { useState, useEffect, } from 'react';
import { View, SafeAreaView, TextInput, StyleSheet, Text, ScrollView, Alert } from 'react-native';
import { GlobalStyles } from '@shared/styles';
import { GlobalColors } from '@shared/colors';
import ToggleButton from '../ToggleButton/ToggleButton';
import { GlobalIcons } from '../../shared/icons';
import { useNavigation } from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker';
import { AutocompleteDropdown } from "react-native-autocomplete-dropdown"
const ESPRGB = require('esprgb_libjs');


const showConfirmDialog = (message,callback) => {
    return Alert.alert("Are your sure?", message,[{text: "Yes",onPress: () => callback()},{text: "No"}]);
};
var myDevice;
export default function Config({ipaddress,currentSSID,notConfigured}){
    const navigation = useNavigation();
    const [dropdata, setDropdata] = useState();

    const [SSID, setSSID] = React.useState("");
    const [Password, setPassword] = React.useState("");
    const [Hostname, setHostname] = React.useState("");

    const [RedPin, setRedPin] = React.useState(0);
    const [GreenPin, setGreenPin] = React.useState(0);
    const [BluePin, setBluePin] = React.useState(0);
    const [BuzzerPin, setBuzzerPin] = React.useState(0);

    const [UseStatic, setUseStatic] = React.useState(false);

    const [IPAddress, setIPAddress] = React.useState("");
    const [Gateway, setGateway] = React.useState("");
    const [Subnet, setSubnet] = React.useState("");
    const [DNS, setDNS] = React.useState("");
    const [openRed, setOpenRed] = useState(false);
    const [openGreen, setOpenGreen] = useState(false);
    const [openBlue, setOpenBlue] = useState(false);
    const [openBuzzer, setOpenBuzzer] = useState(false);
    const [passwordEnable, setPasswordEnable] = useState(true);
    const [items, setItems] = useState([0,1,2,3,4,5,12,13,14,15].map(e=>{return {label: e.toString(), value: e}}));

    const required = [
        {name:"SSID", value:SSID, enabled:true},
        {name:"Password", value:Password, enabled: passwordEnable},
        {name:"Hostname", value:Hostname, enabled:true},
        {name:"Red Pin", value:RedPin, enabled:true},
        {name:"Green Pin", value:GreenPin, enabled:true} ,
        {name:"Blue Pin", value:BluePin, enabled:true},
        {name:"Buzzer Pin", value:BuzzerPin, enabled:true},
        {name:"IPAddress", value:IPAddress, enabled:UseStatic},
        {name:"Gateway", value:Gateway, enabled:UseStatic} ,
        {name:"Subnet", value:Subnet, enabled:UseStatic},
        {name:"DNS", value:DNS, enabled:UseStatic}
    ];
    const closeDropList = (setFunction, value)=>{
        setOpenRed(false);
        setOpenGreen(false);
        setOpenBlue(false);
        setOpenBuzzer(false);
        setFunction(value);
    }

    useEffect(()=>{
        setSSID(currentSSID);
        myDevice = new ESPRGB(ipaddress);
        if(!notConfigured)
        myDevice.getCurrentConfig().then((data)=>{
            if(data.Initialized){
                setSSID(data.SSID);
                setPassword(data.PASSWORD);
                setHostname(data.HOSTNAME.split('-')[1]);
                setRedPin(data.REDPIN);
                setGreenPin(data.GREENPIN);
                setBluePin(data.BLUEPIN);
                setBuzzerPin(data.BUZZERPIN);
                setUseStatic(data.startStatic);
                setIPAddress(data.local_IP);
                setGateway(data.gateway);
                setSubnet(data.subnet);
                setDNS(data.dns);
                if(data.PASSWORD === "") setPasswordEnable(false);
            }
        })

        myDevice.getAllWifi().then(e=>{
            setDropdata( e.networks.map((element,i) => {
              return{
                id:i, 
                title: element[0],
                description:`Strength:${element[1]}dBm, Secured:${element[2]}`,
                SSID: element[0],
                RSSI: element[1],
                Secured: element[2]
              }
            }))
        });
    },[])
    

    return(
    <SafeAreaView style={ { backgroundColor:GlobalColors.lightBlue , paddingHorizontal:15, paddingTop:15,flex:1 } }>    
        <ScrollView  >
            {/* Credentials */}
            <View style={{alignItems:'center'}}>
                <Text style={{...GlobalStyles.text, fontSize:18}}>Wifi credentials</Text>
                <View style={styles.group} >
                    <Text style={styles.label}>SSID:</Text>
                    <View style={GlobalStyles.formItem}>
                            <AutocompleteDropdown
                                clearOnFocus={false}
                                closeOnSubmit={true}
                                showChevron={true}
                                showClear={true}
                                value={SSID}
                                onSelectItem={(item) =>{
                                    if(item !== null){
                                        setSSID(item.SSID) 
                                        setPasswordEnable(item.Secured);
                                    }
                                }}
                                onChangeText={(e) => {
                                    setSSID(e)
                                    setPassword('');
                                }}
                                onClear={()=>{
                                    setSSID('');
                                    setPassword('');
                                    setPasswordEnable(true);
                                }}
                                dataSet={dropdata}
                                textInputProps={{
                                    placeholder: "SSID",
                                    autoCorrect: false,
                                    autoCapitalize: "none",
                                    style:{
                                        fontSize:13,
                                        borderRadius:0,
                                        height:35,
                                        backgroundColor:GlobalColors.white,
                                        color:'black'
                                    }
                                }}
                                rightButtonsContainerStyle={{ backgroundColor: GlobalColors.white }}
                                suggestionsListContainerStyle={{ backgroundColor: GlobalColors.white }}
                                inputContainerStyle={{
                                    borderRadius: 0,
                                    height:35,
                                    borderWidth:1,
                                    borderColor:'black'
                                }}
                                inputHeight={35}/>
                    </View>
                </View>
                {
                passwordEnable &&
                <View style={styles.group} >
                    <Text style={styles.label}>Password:</Text>
                    <TextInput
                    placeholder="Password" 
                    secureTextEntry={true} 
                    style={GlobalStyles.input}
                    onChangeText={setPassword}
                    value={Password}
                    editable={passwordEnable}
                    />
                </View>
                } 
            </View>   
            {/* device details */}
            <View style={{alignItems:'center'}}>
                <Text style={{...GlobalStyles.text, fontSize:18, margin:5}}>Device details</Text>
                <View style={styles.group} >
                    <Text style={{...GlobalStyles.text, fontSize:16, width:140}}>Hostname:  esprgb-</Text>
                    <TextInput placeholder="Hostname" style={GlobalStyles.input} onChangeText={setHostname} value={Hostname}/>
                </View>           
                <View style={styles.group} >
                    <Text style={styles.label}>Red pin:</Text>
                    <DropDownPicker
                        listMode="SCROLLVIEW"
                        open={openRed}
                        value={RedPin}
                        items={items}
                        setOpen={ () => closeDropList(setOpenRed,!openRed) }
                        setValue={setRedPin}
                        setItems={setItems}
                        style={{height:35, width:100}}
                        containerStyle={{ width:100 }}
                        zIndex={40}/>
                <ToggleButton
                noImage={true}
                textStyle={{ color:GlobalColors.white,fontSize:14,}}
                onPress={()=>myDevice.testPin(RedPin)}
                buttonStyle={{height:35, width: 70, padding:10, 
                    backgroundColor:GlobalColors.green, 
                    justifyContent: 'center', 
                    alignItems:'center',
                    marginRight:10,
                    marginLeft:10
                    }}
                text={'TEST'}/>
                </View>
                <View style={styles.group} >
                    <Text style={styles.label}>Green pin:</Text>
                    <DropDownPicker
                        listMode="SCROLLVIEW"
                        open={openGreen}
                        value={GreenPin}
                        items={items}
                        setOpen={() => closeDropList(setOpenGreen,!openGreen)}
                        setValue={setGreenPin}
                        setItems={setItems}
                        style={{height:35, width:100}}
                        containerStyle={{ width:100 }}
                        zIndex={30}/>
                <ToggleButton
                noImage={true}
                textStyle={{ color:GlobalColors.white,fontSize:14,}}
                onPress={()=>myDevice.testPin(GreenPin)}
                buttonStyle={{height:35, width: 70, padding:10, 
                    backgroundColor:GlobalColors.green, 
                    justifyContent: 'center', 
                    alignItems:'center',
                    marginRight:10,
                    marginLeft:10
                    }}
                text={'TEST'}/>
                </View>
                <View style={styles.group} >
                    <Text style={styles.label}>Blue pin:</Text>
                    <DropDownPicker
                        listMode="SCROLLVIEW"
                        open={openBlue}
                        value={BluePin}
                        items={items}
                        setOpen={() => closeDropList(setOpenBlue,!openBlue)}
                        setValue={setBluePin}
                        setItems={setItems}
                        zIndex={20}
                        style={{height:35, width:100}}
                        containerStyle={{ width:100 }}/>
                <ToggleButton
                noImage={true}
                textStyle={{ color:GlobalColors.white,fontSize:14,}}
                onPress={()=>myDevice.testPin(BluePin)}
                buttonStyle={{height:35, width: 70, padding:10, 
                    backgroundColor:GlobalColors.green, 
                    justifyContent: 'center', 
                    alignItems:'center',
                    marginRight:10,
                    marginLeft:10
                    }}
                text={'TEST'}/>
                </View>
                <View style={styles.group} >
                    <Text style={styles.label}>Buzzer pin:</Text>
                    <DropDownPicker
                        listMode="SCROLLVIEW"
                        open={openBuzzer}
                        value={BuzzerPin}
                        items={items}
                        setOpen={()=>closeDropList(setOpenBuzzer,!openBuzzer)}
                        setValue={setBuzzerPin}
                        setItems={setItems}
                        zIndex={10}
                        zIndexInverse={1000}
                        style={{height:35, width:100}}
                        containerStyle={{ width:100 }}/>
                <ToggleButton
                noImage={true}
                textStyle={{ color:GlobalColors.white,fontSize:14,}}
                onPress={()=>myDevice.testPin(BuzzerPin)}
                buttonStyle={{height:35, width: 70, padding:10, 
                    backgroundColor:GlobalColors.green, 
                    justifyContent: 'center', 
                    alignItems:'center',
                    marginRight:10,
                    marginLeft:10
                    }}
                text={'TEST'}/>
                </View>
            </View>
            {/* static ipaddress */}
            <View style={{alignItems:'center', marginTop:5}}>
                <View style={{...styles.group, margin:5}} >
                    <Text style={{...GlobalStyles.text, marginRight:10}}>Static ipaddress (optional)</Text>
                    <ToggleButton
                    icon={(UseStatic)? GlobalIcons.checkboxOn:GlobalIcons.checkboxOff }
                    toggleColor={(UseStatic)?GlobalColors.green:GlobalColors.white}
                    onPress={() => setUseStatic(!UseStatic) }
                    buttonStyle={{width:25,height:25, borderRadius:50, justifyContent: 'center', alignItems: 'center'}}
                    noText={true}
                    />
                </View>
                {
                    UseStatic && 
                    <>
                        <View style={styles.group} >
                            <Text style={styles.label}>IPAddress:</Text>
                            <TextInput placeholder="192.168.1.50" style={GlobalStyles.input} onChangeText={setIPAddress} value={IPAddress}/>
                        </View>
                        <View style={styles.group} >
                            <Text style={styles.label}>Gateway:</Text>
                            <TextInput placeholder="192.168.1.1" style={GlobalStyles.input} onChangeText={setGateway} value={Gateway}/>
                        </View>
                        <View style={styles.group} >
                            <Text style={styles.label}>Subnet:</Text>
                            <TextInput placeholder="255.255.255.0" style={GlobalStyles.input} onChangeText={setSubnet} value={Subnet}/>
                        </View>
                        <View style={styles.group} >
                            <Text style={styles.label}>DNS:</Text>
                            <TextInput placeholder="8.8.8.8" style={GlobalStyles.input} onChangeText={setDNS} value={DNS}/>
                        </View>
                    </>
                }
            </View>
            {/* send buttons */}
            <View style={{alignItems:'center', marginTop:20, marginBottom:100}}>
                <View style={styles.group} >
                <ToggleButton
                    noImage={true}
                    textStyle={{ color:GlobalColors.white,fontSize:16,fontWeight:'bold'}}
                    onPress={()=>{
                        for (let i = 0; i < required.length; i++) {
                            if(required[i].enabled && required[i].value==='' ) 
                                return alert(`${required[i].name} required`);
                        }
                        const data ={
                            ESP_Config:{
                                HOSTNAME: `esprgb-${Hostname}`,
                                SSID: SSID,
                                PASSWORD: Password,
                                REDPIN: RedPin,
                                GREENPIN: GreenPin,
                                BLUEPIN: BluePin,
                                BUZZERPIN: BuzzerPin
                            },
                            Network_Config:{
                                startStatic: UseStatic,
                                local_IP: IPAddress,
                                gateway: Gateway,
                                subnet: Subnet,
                                dns: DNS
                            }
                        };
                        showConfirmDialog('Are you sure you want to save this config?',()=>{
                            myDevice.sendConfig(data);                     
                            navigation.goBack();
                        });
                    }}
                    buttonStyle={{height:35, width: 80, 
                        backgroundColor:GlobalColors.green, 
                        justifyContent: 'center', 
                        alignItems:'center',
                        marginRight:5,
                        marginLeft:5
                        }}
                    text={'Send'}/>
                <ToggleButton
                    noImage={true}
                    textStyle={{ color:GlobalColors.white,fontSize:16,fontWeight:'bold'}}
                    onPress={()=>navigation.goBack()}
                    buttonStyle={{height:35, width: 80,
                        backgroundColor:GlobalColors.green, 
                        justifyContent: 'center',
                        alignItems:'center',
                        marginRight:5,
                        marginLeft:5
                        }}
                    text={'Close'}/>
                </View>
            </View>
        </ScrollView>
    </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    group:{
        flexDirection:'row', 
        alignItems:'center',
        marginTop:10
    },
    label:{
        ...GlobalStyles.text, 
        fontSize:16, 
        marginRight:20, 
        width:80
    },
});
  