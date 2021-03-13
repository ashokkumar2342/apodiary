
import React, { Component } from 'react';
import { View, Text,KeyboardAvoidingView,Item ,Input ,ScrollView, TextInput,TouchableOpacity,StyleSheet,Linking,Alert,Picker,AsyncStorage} from 'react-native';
import MySqlConnection from 'react-native-my-sql-connection';
import Button from 'react-native-material-ui';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'; 
import { openDatabase } from 'react-native-sqlite-storage';
import Icon from 'react-native-vector-icons/FontAwesome'; 
import SmsRetriever from 'react-native-sms-retriever';
import DeviceInfo from 'react-native-device-info'; 
import { RNCamera } from 'react-native-camera';
import BarcodeMask from 'react-native-barcode-mask';
var db = openDatabase({ name: 'VoterDatabase.db' });

export class SearchVoter extends Component {
    
	constructor(props) {
	    super(props);
	    this.state = { text: 'Useless Placeholder' }; 
      this.state = { 
        loading: false, 
        userdetails:[],  
        result: 'No result',
        barcode: '',
        isBarcodeScannerEnabled: true,
        camera: {
        type: RNCamera.Constants.Type.back,
        flashMode: RNCamera.Constants.FlashMode.auto,
        }
          
          
      }; 
    
  }
   
  
  
  componentDidMount(){ 
  } 
   
	 showDetails = async ()=>{
    this.setState({
      loading: !this.state.loading,
      
     });
     const {name='',father_name='',serial_number=''}=this.state  
     var temps = []; 
      try{
          if (name !='' || father_name !='' || serial_number !='') {
            db.transaction(function(txn) {  
                txn.executeSql(
                  "SELECT * FROM voters",
                  [],
                  function(txt,res){  
                      console.log('query Completed')
                    var len = res.rows.length;
                    var temp = [];
                    if (len > 0) {
                        for (let i = 0; i < len; i++) {
                            temp.push(res.rows.item(i)); 
                        } 
                        temps =temp;   
                    }else{
                        alert('No record found');
                    } 
                  }
                );  
            });  
            setTimeout(() => { 
                 this.setState({ 
                loading:false,   
                userdetails: temps
                }) 
                console.log(this.state.userdetails[1])
            }, 100);
           
            
          }else{
              alert('Enter Details')
          } 
           
      }catch(err){
          
      }   
     
    };
   
    barcodeRecognized = () => {
      console.log('dd')
    };
  
     
    onBarCodeRead(scanResult) {
      
        if (scanResult.data != null) {
            if (this.state.isBarcodeScannerEnabled) {
                this.props.navigation.navigate('VotePoll',{serial_number:scanResult.data})
                this.setState({
                    isBarcodeScannerEnabled: false
                })
            }
        }
      
    }
    
    pendingView() {
      return (
        <View
          style={{
            flex: 1,
            backgroundColor: 'lightgreen',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text>Waiting</Text>
        </View>
      );
    }
 
    render() {
      return (
        <View style={styles.container}>
          <RNCamera
              ref={ref => {
                this.camera = ref;
              }}
              defaultTouchToFocus
              flashMode={this.state.camera.flashMode}
              mirrorImage={false}
              onBarCodeRead={this.onBarCodeRead.bind(this)}
              onFocusChanged={() => {}}
              onZoomChanged={() => {}}
            //   permissionDialogTitle={'Permission to use camera'}
            //   permissionDialogMessage={'We need your permission to use your camera phone'}
              style={styles.preview}
              type={this.state.camera.type}  
          />
          <View style={[styles.overlay, styles.topOverlay]}>
          <Text style={styles.scanScreenMessage}>Please scan the barcode.</Text>
        </View>
        <View style={[styles.overlay, styles.bottomOverlay]}>
            <TextInput style={styles.inputBox} 
                underlineColorAndroid='rgba(0,0,0,0)' 
                placeholder="Enter Serial No"
                placeholderTextColor = "#ffffff"
                selectionColor="#fff"
                keyboardType="numeric"
                onChangeText={text=> this.setState({serial_number:text})}
                />
            <TouchableOpacity style={styles.button} >
            <Text
            onPress={() => {  this.props.navigation.navigate('VotePoll',{serial_number:this.state.serial_number}) }}
            style={styles.enterBarcodeManualButton}
            title="Go"
           >Submit</Text>
                
                
            </TouchableOpacity>      
        </View>
        </View>
      );
   }
}

const styles = {
  container: {
    flex: 1
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center', 
  },
  overlay: {
    position: 'absolute',
    padding: 16,
    right: 0,
    left: 0,
    alignItems: 'center'
  },
  topOverlay: {
    top: 0,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  bottomOverlay: {
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  enterBarcodeManualButton: {
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 40
  },
  scanScreenMessage: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonInput: {
    width:300,
    backgroundColor:'rgba(255, 255,255,0.2)',
    borderRadius: 25,
    marginVertical: 10,
	  paddingVertical: 13,
	  color:'#ffffff',
  },
  inputBox: {
    width:300,
    backgroundColor:'rgba(255, 255,255,0.2)',
    borderRadius: 25,
    paddingHorizontal:16,
    fontSize:16,
    color:'#ffffff',
    marginVertical: 10
  },
  buttonText: {
    fontSize:16,
    fontWeight:'500',
    color:'#ffffff',
    textAlign:'center'
  },
};

export default SearchVoter