
import React, { Component  } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DeviceContext } from './componets/DeviceContext';
import Navigation from './componets/Navigation/Navigation';

class App extends Component {
  state = {
    devices: [],
    saveDevices: (_devices, callback) => {
      this.setState({devices:_devices}, callback);
      AsyncStorage.setItem('devices', JSON.stringify( _devices ));
    },
    loaded:false
  }

  constructor(props){
    super(props)
  }

  async UNSAFE_componentWillMount(){
    try {
      const savedDevices = await AsyncStorage.getItem('devices');
      this.setState({ devices: savedDevices ? JSON.parse(savedDevices) : []}, ()=> this.setState({ loaded: true}) )
    } 
    catch (error) { console.log(error) }
  }

  render(){ 
    return(
        this.state.loaded&&
        <DeviceContext.Provider value={this.state} >
          <Navigation/> 
        </DeviceContext.Provider>
    );
  }
}

export default App;