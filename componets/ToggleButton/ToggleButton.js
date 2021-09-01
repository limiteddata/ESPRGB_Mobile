import React, { useState, Component } from 'react';
import { Button, StyleSheet, Text, View, ViewPropTypes, Alert ,Dimensions, TouchableHighlight, Image} from 'react-native';
import { GlobalColors } from '@shared/colors';

export default class ToggleButton extends Component{
    constructor(props){
      super(props)
    }
    render() {
      return (
        <TouchableHighlight 
            disabled={this.props.disabled}
            style={this.props.buttonStyle? this.props.buttonStyle : this.props.noText?styles.buttonNoText:styles.buttonWithText} 
            onPress={this.props.onPress} underlayColor='none' >
            <View style={[this.props.buttonStyle? this.props.buttonStyle : this.props.noText?styles.buttonNoText:styles.buttonWithText, {opacity:this.props.disabled ? 0.4:1.0}]}>
            {!this.props.noImage&&
            <Image resizeMode={'contain'} source={this.props.icon} style={this.props.noText?styles.imageWithNoText:styles.imageWithText}  fadeDuration={0} />}      
            {!this.props.noText&&<Text style={ this.props.textStyle? this.props.textStyle: [ styles.textStyle, {color:this.props.toggleColor}, ] }>{this.props.text}</Text> }
            </View>
        </TouchableHighlight>
      )
    }
}
 
const styles = StyleSheet.create({
	buttonWithText: {
        width:95, 
        minHeight: 100,  
        padding:5,
        backgroundColor: GlobalColors.grey, 
        alignItems:'center',
        margin:5
	},
  buttonNoText: {
      width:80, 
      minHeight: 80,  
      padding:10,
      backgroundColor: GlobalColors.grey, 
      alignItems:'center'
	},
  imageWithNoText:{
      width:'100%', 
      height:'100%',
      flex: 1,
      resizeMode:'contain'
  },
  imageWithText:{
    width:45, 
    height:45,
    resizeMode:'contain'
  },
  textStyle:{
      color:GlobalColors.white, 
      marginTop:10, 
      marginBottom:0,
      textAlign:'center'
  },
})
