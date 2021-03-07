
import React, { Component } from 'react';
import { View, Text , TextInput,TouchableOpacity,StyleSheet,Alert,Picker,AsyncStorage} from 'react-native';
import MySqlConnection from 'react-native-my-sql-connection';
import Button from 'react-native-material-ui';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'; 
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
	}; 
  }
  
  componentDidMount(){     
    let check ='';
    db.transaction(function(txn) {  
              txn.executeSql(
                'SELECT count(*) as total FROM voters',
                [],
                function(txt,res){ 
                    check= res.rows.item(0).total 
                }
              ); 
        
      }); 
    setTimeout(() => { 
        if(check == 0){ 
            console.log(check)
        } else{
        this.props.navigation.navigate('Dashboard'); 
            
        }
    }, 100) 
  }
  
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
            // alert(mobile_no)
            // return false
            const connection = await MySqlConnection.createConnection(config);
            
            let userdetails = await connection.executeQuery("SELECT * FROM app_users WHERE mobileno = '"+mobile_no+"' LIMIT 1"); 
           
            // let insert = await connection.executeQuery("INSERT INTO sahayak_list (app_user_id, mobile_no, d_code, b_code, v_code, booth_no) values (1, 1234567890, d1, b1, v1, b1)");
            // console.log(insert[0])
            if (userdetails.length == 0) {
                alert("Invalid User")
            }else{
                let voters = await connection.executeQuery("SELECT * FROM voters WHERE d_code = '"+boothdetails[0].d_code+"' AND b_code = '"+boothdetails[0].b_code+"' AND  v_code = '"+boothdetails[0].v_code+"'");
                
                db.transaction(function(txn) { 
                    txn.executeSql(
                      "SELECT name FROM sqlite_master WHERE type='table' AND name='voters'",
                      [],
                      function(tx, res) {
                          txn.executeSql(
                            'CREATE TABLE IF NOT EXISTS `states` (`id` integer, `code` text, `name_e` text, `name_l` text, PRIMARY KEY (`id`))',
                            []
                          );
                          txn.executeSql(
                            'CREATE TABLE IF NOT EXISTS `districts`(`id` integer, `state_id` integer, `code` text, `name_e` text, `name_l` text, PRIMARY KEY (`id`))',
                            []
                          );
                          txn.executeSql(
                            'CREATE TABLE IF NOT EXISTS `blocks_mcs`(`id` integer, `states_id` integer, `districts_id` integer, `code` text, `name_e` text, `name_l` text, `block_mc_type_id` integer, `stamp_l1` text, `stamp_l2` text, PRIMARY KEY (`id`))',
                            []
                          );
                          txn.executeSql(
                            'CREATE TABLE IF NOT EXISTS `ward_villages`(`id` integer, `states_id` integer, `districts_id` integer, `blocks_id` integer, `village_id` integer, `ward_no` integer, `name_e` text, `name_l` text, `is_locked` integer, `ps_ward_id` integer, PRIMARY KEY (`id`))',
                            []
                          );
                          txn.executeSql(
                            'CREATE TABLE IF NOT EXISTS `voters` (`id` integer, `district_id` integer, `assembly_id` integer, `assembly_part_id` integer, `voter_card_no` text, `sr_no` integer, `house_no_e` text, `house_no_l` text, `house_no` integer, `aadhar_no` text, `name_e` text, `name_l` text, `father_name_e` text, `father_name_l` text, `relation` integer, `gender_id` integer, `age` integer, `mobile_no` text, `village_id` integer, `ward_id` integer, `print_sr_no` integer, `source` text, `suppliment_no` integer, `status` integer, `booth_id` integer, `polled_status` integer, `v_timestamp` datetime, PRIMARY KEY (`id`))',
                            []
                          );
                          txn.executeSql(
                            'CREATE TABLE IF NOT EXISTS `polling_booths` (`id` integer, `states_id` integer, `districts_id` integer, `blocks_id` integer, `village_id` integer, `booth_no` integer, `name_e` text, `name_l` text, `booth_no_c` text, `total_voters` integer, `male_voters` integer, `female_voters` integer, `third_voters` integer, PRIMARY KEY (`id`))',
                            []
                          );
                          txn.executeSql(
                            'CREATE TABLE IF NOT EXISTS `app_users` (`id` integer, `officer_name` text, `designation` text, `office_address` text, `mobileno` text, `duty_as` integer, `states_id` integer, `districts_id` integer, `blocks_id` integer, `village_id` integer, `booth_id` integer, `photo_download` integer, `voter_data_download` integer, `app_installed` integer, PRIMARY KEY (`id`))',
                            []
                          );
                          txn.executeSql(
                            'CREATE TABLE IF NOT EXISTS `polling_activity_status` (`id` integer, `states_id` integer, `districts_id` integer, `blocks_id` integer, `village_id` integer, `booth_id` integer, `activity_status` integer, `updated_by` integer, `updated_at` datetime, `upload_flag` integer, PRIMARY KEY (`id`))',
                            []
                          );

                          txn.executeSql(
                            'CREATE TABLE IF NOT EXISTS `activity_status_1` (`id` integer, `states_id` integer, `districts_id` integer, `blocks_id` integer, `village_id` integer, `booth_id` integer, `activity_status` integer, `updated_by` integer, `updated_at` datetime, `upload_flag` integer, PRIMARY KEY (`id`))',
                            []
                          );

                          txn.executeSql(
                            'CREATE TABLE IF NOT EXISTS `activity_status_2` (`id` integer, `states_id` integer, `districts_id` integer, `blocks_id` integer, `village_id` integer, `booth_id` integer, `activity_status` integer, `updated_by` integer, `updated_at` datetime, `upload_flag` integer, PRIMARY KEY (`id`))',
                            []
                          );

                          txn.executeSql(
                            'CREATE TABLE IF NOT EXISTS `activity_status_3` (`id` integer, `states_id` integer, `districts_id` integer, `blocks_id` integer, `village_id` integer, `booth_id` integer, `activity_status` integer, `updated_by` integer, `updated_at` datetime, `upload_flag` integer, PRIMARY KEY (`id`))',
                            []
                          );

                          txn.executeSql(
                            'CREATE TABLE IF NOT EXISTS `activity_status_4` (`id` integer, `states_id` integer, `districts_id` integer, `blocks_id` integer, `village_id` integer, `booth_id` integer, `activity_status` integer, `updated_by` integer, `updated_at` datetime, `upload_flag` integer, PRIMARY KEY (`id`))',
                            []
                          );

                          txn.executeSql(
                            'CREATE TABLE IF NOT EXISTS `activity_status_5` (`id` integer, `states_id` integer, `districts_id` integer, `blocks_id` integer, `village_id` integer, `booth_id` integer, `activity_status` integer, `updated_by` integer, `updated_at` datetime, `upload_flag` integer, PRIMARY KEY (`id`))',
                            []
                          );

                          txn.executeSql(
                            'CREATE TABLE IF NOT EXISTS `activity_status_6` (`id` integer, `states_id` integer, `districts_id` integer, `blocks_id` integer, `village_id` integer, `booth_id` integer, `activity_status` integer, `updated_by` integer, `updated_at` datetime, `upload_flag` integer, PRIMARY KEY (`id`))',
                            []
                          );

                          txn.executeSql(
                            'CREATE TABLE IF NOT EXISTS `activity_status_7` (`id` integer, `states_id` integer, `districts_id` integer, `blocks_id` integer, `village_id` integer, `booth_id` integer, `activity_status` integer, `updated_by` integer, `updated_at` datetime, `upload_flag` integer, PRIMARY KEY (`id`))',
                            []
                          );

                          txn.executeSql(
                            'CREATE TABLE IF NOT EXISTS `activity_status_8` (`id` integer, `states_id` integer, `districts_id` integer, `blocks_id` integer, `village_id` integer, `booth_id` integer, `activity_status` integer, `updated_by` integer, `updated_at` datetime, `upload_flag` integer, PRIMARY KEY (`id`))',
                            []
                          );

                          txn.executeSql(
                            'CREATE TABLE IF NOT EXISTS `activity_status_9` (`id` integer, `states_id` integer, `districts_id` integer, `blocks_id` integer, `village_id` integer, `booth_id` integer, `activity_status` integer, `updated_by` integer, `updated_at` datetime, `upload_flag` integer, PRIMARY KEY (`id`))',
                            []
                          );

                          txn.executeSql(
                            'CREATE TABLE IF NOT EXISTS `activity_status_10` (`id` integer, `states_id` integer, `districts_id` integer, `blocks_id` integer, `village_id` integer, `booth_id` integer, `activity_status` integer, `updated_by` integer, `updated_at` datetime, `upload_flag` integer, PRIMARY KEY (`id`))',
                            []
                          );

                          txn.executeSql(
                            'CREATE TABLE IF NOT EXISTS `activity_status_11` (`id` integer, `states_id` integer, `districts_id` integer, `blocks_id` integer, `village_id` integer, `booth_id` integer, `activity_status` integer, `updated_by` integer, `updated_at` datetime, `upload_flag` integer, PRIMARY KEY (`id`))',
                            []
                          );

                          txn.executeSql(
                            'CREATE TABLE IF NOT EXISTS `activity_status_vote_polled` (`id` integer, `states_id` integer, `districts_id` integer, `blocks_id` integer, `village_id` integer, `booth_id` integer, `vote_polled` integer, `male_polled` integer, `female_polled` integer, `third_polled` integer, `updated_by` integer, `updated_at` datetime, `upload_flag` integer, PRIMARY KEY (`id`))',
                            []
                          );
                          
                        //   voters.map((itemValue,index) => {  
                        //     txn.executeSql(
                        //         'INSERT INTO voters (name_e, father_name, age, wardno, booth_no, srno, epicno, mobileno, favour_status, vote_polled, parivaar_id, sah_sahayak_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',
                        //         [itemValue.name_e, itemValue.fname_e, itemValue.age,itemValue.v_ward,itemValue.booth_no,itemValue.srno,itemValue.card_no,itemValue.mobile_no,0,0,0,0],
                        //         (tx, results) => {
                        //           console.log('Insert Results',results.rowsAffected);
                        //           if(results.rowsAffected>0){
                        //             console.log('Creaded Successfully'); 
                        //           }else{
                        //             console.log('Updation Failed');
                        //           }
                        //         }
                        //       ); 
                        // })
                        // options.map((itemValue,index) => {  
                        //       txn.executeSql(
                        //         'INSERT INTO booths (boothno, booth_name) VALUES (?,?)',
                        //         [itemValue.boothno, itemValue.booth_name],
                        //         (tx, results) => {
                        //           console.log('Insert Results',results.rowsAffected);
                        //           if(results.rowsAffected>0){
                        //             console.log('Booth Creaded Successfully'); 
                        //           }else{
                        //             console.log('Booth Created Failed');
                        //           }
                        //         }
                        //       ); 
                        // })
                       

                      }
                    );
                    
                  });
                  
                  // let sahayak_insert = await connection.executeQuery(" call up_instal_sahayak("+this.state.userdetails.id+", '1234567890', '"+this.state.userdetails.d_code+"', '"+this.state.userdetails.b_code+"', '"+this.state.userdetails.v_code+"', '"+boothdetails[0].booth_no+"');");

                
            }
            
         } catch (error) {
             
         }
         
    
      // this.props.navigation.navigate('Dashboard');
    //   navigation.navigate('Dashboard')
    

          
     } 
	 
  render() {
    return (
      <View style={styles.container}>
          <TextInput style={styles.inputBox} 
              underlineColorAndroid='rgba(0,0,0,0)' 
              placeholder="Enter Mobile No"
              placeholderTextColor = "#ffffff"
              selectionColor="#fff"
              keyboardType="numeric"
              onChangeText={text=> this.setState({mobile_no:text})}
              />
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
  }
});

export default Login