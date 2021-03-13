 
import React, { Component } from 'react';
import { BackHandler,View, Text , ScrollView,TextInput,TouchableOpacity,StyleSheet,Alert,Picker,AsyncStorage} from 'react-native';
import MySqlConnection from 'react-native-my-sql-connection'; 
import { openDatabase } from 'react-native-sqlite-storage';
import Icon from 'react-native-vector-icons/FontAwesome'; 
import { NavigationContainer } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
var db = openDatabase({ name: 'VoterDatabase.db' });

var m_vote_polled;
var m_male_polled;
var m_female_polled;
var m_third_polled;
var m_d_id=0;
var m_b_id;
var m_v_id;
var m_booth_id;
var m_user_id;

var m_activity_status;
var m_upload_flag;
var m_activity_no;
let m_status_activity = [];
let m_flag_activity = [];

let config = {
  host:'162.214.94.136',
  database:'eageskoo_apodairy',
  user:'eageskoo_1',
  password:'Ashok@2342', 
  };

export class Dashboard extends Component {
    
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
		   }; 
  }
  
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton.bind(this));
    }
    handleBackButton(){
        BackHandler.exitApp();
    }
	static navigationOptions = {
    headerLeft: null
    }  
	
  syncDataPollActivity (pv_activity_no)
  {
    try{
      console.log('sync poll activity start');
      // console.log('in function activity No. - ',pv_activity_no);
      db.transaction(function(txn) {
        txn.executeSql(
          'Select * From `activity_status_' + pv_activity_no + '`',
          [],
          (tx, results) => {
            let row = results.rows.item(0);
            console.log('activity Status - ',pv_activity_no, ' : ',row.activity_status);
            m_status_activity[pv_activity_no] = row.activity_status;
            m_flag_activity[pv_activity_no] = row.upload_flag;
          }
        );
      });
    }catch{
      //Catch
    }
    console.log('sync poll activity End');
    // console.log('activity Status : ',m_status_activity[pv_activity_no]);    
  }


  syncDataPre = async ()=>
  {
    console.log('Pre Start');
    try{
      m_status_activity.push(0);
      m_status_activity.push(0);
      m_status_activity.push(0);
      m_status_activity.push(0);
      m_status_activity.push(0);
      m_status_activity.push(0);
      m_status_activity.push(0);
      m_status_activity.push(0);
      m_status_activity.push(0);
      m_status_activity.push(0);
      m_status_activity.push(0);
      m_status_activity.push(0);

      m_flag_activity.push(0);
      m_flag_activity.push(0);
      m_flag_activity.push(0);
      m_flag_activity.push(0);
      m_flag_activity.push(0);
      m_flag_activity.push(0);
      m_flag_activity.push(0);
      m_flag_activity.push(0);
      m_flag_activity.push(0);
      m_flag_activity.push(0);
      m_flag_activity.push(0);
      m_flag_activity.push(0);

      // m_activity_no = 1;
      // this.syncDataPollActivity();
      // m_activity_no = 2;
      // this.syncDataPollActivity();

      db.transaction(function(txn) {
        txn.executeSql(
          'Select * From `polling_activity_status`',
          [],
          (tx, results) => {
            let row = results.rows.item(0);
            // m_activity_status = row.activity_status;
            // m_upload_flag = row.upload_flag;
            m_upload_flag = 1;
            m_activity_status = 3;
          }
        );
        
        if(m_upload_flag == 1){
          console.log('in ', m_upload_flag, ' - ', m_activity_status);
          txn.executeSql(
            'Update `polling_activity_status` set `upload_flag` = 0',
            []
          );
        };
        if(m_activity_status >= 6){
          txn.executeSql(
            'Select count(*) as `v_polled` From `voters` where `polled_status` = 1',
            [],
            (tx, results) => {
              let row = results.rows.item(0);
              m_vote_polled = row.v_polled;
            }
          );
          txn.executeSql(
            'Select count(*) as `v_polled` From `voters` where `gender_id` = 1 and `polled_status` = 1',
            [],
            (tx, results) => {
              let row = results.rows.item(0);
              m_male_polled = row.v_polled;
            }
          );
          txn.executeSql(
            'Select count(*) as `v_polled` From `voters` where `gender_id` = 2 and `polled_status` = 1',
            [],
            (tx, results) => {
              let row = results.rows.item(0);
              m_female_polled = row.v_polled;
            }
          );
          txn.executeSql(
            'Select count(*) as `v_polled` From `voters` where `gender_id` = 3 and `polled_status` = 1',
            [],
            (tx, results) => {
              let row = results.rows.item(0);
              m_third_polled = row.v_polled;
            }
          );

          txn.executeSql(
            'Update `polling_booths` set vote_polled = ' + m_vote_polled + ', male_polled = ' + m_male_polled + ', female_polled = ' + m_female_polled + ', third_polled = ' + m_third_polled,
            [],
            (tx, results) => {
              console.log('Update : ',results.rowsAffected);
            }
          );

          txn.executeSql(
            'Select * From `polling_booths`',
            [],
            (tx, results) => {
              let row = results.rows.item(0);
              m_d_id = row.districts_id;
              m_b_id = row.blocks_id;
              m_v_id = row.village_id;
              m_booth_id = row.id;
              console.log('vote polled : ',m_vote_polled);
            }
          );
        }
        
      });

      // console.log('end ', m_upload_flag, ' - ', m_activity_status);
      for (var l_counter=1; l_counter <= 11; l_counter++){
        if(m_activity_status>=l_counter){
          // console.log('in (1) ', m_upload_flag, ' - ', m_activity_status);
          this.syncDataPollActivity(l_counter);    
        };  
      }
      
      if(m_activity_status>=6){
        // this.syncDataPollActivity(2);  
      };

    }catch (error) {
      console.log('error catch');
      //Code to be written         
    }
    console.log('Pre End');
    // this.syncDataPost();  
  }

  syncDataPost = async ()=>
  {
    console.log('Post Start');
    try{
      const connection = await MySqlConnection.createConnection(config);
      if(m_d_id == 0){
        console.log('Failed, Plz sync Again');
      }else{
        let update_polled = await connection.executeUpdate("update `polling_booths` set `vote_polled` = " + m_vote_polled + ", `male_polled` = " + m_male_polled + ", `female_polled` = " + m_female_polled + ", `third_polled` = " + m_third_polled + ", `updated_by` = 1 where `id` = " + m_booth_id + " and `districts_id` = " + m_d_id + " and `blocks_id` = " + m_b_id + " and `village_id` = " + m_v_id + " LIMIT 1");
        console.log('Sync Successfully');
      };
    }catch (error) {
      //catch code       
    }
    console.log('Post End');
  }

    syncData = async ()=>
    {
      render : (this.syncDataPre());
      render : (this.syncDataPost());
      // this.syncDataPost();
    }


    searchVoter = () =>
    { 
      console.log('search')
      this.props.navigation.push('SearchVoter')
    }

    uninstallvapp = async ()=>{
      try {
        const connection = await MySqlConnection.createConnection(config);
        let userdetails = await connection.executeQuery("call up_uninstal_sahayak('1234567890');");   
        
        db.transaction(function(txn) {  
          txn.executeSql(
            'Drop Table voters',
            [],
          );
          txn.executeSql(
            'Drop Table booths',
            [],
          );
          txn.executeSql(
            'Drop Table parivaars',
            [],
          );
          txn.executeSql(
            'Drop Table sahshayaks',
            [],
          );
          txn.executeSql(
            'Drop Table appuserdetail',
            [],
          ); 
    
        });


        alert("Success");

        this.props.navigation.popToTop();
      } catch (error) {
        alert("Plz check your net Connection");
      }
      

     
    }
    
	 
	 
  render() {
    return (
      <ScrollView>
        <View style={styles.container}> 
            <View style={styles.body}>
                <View style={styles.bodyContent}>
                    <TouchableOpacity activeOpacity = { .5 } onPress={ this.syncData }> 
                        <View style={styles.menuBox}>
                            <Icon name="user" size={30} color="#900" /> 
                            <Text style={styles.info} onPress={() => this.syncData}>Sync</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity = { .5 } onPress={ this.searchVoter }> 
                        <View style={styles.menuBox}>
                            <Icon name="search" size={30} color="#900" /> 
                            <Text style={styles.info} onPress={() => this.searchVoter}>Search Voter</Text>
                        </View>
                    </TouchableOpacity>
                   
                    <TouchableOpacity activeOpacity = { .5 } onPress={ this.uninstallvapp }> 
                        <View style={styles.menuBox}>
                            <Icon name="rocket" size={30} color="#900" /> 
                            <Text style={styles.info} onPress={() => this.uninstallvapp}>Uninstall</Text>
                        </View>
                    </TouchableOpacity>
                </View> 
            </View>
        </View>
    </ScrollView>

    )
  }
}
 

