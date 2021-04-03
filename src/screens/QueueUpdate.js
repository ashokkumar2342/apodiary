
import React, { Component } from 'react';
import { View, Text , TextInput,TouchableOpacity,StyleSheet,Alert,Picker,AsyncStorage} from 'react-native';
import MySqlConnection from 'react-native-my-sql-connection';
import Button from 'react-native-material-ui';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'; 
import SmsRetriever from 'react-native-sms-retriever';
import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase({ name: 'VoterDatabase.db' });

let config = {
    host:'162.214.94.136',
    database:'eageskoo_apodairy',
    user:'eageskoo_1',
    password:'Ashok@2342', 
    };
export class QueueUpdate extends Component {
    
	constructor(props) {
	   super(props);
	   this.state = { text: 'Useless Placeholder' };
		
		this.state = { 
      loading: true,
      s_in_queue:0,
	}; 
  }
  
  componentDidMount(){     
    // let check ='';
    // db.transaction(function(txn) {  
    //           txn.executeSql(
    //             'SELECT count(*) as total FROM voters',
    //             [],
    //             function(txt,res){ 
    //                 check= res.rows.item(0).total 
    //                 console.log('ok')
    //             }
    //           ); 
        
    //   }); 
    // setTimeout(() => { 
    //     if(check == 0){ 
    //         console.log(check)
    //     } else{
    //     this.props.navigation.navigate('Dashboard'); 
            
    //     }
    // }, 100) 
  }
  
	static navigationOptions={
		header :null
	}
	  
	 
 
	onvotersinqueuePressed = async () => {
    console.log("ok");    
    };

  render() {
      return (
        <View style={styles.container}>
          <TextInput style={styles.inputBox} 
            underlineColorAndroid='rgba(0,0,0,0)' 
            placeholder="Enter Voters in Queue"
            placeholderTextColor = "#ffffff"
            selectionColor="#fff"
            keyboardType="numeric"
            onChangeText={text=> this.setState({s_in_queue:text})}
          />
          <TouchableOpacity style={styles.button} >
            <Text style={styles.buttonText}  onPress={() => this.onvotersinqueuePressed()}>Update</Text>   
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
  },
   buttonInput: {
    width:300,
    backgroundColor:'rgba(255, 255,255,0.2)',
    borderRadius: 25,
    marginVertical: 10,
      paddingVertical: 13,
      color:'#ffffff',
  }
});

export default QueueUpdate