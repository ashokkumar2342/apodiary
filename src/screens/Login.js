
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
export class Login extends Component {
    
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
      mobile_no:'Select Mobile No'
	}; 
  }
  
  // componentDidMount(){     
  //   let check ='';
  //   db.transaction(function(txn) {  
  //             txn.executeSql(
  //               'SELECT count(*) as total FROM voters',
  //               [],
  //               function(txt,res){ 
  //                   check= res.rows.item(0).total 
  //                   console.log('ok')
  //               }
  //             ); 
        
  //     }); 
  //   setTimeout(() => { 
  //       if(check == 0){ 
  //           console.log(check)
  //       } else{
  //       this.props.navigation.navigate('Dashboard'); 
            
  //       }
  //   }, 100) 
  // }
  
	static navigationOptions={
		header :null
	}
	 setOptionValue = async (booth_id)=>{ 
        this.setState({ 
        setSelectedValue: booth_id
        })
    } 
	 
     configureData = async ()=>{  
         try {
            const {mobile_no}=this.state  
            
            const connection = await MySqlConnection.createConnection(config);
            
            let userdetails = await connection.executeQuery("SELECT * FROM app_users WHERE mobileno = '"+mobile_no+"' LIMIT 1"); 
           
            if (userdetails.length == 0) {
                alert("Invalid User")
            }else{
                console.log('started');

                let s_states = await connection.executeQuery("SELECT * FROM `states` WHERE id = "+userdetails[0].states_id+" LIMIT 1");
                let s_districts = await connection.executeQuery("SELECT * FROM `districts` WHERE id = "+userdetails[0].districts_id+" and `state_id` = "+userdetails[0].states_id+" LIMIT 1");
                let s_blocks_mcs = await connection.executeQuery("SELECT * FROM `blocks_mcs` WHERE id = "+userdetails[0].blocks_id+" and `districts_id` = "+userdetails[0].districts_id+" LIMIT 1");
                let s_villages = await connection.executeQuery("SELECT * FROM `villages` WHERE id = "+userdetails[0].village_id+" and `districts_id` = "+userdetails[0].districts_id+" and `blocks_id` = "+userdetails[0].blocks_id+"  LIMIT 1");
                let s_ward_villages = await connection.executeQuery("SELECT * FROM `ward_villages` WHERE `districts_id` = "+userdetails[0].districts_id+" and `blocks_id` = "+userdetails[0].blocks_id+" and `village_id` = "+userdetails[0].village_id);
                let s_polling_booths = await connection.executeQuery("SELECT * FROM `polling_booths` WHERE `id` = "+userdetails[0].booth_id + " and `districts_id` = "+userdetails[0].districts_id+" and `blocks_id` = "+userdetails[0].blocks_id+" and `village_id` = "+userdetails[0].village_id +" LIMIT 1");
                let s_polling_activity_status = await connection.executeQuery("SELECT * FROM `polling_activity_status` WHERE `booth_id` = "+userdetails[0].booth_id + " and `districts_id` = "+userdetails[0].districts_id+" and `blocks_id` = "+userdetails[0].blocks_id+" and `village_id` = "+userdetails[0].village_id +" LIMIT 1");

                let s_voters = await connection.executeQuery("SELECT * FROM `voters` WHERE `district_id` = "+userdetails[0].districts_id+" and `village_id` = "+userdetails[0].village_id+" and `booth_id` = "+userdetails[0].booth_id);
                
                db.transaction(function(txn) {
                  
                  // txn.executeSql(
                  //   'Select * From `states`',
                  //   [],
                  //   (tx, results) => {
                  //         console.log('Total Records befor drop : ',results.rows.length);
                  //       }
                  // );
                  txn.executeSql(
                    'DROP TABLE IF EXISTS `states`',
                    []
                  );
                  txn.executeSql(
                    'CREATE TABLE IF NOT EXISTS `states` (`id` integer, `code` text, `name_e` text, `name_l` text, PRIMARY KEY (`id`))',
                    []
                  );
                  // txn.executeSql(
                  //   'Select * From `states`',
                  //   [],
                  //   (tx, results) => {
                  //         console.log('Total Records before insert : ',results.rows.length);
                  //       }
                  // );
                  s_states.map((itemValue,index) => {
                    txn.executeSql(
                        'INSERT INTO `states` (`id`, `code`, `name_e`, `name_l`) VALUES (?,?,?,?)',
                        [itemValue.id, itemValue.code, itemValue.name_e, itemValue.name_l],
                        (tx, results) => {
                          // console.log('States : ',results.rowsAffected);
                        }
                      ); 
                  });

                  //District Table code
                  txn.executeSql(
                    'DROP TABLE IF EXISTS `districts`',
                    []
                  );
                  txn.executeSql(
                    'CREATE TABLE IF NOT EXISTS `districts`(`id` integer, `state_id` integer, `code` text, `name_e` text, `name_l` text, PRIMARY KEY (`id`))',
                    []
                  );
                  s_districts.map((itemValue,index) => {
                    txn.executeSql(
                      'INSERT INTO districts (id, state_id, code, name_e, name_l) VALUES (?,?,?,?,?)',
                      [itemValue.id, itemValue.state_id, itemValue.code, itemValue.name_e, itemValue.name_l]
                    ); 
                  });

                  //Block Table Code
                  txn.executeSql(
                    'DROP TABLE IF EXISTS `blocks_mcs`',
                    []
                  );
                  txn.executeSql(
                    'CREATE TABLE IF NOT EXISTS `blocks_mcs`(`id` integer, `states_id` integer, `districts_id` integer, `code` text, `name_e` text, `name_l` text, `block_mc_type_id` integer, `stamp_l1` text, `stamp_l2` text, PRIMARY KEY (`id`))',
                    []
                  );
                  s_blocks_mcs.map((itemValue,index) => {
                    txn.executeSql(
                      'INSERT INTO `blocks_mcs` (id, states_id, districts_id, code, name_e, name_l, block_mc_type_id, stamp_l1, stamp_l2) VALUES (?,?,?,?,?,?,?,?,?)',
                      [itemValue.id, itemValue.states_id, itemValue.districts_id, itemValue.code, itemValue.name_e, itemValue.name_l, itemValue.block_mc_type_id, itemValue.stamp_l1, itemValue.stamp_l2],
                      (tx, results) => {
                        console.log('Blocks : ',results.rowsAffected);
                      }
                    ); 
                  });

                  //Village Table Code
                  txn.executeSql(
                    'DROP TABLE IF EXISTS `villages`',
                    []
                  );
                  txn.executeSql(
                    'CREATE TABLE IF NOT EXISTS `villages` (`id` integer, `states_id` integer, `districts_id` integer, `blocks_id` integer, `code` text, `name_e` text, `name_l` text, `ps_ward_id` integer, `zp_ward_id` integer, `is_locked` integer, PRIMARY KEY (`id`))',
                    []
                  );
                  s_villages.map((itemValue,index) => {
                    txn.executeSql(
                      'INSERT INTO `villages` (id, states_id, districts_id, blocks_id, code, name_e, name_l, ps_ward_id, zp_ward_id, is_locked) VALUES (?,?,?,?,?,?,?,?,?,?)',
                      [itemValue.id, itemValue.states_id, itemValue.districts_id, itemValue.blocks_id, itemValue.code, itemValue.name_e, itemValue.name_l, itemValue.ps_ward_id, itemValue.zp_ward_id, itemValue.is_locked],
                      (tx, results) => {
                        console.log('Village : ',results.rowsAffected);
                      }
                    ); 
                  });

                  //Ward Villages Table Code
                  txn.executeSql(
                    'DROP TABLE IF EXISTS `ward_villages`',
                    []
                  );
                  txn.executeSql(
                    'CREATE TABLE IF NOT EXISTS `ward_villages`(`id` integer, `states_id` integer, `districts_id` integer, `blocks_id` integer, `village_id` integer, `ward_no` integer, `name_e` text, `name_l` text, `is_locked` integer, `ps_ward_id` integer, PRIMARY KEY (`id`))',
                    []
                  );
                  s_ward_villages.map((itemValue,index) => {
                    txn.executeSql(
                      'INSERT INTO `ward_villages` (id, states_id, districts_id, blocks_id, village_id, ward_no, name_e, name_l, is_locked, ps_ward_id) VALUES (?,?,?,?,?,?,?,?,?,?)',
                      [itemValue.id, itemValue.states_id, itemValue.districts_id, itemValue.blocks_id, itemValue.village_id, itemValue.ward_no, itemValue.name_e, itemValue.name_l, itemValue.is_locked, itemValue.ps_ward_id],
                      (tx, results) => {
                        console.log('Ward Village : ',results.rowsAffected);
                      }
                    ); 
                  });


                  //Polling Booths Table Code
                  txn.executeSql(
                    'DROP TABLE IF EXISTS `polling_booths`',
                    []
                  );
                  txn.executeSql(
                    'CREATE TABLE IF NOT EXISTS `polling_booths` (`id` integer, `states_id` integer, `districts_id` integer, `blocks_id` integer, `village_id` integer, `booth_no` integer, `name_e` text, `name_l` text, `booth_no_c` text, `total_voters` integer, `male_voters` integer, `female_voters` integer, `third_voters` integer, `vote_polled` integer, `male_polled` integer, `female_polled` integer, `third_polled` integer, `updated_by` integer, `updated_at` DATETIME, `upload_flag` integer, PRIMARY KEY (`id`, `districts_id`, `blocks_id`, `village_id`))',
                    []
                  );
                  s_polling_booths.map((itemValue,index) => {
                    txn.executeSql(
                      'INSERT INTO `polling_booths` (id, states_id, districts_id, blocks_id, village_id, booth_no, name_e, name_l, booth_no_c, total_voters, male_voters, female_voters, third_voters, vote_polled, male_polled, female_polled, third_polled) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
                      [itemValue.id, itemValue.states_id, itemValue.districts_id, itemValue.blocks_id, itemValue.village_id, itemValue.booth_no, itemValue.name_e, itemValue.name_l, itemValue.booth_no_c, itemValue.total_voters, itemValue.male_voters, itemValue.female_voters, itemValue.third_voters, itemValue.vote_polled, itemValue.male_polled, itemValue.female_polled, itemValue.third_polled],
                      (tx, results) => {
                        console.log('Polling Booths : ',results.rowsAffected);
                      }
                    ); 
                  });


                  //Polling Activity Status Table Code
                  txn.executeSql(
                    'DROP TABLE IF EXISTS `polling_activity_status`',
                    []
                  );
                  txn.executeSql(
                    'CREATE TABLE IF NOT EXISTS `polling_activity_status` (`id` integer, `states_id` integer, `districts_id` integer, `blocks_id` integer, `village_id` integer, `booth_id` integer, `booth_no`, `name_e`, `name_l`, `booth_no_c`, `activity_status` integer, `updated_by` integer, `updated_at` datetime, `upload_flag` integer, PRIMARY KEY (`id`, `districts_id`, `blocks_id`, `village_id`))',
                    []
                  );
                  s_polling_activity_status.map((itemValue,index) => {
                    txn.executeSql(
                      'INSERT INTO `polling_activity_status` (id, states_id, districts_id, blocks_id, village_id, booth_id, booth_no, name_e, name_l, booth_no_c, activity_status, updated_by, updated_at, upload_flag) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
                      [itemValue.id, itemValue.states_id, itemValue.districts_id, itemValue.blocks_id, itemValue.village_id, itemValue.booth_id, itemValue.booth_no, itemValue.name_e, itemValue.name_l, itemValue.booth_no_c, itemValue.activity_status, itemValue.updated_by, itemValue.updated_at, itemValue.upload_flag],
                      (tx, results) => {
                        console.log('Polling Activity Status : ',results.rowsAffected);
                      }
                    ); 
                  });

                  //Activity 1 Status Table Code
                  txn.executeSql(
                    'DROP TABLE IF EXISTS `activity_status_1`',
                    []
                  );
                  txn.executeSql(
                    'CREATE TABLE IF NOT EXISTS `activity_status_1` (`id` integer, `states_id` integer, `districts_id` integer, `blocks_id` integer, `village_id` integer, `booth_id` integer, `booth_no`, `name_e`, `name_l`, `booth_no_c`, `activity_status` integer, `updated_by` integer, `updated_at` datetime, `upload_flag` integer, PRIMARY KEY (`id`, `districts_id`, `blocks_id`, `village_id`))',
                    []
                  );
                  s_polling_activity_status.map((itemValue,index) => {
                    var l_status = 0;
                    if(itemValue.activity_status>=1){
                      l_status = 1;
                    }
                    txn.executeSql(
                      'INSERT INTO `activity_status_1` (id, states_id, districts_id, blocks_id, village_id, booth_id, booth_no, name_e, name_l, booth_no_c, activity_status, updated_by, updated_at, upload_flag) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
                      [itemValue.id, itemValue.states_id, itemValue.districts_id, itemValue.blocks_id, itemValue.village_id, itemValue.booth_id, itemValue.booth_no, itemValue.name_e, itemValue.name_l, itemValue.booth_no_c, l_status, itemValue.updated_by, itemValue.updated_at, itemValue.upload_flag],
                      (tx, results) => {
                        console.log('Activity 1 Status : ',results.rowsAffected);
                      }
                    ); 
                  });

                  //Activity 2 Status Table Code
                  txn.executeSql(
                    'DROP TABLE IF EXISTS `activity_status_2`',
                    []
                  );
                  txn.executeSql(
                    'CREATE TABLE IF NOT EXISTS `activity_status_2` (`id` integer, `states_id` integer, `districts_id` integer, `blocks_id` integer, `village_id` integer, `booth_id` integer, `booth_no`, `name_e`, `name_l`, `booth_no_c`, `activity_status` integer, `updated_by` integer, `updated_at` datetime, `upload_flag` integer, PRIMARY KEY (`id`, `districts_id`, `blocks_id`, `village_id`))',
                    []
                  );
                  s_polling_activity_status.map((itemValue,index) => {
                    var l_status = 0;
                    if(itemValue.activity_status>=2){
                      l_status = 1;
                    }
                    txn.executeSql(
                      'INSERT INTO `activity_status_2` (id, states_id, districts_id, blocks_id, village_id, booth_id, booth_no, name_e, name_l, booth_no_c, activity_status, updated_by, updated_at, upload_flag) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
                      [itemValue.id, itemValue.states_id, itemValue.districts_id, itemValue.blocks_id, itemValue.village_id, itemValue.booth_id, itemValue.booth_no, itemValue.name_e, itemValue.name_l, itemValue.booth_no_c, l_status, itemValue.updated_by, itemValue.updated_at, itemValue.upload_flag],
                      (tx, results) => {
                        console.log('Activity 2 Status : ',results.rowsAffected);
                      }
                    ); 
                  });

                  
                  //Activity 3 Status Table Code
                  txn.executeSql(
                    'DROP TABLE IF EXISTS `activity_status_3`',
                    []
                  );
                  txn.executeSql(
                    'CREATE TABLE IF NOT EXISTS `activity_status_3` (`id` integer, `states_id` integer, `districts_id` integer, `blocks_id` integer, `village_id` integer, `booth_id` integer, `booth_no`, `name_e`, `name_l`, `booth_no_c`, `activity_status` integer, `updated_by` integer, `updated_at` datetime, `upload_flag` integer, PRIMARY KEY (`id`, `districts_id`, `blocks_id`, `village_id`))',
                    []
                  );
                  s_polling_activity_status.map((itemValue,index) => {
                    var l_status = 0;
                    if(itemValue.activity_status>=3){
                      l_status = 1;
                    }
                    txn.executeSql(
                      'INSERT INTO `activity_status_3` (id, states_id, districts_id, blocks_id, village_id, booth_id, booth_no, name_e, name_l, booth_no_c, activity_status, updated_by, updated_at, upload_flag) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
                      [itemValue.id, itemValue.states_id, itemValue.districts_id, itemValue.blocks_id, itemValue.village_id, itemValue.booth_id, itemValue.booth_no, itemValue.name_e, itemValue.name_l, itemValue.booth_no_c, l_status, itemValue.updated_by, itemValue.updated_at, itemValue.upload_flag],
                      (tx, results) => {
                        console.log('Activity 3 Status : ',results.rowsAffected);
                      }
                    ); 
                  });                  


                  //Activity 4 Status Table Code
                  txn.executeSql(
                    'DROP TABLE IF EXISTS `activity_status_4`',
                    []
                  );
                  txn.executeSql(
                    'CREATE TABLE IF NOT EXISTS `activity_status_4` (`id` integer, `states_id` integer, `districts_id` integer, `blocks_id` integer, `village_id` integer, `booth_id` integer, `booth_no`, `name_e`, `name_l`, `booth_no_c`, `activity_status` integer, `updated_by` integer, `updated_at` datetime, `upload_flag` integer, PRIMARY KEY (`id`, `districts_id`, `blocks_id`, `village_id`))',
                    []
                  );
                  s_polling_activity_status.map((itemValue,index) => {
                    var l_status = 0;
                    if(itemValue.activity_status>=4){
                      l_status = 1;
                    }
                    txn.executeSql(
                      'INSERT INTO `activity_status_4` (id, states_id, districts_id, blocks_id, village_id, booth_id, booth_no, name_e, name_l, booth_no_c, activity_status, updated_by, updated_at, upload_flag) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
                      [itemValue.id, itemValue.states_id, itemValue.districts_id, itemValue.blocks_id, itemValue.village_id, itemValue.booth_id, itemValue.booth_no, itemValue.name_e, itemValue.name_l, itemValue.booth_no_c, l_status, itemValue.updated_by, itemValue.updated_at, itemValue.upload_flag],
                      (tx, results) => {
                        console.log('Activity 4 Status : ',results.rowsAffected);
                      }
                    ); 
                  });

                  //Activity 5 Status Table Code
                  txn.executeSql(
                    'DROP TABLE IF EXISTS `activity_status_5`',
                    []
                  );
                  txn.executeSql(
                    'CREATE TABLE IF NOT EXISTS `activity_status_5` (`id` integer, `states_id` integer, `districts_id` integer, `blocks_id` integer, `village_id` integer, `booth_id` integer, `booth_no`, `name_e`, `name_l`, `booth_no_c`, `activity_status` integer, `updated_by` integer, `updated_at` datetime, `upload_flag` integer, PRIMARY KEY (`id`, `districts_id`, `blocks_id`, `village_id`))',
                    []
                  );
                  s_polling_activity_status.map((itemValue,index) => {
                    var l_status = 0;
                    if(itemValue.activity_status>=5){
                      l_status = 1;
                    }
                    txn.executeSql(
                      'INSERT INTO `activity_status_5` (id, states_id, districts_id, blocks_id, village_id, booth_id, booth_no, name_e, name_l, booth_no_c, activity_status, updated_by, updated_at, upload_flag) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
                      [itemValue.id, itemValue.states_id, itemValue.districts_id, itemValue.blocks_id, itemValue.village_id, itemValue.booth_id, itemValue.booth_no, itemValue.name_e, itemValue.name_l, itemValue.booth_no_c, l_status, itemValue.updated_by, itemValue.updated_at, itemValue.upload_flag],
                      (tx, results) => {
                        console.log('Activity 5 Status : ',results.rowsAffected);
                      }
                    ); 
                  });

                  //Activity 6 Status Table Code
                  txn.executeSql(
                    'DROP TABLE IF EXISTS `activity_status_6`',
                    []
                  );
                  txn.executeSql(
                    'CREATE TABLE IF NOT EXISTS `activity_status_6` (`id` integer, `states_id` integer, `districts_id` integer, `blocks_id` integer, `village_id` integer, `booth_id` integer, `booth_no`, `name_e`, `name_l`, `booth_no_c`, `activity_status` integer, `updated_by` integer, `updated_at` datetime, `upload_flag` integer, PRIMARY KEY (`id`, `districts_id`, `blocks_id`, `village_id`))',
                    []
                  );
                  s_polling_activity_status.map((itemValue,index) => {
                    var l_status = 0;
                    if(itemValue.activity_status>=6){
                      l_status = 1;
                    }
                    txn.executeSql(
                      'INSERT INTO `activity_status_6` (id, states_id, districts_id, blocks_id, village_id, booth_id, booth_no, name_e, name_l, booth_no_c, activity_status, updated_by, updated_at, upload_flag) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
                      [itemValue.id, itemValue.states_id, itemValue.districts_id, itemValue.blocks_id, itemValue.village_id, itemValue.booth_id, itemValue.booth_no, itemValue.name_e, itemValue.name_l, itemValue.booth_no_c, l_status, itemValue.updated_by, itemValue.updated_at, itemValue.upload_flag],
                      (tx, results) => {
                        console.log('Activity 6 Status : ',results.rowsAffected);
                      }
                    ); 
                  });

                  //Activity 7 Status Table Code
                  txn.executeSql(
                    'DROP TABLE IF EXISTS `activity_status_7`',
                    []
                  );
                  txn.executeSql(
                    'CREATE TABLE IF NOT EXISTS `activity_status_7` (`id` integer, `states_id` integer, `districts_id` integer, `blocks_id` integer, `village_id` integer, `booth_id` integer, `booth_no`, `name_e`, `name_l`, `booth_no_c`, `activity_status` integer, `updated_by` integer, `updated_at` datetime, `upload_flag` integer, PRIMARY KEY (`id`, `districts_id`, `blocks_id`, `village_id`))',
                    []
                  );
                  s_polling_activity_status.map((itemValue,index) => {
                    var l_status = 0;
                    if(itemValue.activity_status>=7){
                      l_status = 1;
                    }
                    txn.executeSql(
                      'INSERT INTO `activity_status_7` (id, states_id, districts_id, blocks_id, village_id, booth_id, booth_no, name_e, name_l, booth_no_c, activity_status, updated_by, updated_at, upload_flag) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
                      [itemValue.id, itemValue.states_id, itemValue.districts_id, itemValue.blocks_id, itemValue.village_id, itemValue.booth_id, itemValue.booth_no, itemValue.name_e, itemValue.name_l, itemValue.booth_no_c, l_status, itemValue.updated_by, itemValue.updated_at, itemValue.upload_flag],
                      (tx, results) => {
                        console.log('Activity 7 Status : ',results.rowsAffected);
                      }
                    ); 
                  });

                  //Activity 8 Status Table Code
                  txn.executeSql(
                    'DROP TABLE IF EXISTS `activity_status_8`',
                    []
                  );
                  txn.executeSql(
                    'CREATE TABLE IF NOT EXISTS `activity_status_8` (`id` integer, `states_id` integer, `districts_id` integer, `blocks_id` integer, `village_id` integer, `booth_id` integer, `booth_no`, `name_e`, `name_l`, `booth_no_c`, `activity_status` integer, `updated_by` integer, `updated_at` datetime, `upload_flag` integer, PRIMARY KEY (`id`, `districts_id`, `blocks_id`, `village_id`))',
                    []
                  );
                  s_polling_activity_status.map((itemValue,index) => {
                    var l_status = 0;
                    if(itemValue.activity_status>=8){
                      l_status = 1;
                    }
                    txn.executeSql(
                      'INSERT INTO `activity_status_8` (id, states_id, districts_id, blocks_id, village_id, booth_id, booth_no, name_e, name_l, booth_no_c, activity_status, updated_by, updated_at, upload_flag) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
                      [itemValue.id, itemValue.states_id, itemValue.districts_id, itemValue.blocks_id, itemValue.village_id, itemValue.booth_id, itemValue.booth_no, itemValue.name_e, itemValue.name_l, itemValue.booth_no_c, l_status, itemValue.updated_by, itemValue.updated_at, itemValue.upload_flag],
                      (tx, results) => {
                        console.log('Activity 8 Status : ',results.rowsAffected);
                      }
                    ); 
                  });

                  //Activity 9 Status Table Code
                  txn.executeSql(
                    'DROP TABLE IF EXISTS `activity_status_9`',
                    []
                  );
                  txn.executeSql(
                    'CREATE TABLE IF NOT EXISTS `activity_status_9` (`id` integer, `states_id` integer, `districts_id` integer, `blocks_id` integer, `village_id` integer, `booth_id` integer, `booth_no`, `name_e`, `name_l`, `booth_no_c`, `activity_status` integer, `updated_by` integer, `updated_at` datetime, `upload_flag` integer, PRIMARY KEY (`id`, `districts_id`, `blocks_id`, `village_id`))',
                    []
                  );
                  s_polling_activity_status.map((itemValue,index) => {
                    var l_status = 0;
                    if(itemValue.activity_status>=9){
                      l_status = 1;
                    }
                    txn.executeSql(
                      'INSERT INTO `activity_status_9` (id, states_id, districts_id, blocks_id, village_id, booth_id, booth_no, name_e, name_l, booth_no_c, activity_status, updated_by, updated_at, upload_flag) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
                      [itemValue.id, itemValue.states_id, itemValue.districts_id, itemValue.blocks_id, itemValue.village_id, itemValue.booth_id, itemValue.booth_no, itemValue.name_e, itemValue.name_l, itemValue.booth_no_c, l_status, itemValue.updated_by, itemValue.updated_at, itemValue.upload_flag],
                      (tx, results) => {
                        console.log('Activity 9 Status : ',results.rowsAffected);
                      }
                    ); 
                  });

                  //Activity 10 Status Table Code
                  txn.executeSql(
                    'DROP TABLE IF EXISTS `activity_status_10`',
                    []
                  );
                  txn.executeSql(
                    'CREATE TABLE IF NOT EXISTS `activity_status_10` (`id` integer, `states_id` integer, `districts_id` integer, `blocks_id` integer, `village_id` integer, `booth_id` integer, `booth_no`, `name_e`, `name_l`, `booth_no_c`, `activity_status` integer, `updated_by` integer, `updated_at` datetime, `upload_flag` integer, PRIMARY KEY (`id`, `districts_id`, `blocks_id`, `village_id`))',
                    []
                  );
                  s_polling_activity_status.map((itemValue,index) => {
                    var l_status = 0;
                    if(itemValue.activity_status>=10){
                      l_status = 1;
                    }
                    txn.executeSql(
                      'INSERT INTO `activity_status_10` (id, states_id, districts_id, blocks_id, village_id, booth_id, booth_no, name_e, name_l, booth_no_c, activity_status, updated_by, updated_at, upload_flag) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
                      [itemValue.id, itemValue.states_id, itemValue.districts_id, itemValue.blocks_id, itemValue.village_id, itemValue.booth_id, itemValue.booth_no, itemValue.name_e, itemValue.name_l, itemValue.booth_no_c, l_status, itemValue.updated_by, itemValue.updated_at, itemValue.upload_flag],
                      (tx, results) => {
                        console.log('Activity 10 Status : ',results.rowsAffected);
                      }
                    ); 
                  });


                  //Activity 11 Status Table Code
                  txn.executeSql(
                    'DROP TABLE IF EXISTS `activity_status_11`',
                    []
                  );
                  txn.executeSql(
                    'CREATE TABLE IF NOT EXISTS `activity_status_11` (`id` integer, `states_id` integer, `districts_id` integer, `blocks_id` integer, `village_id` integer, `booth_id` integer, `booth_no`, `name_e`, `name_l`, `booth_no_c`, `activity_status` integer, `updated_by` integer, `updated_at` datetime, `upload_flag` integer, PRIMARY KEY (`id`, `districts_id`, `blocks_id`, `village_id`))',
                    []
                  );
                  s_polling_activity_status.map((itemValue,index) => {
                    var l_status = 0;
                    if(itemValue.activity_status>=11){
                      l_status = 1;
                    }
                    txn.executeSql(
                      'INSERT INTO `activity_status_11` (id, states_id, districts_id, blocks_id, village_id, booth_id, booth_no, name_e, name_l, booth_no_c, activity_status, updated_by, updated_at, upload_flag) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
                      [itemValue.id, itemValue.states_id, itemValue.districts_id, itemValue.blocks_id, itemValue.village_id, itemValue.booth_id, itemValue.booth_no, itemValue.name_e, itemValue.name_l, itemValue.booth_no_c, l_status, itemValue.updated_by, itemValue.updated_at, itemValue.upload_flag],
                      (tx, results) => {
                        console.log('Activity 11 Status : ',results.rowsAffected);
                      }
                    ); 
                  });

                  //Voters Table Code
                  txn.executeSql(
                    'DROP TABLE IF EXISTS `voters`',
                    []
                  );
                  txn.executeSql(
                    'CREATE TABLE IF NOT EXISTS `voters` (`id` integer, `district_id` integer, `assembly_id` integer, `assembly_part_id` integer, `voter_card_no` text, `sr_no` integer, `house_no_e` text, `house_no_l` text, `house_no` integer, `aadhar_no` text, `name_e` text, `name_l` text, `father_name_e` text, `father_name_l` text, `relation` integer, `gender_id` integer, `age` integer, `mobile_no` text, `block_id` INTEGER, `village_id` integer, `ward_id` integer, `print_sr_no` integer, `source` text, `suppliment_no` integer, `status` integer, `booth_id` integer, `polled_status` integer, `v_timestamp` datetime, PRIMARY KEY (`id`, `district_id`, `block_id`, `booth_id`))',
                    []
                  );
                  s_voters.map((itemValue,index) => {
                    txn.executeSql(
                      'INSERT INTO `voters` (id, district_id, assembly_id, assembly_part_id, voter_card_no, sr_no, house_no_e, house_no_l, house_no, aadhar_no, name_e, name_l, father_name_e, father_name_l, relation, gender_id, age, mobile_no, block_id, village_id, ward_id, print_sr_no, source, suppliment_no, status, booth_id, polled_status, v_timestamp) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
                      [itemValue.id, itemValue.district_id, itemValue.assembly_id, itemValue.assembly_part_id, itemValue.voter_card_no, itemValue.sr_no, itemValue.house_no_e, itemValue.house_no_l, itemValue.house_no, itemValue.aadhar_no, itemValue.name_e, itemValue.name_l, itemValue.father_name_e, itemValue.father_name_l, itemValue.relation, itemValue.gender_id, itemValue.age, itemValue.mobile_no, itemValue.block_id, itemValue.village_id, itemValue.ward_id, itemValue.print_sr_no, itemValue.source, itemValue.suppliment_no, itemValue.status, itemValue.booth_id, itemValue.polled_status, itemValue.v_timestamp],
                      (tx, results) => {
                        console.log('Voters Status : ',results.rowsAffected);
                      }
                    ); 
                  });

                  //App Users Table Code
                  txn.executeSql(
                    'DROP TABLE IF EXISTS `app_users`',
                    []
                  );
                  txn.executeSql(
                    'CREATE TABLE IF NOT EXISTS `app_users` (`id` integer, `officer_name` text, `designation` text, `office_address` text, `mobileno` text, `duty_as` integer, `states_id` integer, `districts_id` integer, `blocks_id` integer, `village_id` integer, `booth_id` integer, `photo_download` integer, `voter_data_download` integer, `app_installed` integer, PRIMARY KEY (`id`))',
                    []
                  );
                  userdetails.map((itemValue,index) => {
                    txn.executeSql(
                      'INSERT INTO app_users (id, officer_name, designation, office_address, mobileno, duty_as, states_id, districts_id, blocks_id, village_id, booth_id, photo_download, voter_data_download, app_installed) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
                      [itemValue.id, itemValue.officer_name, itemValue.designation, itemValue.office_address, itemValue.mobileno, itemValue.duty_as, itemValue.states_id, itemValue.districts_id, itemValue.blocks_id, itemValue.village_id, itemValue.booth_id, itemValue.photo_download, itemValue.voter_data_download, 1],
                      (tx, results) => {
                        console.log('App Users Status : ',results.rowsAffected);
                      }
                    ); 
                  });




                       
                        
                      }
                    );
                    
                    
                    let uodate_appusers = await connection.executeUpdate("update `app_users` set `app_installed` = 1 where `id` = "+userdetails[0].id+" LIMIT 1");
                    // let uodate_appusers = await connection.executeUpdate("insert into `app_users` (`officer_name`, `designation`, `office_address`, `mobileno`, `duty_as`, `states_id`, `districts_id`, `blocks_id`, `village_id`, `booth_id`, `photo_download`, `voter_data_download`, `app_installed`) values ('Ashok', 'Programmer', 'Jhajjar', '1234567890', 1, 1, 1, 1, 1, 1, 1, 1, 0);");
                    console.log("Success app user update")
                  } //Else Close
                  
                  // let sahayak_insert = await connection.executeQuery(" call up_instal_sahayak("+this.state.userdetails.id+", '1234567890', '"+this.state.userdetails.d_code+"', '"+this.state.userdetails.b_code+"', '"+this.state.userdetails.v_code+"', '"+boothdetails[0].booth_no+"');");

            
         } catch (error) {
             
         }
         
    
      this.props.navigation.navigate('Dashboard');
    //   navigation.navigate('Dashboard')
    

          
     } 
	onPhoneNumberPressed = async () => {
        try { 
        const phoneNumber = await SmsRetriever.requestPhoneNumber(); 
        var number = phoneNumber.replace(/\D/g, '').slice(-10);
        console.log(number)
        this.setState({
        loading: false,
        mobile_no: number
        })    
        } catch (error) {
        console.log(JSON.stringify(error));
        }
    };
  render() {
      return (
        <View style={styles.container}>
            
            <TouchableOpacity style={styles.buttonInput} >
               <Text style={styles.buttonTextInput}  onPress={() => this.onPhoneNumberPressed()}>{this.state.mobile_no}</Text>
               
                </TouchableOpacity> 
              <TouchableOpacity style={styles.button} >
               <Text style={styles.buttonText}  onPress={() => this.configureData()}>Configure Data</Text>
               
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

export default Login