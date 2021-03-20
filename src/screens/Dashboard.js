 
import React, { Component } from 'react';
import { BackHandler,View, Text , ScrollView,TextInput,TouchableOpacity,StyleSheet,Alert,Picker,AsyncStorage,InteractionManager} from 'react-native';
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

var m_activity_status=0;
var m_upload_flag=0;
var m_activity_no = 0;
let m_status_activity = [0,0,0,0,0,0,0,0,0,0,0,0,0];
let m_flag_activity = [0,0,0,0,0,0,0,0,0,0,0,0,0];

var m_time_count=0;

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
      
      btn_activity_status:0,
      btn1_activity_name:'',
      btn2_activity_name:'Update Party Dispatch',

      activities_name:['', 'Party Dispatch', 'Party Reached', 'Booth Setup', 'Mock Poll Started', 'Mock Poll Completed', 'Poll Started', 'Voters in Queue', 'Poll Ended', 'Party Left', 'Party Returned', 'EVM Deposited', ''],

      s_total_v:0,
      s_total_m:0,
      s_total_f:0,
      s_total_t:0,
      s_poll_v:0,
      s_poll_m:0,
      s_poll_f:0,
      s_poll_t:0,

      s_status_activity:[0,0,0,0,0,0,0,0,0,0,0,0],
      s_flag_activity:[0,0,0,0,0,0,0,0,0,0,0,0],
      s_activity_status:0,
      s_upload_flag:0,
      s_activity_no:0,
      s_voter_polled_update:0,

      s_d_id:0,
      s_b_id:0,
      s_v_id:0,
      s_booth_id:0,
      s_user_id:0,

      s_test_var:'',

      s_refreshed:0,
      
		   }; 
  }
  
    componentDidMount() {

        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton.bind(this));

        this.check_app_users_status();
        console.log("componentDidMount");
    }

    handleBackButton(){
        BackHandler.exitApp();
    }

	 static navigationOptions = {
    headerLeft: null
    }  
	
  click_update_reset_btn = async (PvActivityNo,PvUpdate_Reset)=>{
    if(PvActivityNo>0){
      if(PvActivityNo<12){
        db.transaction(function(txn) {  
          txn.executeSql(
            'Update `activity_status_' + PvActivityNo + '` set `activity_status` = ' + PvUpdate_Reset + ', upload_flag = 1',
            [],
          );
          // console.log('Update `activity_status_' + PvActivityNo + '` set `activity_status` = ' + PvUpdate_Reset + ', upload_flag = 1');
          if(PvUpdate_Reset == 1){
            txn.executeSql(
              'Update `polling_activity_status` set `activity_status` = ' + PvActivityNo + ', upload_flag = 1',
              [],
            );
          }else{
            txn.executeSql(
              'Update `polling_activity_status` set `activity_status` = ' + PvActivityNo-1 + ', upload_flag = 1',
              [],
            );
          }
        });
        
        setTimeout(() => {
          m_status_activity[PvActivityNo] = PvUpdate_Reset;
          m_flag_activity[PvActivityNo] = 1;
          this.setState({
            s_status_activity:m_status_activity,
            s_flag_activity:m_flag_activity,
            s_upload_flag:1,
          })

          if(PvUpdate_Reset == 1){
            this.setState({
              btn_activity_status: PvActivityNo, btn1_activity_name: 'Reset '+this.state.activities_name[PvActivityNo], btn2_activity_name:'Update '+this.state.activities_name[PvActivityNo+1],
              s_activity_status:PvActivityNo,  
            })  
          }else{
            this.setState({
              btn_activity_status: PvActivityNo-1, btn1_activity_name: 'Reset '+this.state.activities_name[PvActivityNo-1], btn2_activity_name:'Update '+this.state.activities_name[PvActivityNo],
              s_activity_status:PvActivityNo-1,
            })
          }
        },500);  
      }else{
        console.log("not valid");  
      } 
    }else{
      console.log("not valid");
    }
  }

  check_app_users_status(){
    let l_status=-1;
    let l_total_v=0;
    let l_total_m=0;
    let l_total_f=0;
    let l_total_t=0;
    let l_poll_v=0;
    let l_poll_m=0;
    let l_poll_f=0;
    let l_poll_t=0;
    let l_voter_polled_update=0;
    let l_user_id=0;
    db.transaction(function(txn) {  
      txn.executeSql(
        'SELECT `activity_status` FROM `polling_activity_status`',
        [],
        (tx, results) => {
          let row = results.rows.item(0);
          m_activity_status = row.activity_status;
          m_upload_flag = row.upload_flag;
          l_status=row.activity_status
        }
      );

      txn.executeSql(
        'SELECT `id` FROM `app_users`',
        [],
        (tx, results) => {
          let row = results.rows.item(0);
          l_user_id = row.id;
        }
      );

      txn.executeSql(
        'SELECT * FROM `polling_booths`',
        [],
        (tx, results) => {
          let row = results.rows.item(0);
          m_d_id = row.districts_id;
          m_b_id = row.blocks_id;
          m_v_id = row.village_id;
          m_booth_id = row.id;
          l_total_v=row.total_voters;
          l_total_m=row.male_voters;
          l_total_f=row.female_voters;
          l_total_t=row.third_voters;

          l_poll_v=row.vote_polled;
          l_poll_m=row.male_polled;
          l_poll_f=row.female_polled;
          l_poll_t=row.third_polled;
          l_voter_polled_update=row.upload_flag;
        }
      );  
    });

    for(var loop_counter = 1;loop_counter<=11;loop_counter++){
      this.loadDataPollActivity(loop_counter)
    }


    setTimeout(() => {;
      this.setState({
          btn_activity_status:l_status, btn1_activity_name: 'Reset '+this.state.activities_name[l_status], btn2_activity_name: 'Update '+this.state.activities_name[l_status+1],
          s_total_v:l_total_v, s_total_m:l_total_m, s_total_f:l_total_f, s_total_t:l_total_t,
          s_poll_v:l_poll_v, s_poll_m:l_poll_m, s_poll_f:l_poll_f, s_poll_t:l_poll_t,
          s_status_activity:m_status_activity,s_flag_activity:m_flag_activity,
          s_activity_status:m_activity_status, s_upload_flag: m_upload_flag, 
          s_d_id:m_d_id, s_b_id:m_b_id, s_v_id:m_v_id, s_booth_id:m_booth_id, 
          s_refreshed:1, s_voter_polled_update:l_voter_polled_update,
          s_user_id:l_user_id,
        })
    },500);
  }

  loadDataPollActivity (pv_activity_no)
  {
    try{
      db.transaction(function(txn) {
        txn.executeSql(
          'Select * From `activity_status_' + pv_activity_no + '`',
          [],
          (tx, results) => {
            let row = results.rows.item(0);
            m_status_activity[pv_activity_no] = row.activity_status;
            m_flag_activity[pv_activity_no] = row.upload_flag;  
          }
        );
      });
    }catch{
      //Catch
    }    
  }


  syncDataPollActivity (pv_activity_no)
  {
    try{
      db.transaction(function(txn) {
        txn.executeSql(
          'update `activity_status_' + pv_activity_no + '` set upload_flag = 0',
          [],
        );
      });
    }catch{
      //Catch
    }    
  }

  syncDataPre  ()
  {
    setTimeout(() => {
      this.setState({
          s_status_activity:m_status_activity, s_flag_activity: m_flag_activity,
        })
    },1000);  
  }

  syncDataPost = async ()=>
  {
    
    try{
      const connection = await MySqlConnection.createConnection(config);
      if(this.state.s_d_id == 0){
        console.log('Failed, Plz sync Again');
        alert("Failed, Plz sync Again");
      }else{
        for (var l_counter=1; l_counter <= 11; l_counter++){
          if(this.state.s_flag_activity[l_counter]==1){
            let update_polled = await connection.executeUpdate("update `activity_status_" + l_counter + "` set `activity_status` = " + this.state.s_status_activity[l_counter] + ", `updated_by` = " + this.state.s_user_id + ", `updated_at` = now() where `booth_id` = " + this.state.s_booth_id + " and `districts_id` = " + this.state.s_d_id + " and `blocks_id` = " + this.state.s_b_id + " and `village_id` = " + this.state.s_v_id + " LIMIT 1");      
            m_flag_activity[l_counter]=0;
          }
        }
        
        if(this.state.s_voter_polled_update == 1){
          let update_polled = await connection.executeUpdate("update `polling_booths` set `vote_polled` = " + this.state.s_poll_v + ", `male_polled` = " + this.state.s_poll_m + ", `female_polled` = " + this.state.s_poll_f + ", `third_polled` = " + this.state.s_poll_t + ", `updated_by` = " + this.state.s_user_id + ", `updated_at` = now() where `id` = " + this.state.s_booth_id + " and `districts_id` = " + this.state.s_d_id + " and `blocks_id` = " + this.state.s_b_id + " and `village_id` = " + this.state.s_v_id + " LIMIT 1");  
        }
        
        if(this.state.s_upload_flag == 1){
          let update_polled = await connection.executeUpdate("update `polling_activity_status` set `activity_status` = " + this.state.s_activity_status + ", `updated_by` = " + this.state.s_user_id + ", `updated_at` = now() where `booth_id` = " + this.state.s_booth_id + " and `districts_id` = " + this.state.s_d_id + " and `blocks_id` = " + this.state.s_b_id + " and `village_id` = " + this.state.s_v_id + " LIMIT 1");
        }
        console.log('Sync Successfully');
        alert("Sync Successfully");
      };


      for(var loop_counter = 1;loop_counter<=11;loop_counter++){
        this.syncDataPollActivity(loop_counter);
      }

      await db.transaction(function(txn) {
        if(this.state.s_upload_flag == 1){
          txn.executeSql(
            'update `polling_activity_status` set `activity_status` = ' + this.state.s_activity_status,
            [],
          );
        }
        if(this.state.s_voter_polled_update == 1){
          txn.executeSql(
            'update `polling_booths` set `upload_flag` = 0',
            [],
          );
        }
      });


      this.setState({
        s_flag_activity:m_flag_activity, s_upload_flag:0, s_voter_polled_update:0,
      })


    }catch (error) {
      //catch code       
    }
  }

    syncData = async ()=>
    {
      if(this.state.s_refreshed == 1){
        if(this.state.s_upload_flag == 1){
          setTimeout(() => {render : (this.syncDataPre());},1000);
          setTimeout(() => {render : (this.syncDataPost());},1000);
        }else if(this.state.s_voter_polled_update == 1){
          setTimeout(() => {render : (this.syncDataPre());},1000);
          setTimeout(() => {render : (this.syncDataPost());},1000);
        }else{
          alert("No data change to sync")
        }
          
      }else{
        alert("Plz refresh the data and then Sync Again");
      }     
    }


    searchVoter = () =>
    { 
      console.log('search')

      if(this.state.btn_activity_status>=6){
        if(this.state.btn_activity_status<=7){
          this.setState({s_refreshed:0,});
          this.props.navigation.push('SearchVoter')
        }else{
          alert("Poll Ended");  
        }
      }else{
        alert("Polling not started");
      }
      
    }

    refresh_voters = () =>
    { 
      this.check_app_users_status();
      alert("Refresh Successfully");
    }

    

    uninstallvapp = async ()=>{
      try {
        const connection = await MySqlConnection.createConnection(config);
        
        // db.transaction(function(txn) {  
        //   txn.executeSql(
        //     'Drop Table voters',
        //     [],
        //   );
          
        // });


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

                    <TouchableOpacity activeOpacity = { .5 } onPress={ this.refresh_voters }> 
                        <View style={styles.menuBox}>
                            <Icon name="rocket" size={30} color="#900" /> 
                            <Text style={styles.info} onPress={() => this.refresh_voters}>Refresh</Text>
                        </View>
                    </TouchableOpacity>
               
                               

                    <TouchableOpacity activeOpacity = { .5 } onPress={ () => this.click_update_reset_btn(this.state.btn_activity_status,0) }> 
                        <View style={styles.menuBox}>
                            <Icon name="rocket" size={30} color="#900" /> 
                            <Text style={styles.info} onPress={() => this.click_update_reset_btn(this.state.btn_activity_status,0)}>{this.state.btn1_activity_name}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity = { .5 } onPress={ () => this.click_update_reset_btn(this.state.btn_activity_status+1,1) }> 
                        <View style={styles.menuBox}>
                            <Icon name="rocket" size={30} color="#900" /> 
                            <Text style={styles.info} onPress={() => this.click_update_reset_btn(this.state.btn_activity_status+1,1)}>{this.state.btn2_activity_name}</Text>
                        </View>
                    </TouchableOpacity>
                </View> 
            </View>
            <View style={styles.textBox}> 
                <View style={styles.list}>
                  <Text>Total Voters : {this.state.s_total_v}</Text>
                </View> 
                <View style={styles.list}>
                  <Text>Total Male Voters : {this.state.s_total_m}</Text>
                </View> 
                <View style={styles.list}>
                  <Text>Total Female Voters : {this.state.s_total_f}</Text>
                </View> 
                <View style={styles.list}>
                  <Text>Total Other Voters : {this.state.s_total_t}</Text>
                </View> 

                <View style={styles.list}>
                  <Text>Polled Voters : {this.state.s_poll_v}</Text>
                </View> 
                <View style={styles.list}>
                  <Text>Polled Male : {this.state.s_poll_m}</Text>
                </View> 
                <View style={styles.list}>
                  <Text>Polled Female : {this.state.s_poll_f}</Text>
                </View> 
                <View style={styles.list}>
                  <Text>Polled Others : {this.state.s_poll_t}</Text>
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
      color: "#333333",
      fontSize:30, 
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
    },
    textBox: {  
    backgroundColor:'white',
    borderRadius: 10,
    paddingHorizontal:16,
    fontSize:16,
    color:'#ffffff',
    marginVertical: 10,
  },
     
  });

export default Dashboard