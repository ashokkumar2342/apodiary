
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
        ward_no:0,
        print_srno:0,
        epic_no:'',
        route_source:2,
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
              <TextInput style={styles.inputBox} 
                  underlineColorAndroid='rgba(0,0,0,0)' 
                  placeholder="Enter Serial Number No"
                  placeholderTextColor = "#ffffff"
                  selectionColor="#fff"
                  keyboardType="numeric"
                  onChangeText={text=> this.setState({print_srno:text})}
                  />
                <TouchableOpacity style={styles.button} >
                 <Text style={styles.buttonText}  onPress={() => {  this.props.navigation.navigate('VotePoll',{serial_number:this.state.print_srno,ward_no:20,input_source:2}) }}>Go</Text>
                 
               </TouchableOpacity>  
          </View>

     
       

    )
  }

}

const styles = StyleSheet.create({
  container : {
    backgroundColor:'#455a64',
    flexGrow: 1,
    justifyContent:'center',
    alignItems: 'center'

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
  button: {
    width:300,
    backgroundColor:'#1c313a',
     borderRadius: 25,
      marginVertical: 10,
      paddingVertical: 13
  }, 
  buttonText: {
    fontSize:16,
    fontWeight:'500',
    color:'#ffffff',
    textAlign:'center'
  },
  buttonTextRight: {
    fontSize:16,
    fontWeight:'500',
    color:'#ffffff',
    textAlign:'right'
  }
});

export default SearchVoter