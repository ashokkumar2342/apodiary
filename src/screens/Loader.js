
import React, { Component } from 'react';
import { View, Text , TextInput,TouchableOpacity,StyleSheet,Alert,Picker,AsyncStorage} from 'react-native';
import MySqlConnection from 'react-native-my-sql-connection';
import Button from 'react-native-material-ui';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'; 
import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase({ name: 'VoterDatabase.db' });
var m_check = -1;
var m_time_count;
export class Loader extends Component {
    
	constructor(props) {
	   super(props);
	   this.state = { text: 'Useless Placeholder' };
		
		this.state = { 
      loading: true,
      userId:'',
      rootUrl:'',
      userdetails:[],  
      booth:[],      
      options:[],
      setSelectedValue:'',
      check:-1,
      timecount:0,
	}; 
  }
  
  check_app_users(){
    console.log("loader");
    db.transaction(function(txn) {  
      txn.executeSql(
        'SELECT count(*) as `total` FROM `app_users`',
        [],
        (tx, results) => { 
          m_check = results.rows.item(0).total;
        }
      ); 
        
    });
    setTimeout(() => {m_time_count=1;},500);
  }

  componentDidMount(){
    this.check_app_users();
    setTimeout(() => {if(m_check == 0){ 
        this.props.navigation.navigate('Login');
      }else if(m_check > 0){
        this.props.navigation.navigate('Dashboard');        
      }
      console.log(m_check);
    },500);
  }
  
	static navigationOptions={
		header :null
	}
	 setOptionValue = async (booth_id)=>{ 
        this.setState({ 
        setSelectedValue: booth_id
        })
    } 
	  
  render() {
    return (
      <View style={styles.container}>
          <Text>Loading</Text>  
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

export default Loader