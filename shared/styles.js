import { StyleSheet } from 'react-native';
import { GlobalColors } from '@shared/colors';

export const GlobalStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: GlobalColors.lightBlue,
      padding:20,
    },
    track: {
      height: 30,
      borderRadius: 1,
      backgroundColor: '#d5d8e8',
    },
    thumb: {
      width: 30,
      height: 30,
      borderRadius: 1,
      backgroundColor: '#ffffff',
      borderColor: GlobalColors.grey,
      borderWidth: 1, 
    },
    text:{
      color:GlobalColors.white,
      fontSize:15,
    },
    formRow: {
      flexDirection: 'row',
      height: 30,
    },
    formItem: {
      flex: 1,
    },
    formIcon: {
      width: 30,
      marginLeft: 10,
      justifyContent:'center',
      alignItems:'center'
    },
    buttonStyle:{
        height:35, width: 80,
        backgroundColor:GlobalColors.green, 
        justifyContent: 'center',
        alignItems:'center',
        marginRight:5,
        marginLeft:5   
    },
    input: {
      height: 35,
      borderWidth: 1,
      padding: 5,
      backgroundColor:GlobalColors.white,
      color: 'black',
      paddingHorizontal: 13,
      flex:1
    },
});