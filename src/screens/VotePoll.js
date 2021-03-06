
import React, { Component } from 'react';
import { View, Switch, Text ,ScrollView, TextInput,TouchableOpacity,StyleSheet,Linking,Alert,Picker,AsyncStorage} from 'react-native';
import MySqlConnection from 'react-native-my-sql-connection';
import Button from 'react-native-material-ui';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'; 
import { openDatabase } from 'react-native-sqlite-storage';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import Icon from 'react-native-vector-icons/FontAwesome'; 
var db = openDatabase({ name: 'VoterDatabase.db' }); 
export class VotePoll extends Component {
    
	constructor(props) {
	    super(props);
	    this.state = { text: 'Useless Placeholder' }; 
		this.state = { 
        loading: true, 
        userdetails:[],  
        id:props.route.params.id,  
        vote_polled:props.route.params.vote_polled,  
        favour_status:props.route.params.favour_status, 
       
	}; 
  }
  
  componentDidMount(){   
  }
   
    isVotePolled = async ()=>{ 
        const {id}=this.state 
        if(this.state.vote_polled==0){
            this.setState({vote_polled:1})
            db.transaction(function(txn) {   
                txn.executeSql(
                  "UPDATE voters  set vote_polled =? WHERE id =?",
                  [1,id],
                  function(txt,res){  
                      console.log(id)
                    if(res.rowsAffected>0){
                        alert('Updated successfully'); 
                         
                      }else{
                        alert('Updation Failed');
                      }   
                      
                  }
                );  
            }); 
        }else{
            this.setState({vote_polled:0})
            db.transaction(function(txn) {   
                txn.executeSql(
                  "UPDATE voters  set vote_polled =? WHERE id =?",
                  [0,id],
                  function(txt,res){  
                    if(res.rowsAffected>0){
                        alert('Updated successfully'); 
                         
                      }else{
                        alert('Updation Failed');
                      }   
                      
                  }
                );  
            }); 
        }
        
    };
    setFavourStatus = async (value)=>{ 
        const {id}=this.state  
        this.setState({favour_status:value})
        db.transaction(function(txn) {   
            txn.executeSql(
              "UPDATE voters  set favour_status =? WHERE id =?",
              [value,id],
              function(txt,res){  
                  console.log(id)
                if(res.rowsAffected>0){
                    alert('Updated successfully'); 
                     
                  }else{
                    alert('Updation Failed');
                  }   
                  
              }
            );  
        });
    };
	  
    
	 
  render() {
    var radio_props = [
        {label: 'Pending', value: 0 },
        {label: 'Yes', value: 1 },
        {label: 'No', value: 2 },
        {label: 'Not Decided', value: 3 }
      ]; 
    return (
      <View style={styles.container}>  
            <View style={styles.textPoll}>
            <Text style={styles.TextBold}>
                Vote Polled   
            </Text>
            <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={1 ? "#f5dd4b" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => this.isVotePolled()}
            value={this.state.vote_polled ==1 ?true:false}
            />
            </View>
          
            <View style={styles.textBox}> 
                <RadioForm
                formHorizontal={false}
                animation={true}
                >
                    <Text style={styles.TextBold}>Favour Status</Text>   
                    
                { 
                    radio_props.map((obj, i) => ( 
                    <RadioButton labelHorizontal={true} key={i} >
                        <RadioButtonInput
                        obj={obj}
                        index={i} 
                        isSelected={this.state.favour_status == i ?true:false} 
                        onPress={(value) => this.setFavourStatus(value)}
                        borderWidth={1}
                        buttonInnerColor={'#e74c3c'}
                        buttonOuterColor={this.state.value3Index === i ? '#2196f3' : '#000'}
                        buttonSize={20}
                        buttonOuterSize={40}
                        buttonStyle={{}}
                        testID='noteType,1'
                        buttonWrapStyle={{marginLeft: 10}}
                        />
                        <RadioButtonLabel
                        obj={obj}
                        index={i}
                        labelHorizontal={true}
                        
                        labelStyle={{fontSize: 20, color: '#2ecc71'}}
                        labelWrapStyle={{}}
                        />
                    </RadioButton>
                    ))
                }  
                </RadioForm>    
            </View> 
          </View> 
         
          

    )
  }
}

const styles = StyleSheet.create({
  container : {
  	backgroundColor:'#455a64',
    flexGrow: 1,
    
    alignItems: 'center'
  },
  inputBox: {
    width:350,
    backgroundColor:'rgba(255, 255,255,0.2)',
    borderRadius: 25,
    paddingHorizontal:16,
    fontSize:16,
    color:'#ffffff',
    marginVertical: 10
  },
  textBox: { 
    width:350,
    height:300,
    backgroundColor:'white',
    borderRadius: 25,
    paddingHorizontal:16,
    fontSize:16,
    color:'#ffffff',
    marginVertical: 10
  },
  textPoll: {  
    alignItems: "center",
    justifyContent: "center",   
    width:350,
    height:100,
    backgroundColor:'white',
    borderRadius: 25,
    paddingHorizontal:16,
    fontSize:16,
    color:'#ffffff',
     
    marginVertical: 10
  },
  button: {
    width:350,
    backgroundColor:'#1c313a',
    borderRadius: 25,
    marginVertical: 10,
    paddingVertical: 13
  }, 
  dialbutton: {
    width:30,
    backgroundColor:'#E5E4E2',
    color:'#ffffff',
    borderRadius: 5,
 
    paddingVertical: 5
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
  
  TextBold: {
    fontSize:20,
    fontWeight:'500',
    color:'#000', 

  },
  
  rows: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    width:'100%'
  },
  col: {
    width: '50%' // is 50% of container width
  }
});

export default VotePoll