const styles = StyleSheet.create({
    header:{
      backgroundColor: "#00BFFF",
    },
    headerContent:{
      padding:30,
      alignItems: 'center',
    },
    loginTextSection: {
      width: '100%',
      height: '30%',
   },
  
   loginButtonSection: {
      width: '100%',
      height: '30%',
      justifyContent: 'center',
      alignItems: 'center'
   },
  
   inputText: {
      marginLeft: '20%',
      width: '60%'
   },
  
   loginButton: {
     backgroundColor: 'grey',
     color: 'white'
   },
    avatar: {
      width: 130,
      height: 130,
      borderRadius: 63,
      borderWidth: 4,
      borderColor: "white",
      marginBottom:10,
    },
    name:{
      fontSize:22,
      color:"#FFFFFF",
      fontWeight:'600',
    },
    quotes:{
      fontSize:28,
      color:"#FFFFFF",
      fontWeight:'600',
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
        paddingVertical: 13,
        alignItems: 'center'
        
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
    dates:{
      fontSize:15,
      color:"#FFFFFF",
      fontWeight:'200', 
    },
    bodyContent: {
      flex: 1,
      alignItems: 'center',
      padding:30,
    },
    textInfo:{
      fontSize:14,
      marginTop:10,
      color: "#696969",
    },
    bodyContent:{
      paddingTop:2,
      flexDirection: 'row',
      flexWrap: 'wrap'
    },
    menuBox:{
      backgroundColor: "#eaeaea",
      width:116,
      height:110,
      alignItems: 'center',
      justifyContent: 'center',
      margin:7,
      shadowColor: 'black',
      shadowOpacity: .2,
      shadowOffset: {
        height:2,
        width:-2
      },
      elevation:4,
    },
    icon: {
      width:60,
      height:60,
    },
    info:{
      fontSize:18,
      color: "#696969",
    },
    list:{
      paddingVertical: 2,
      margin: 2,
      backgroundColor: "#5d5b5b",
      fontSize:22, 
      padding:5,
      fontWeight:'600',
      
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

export default Dashboard