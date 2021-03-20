
import React, { Component } from 'react';
import { BackHandler, View, Switch, Text ,ScrollView, TextInput,TouchableOpacity,StyleSheet,Linking,Alert,Picker,AsyncStorage} from 'react-native';
import MySqlConnection from 'react-native-my-sql-connection';
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
        serial_number:props.route.params.serial_number,
        ward_no:props.route.params.ward_no,
        input_source:props.route.params.input_source,  
        vote_polled:props.route.params.vote_polled,

        epic_no:props.route.params.epic_no,
        name_l:'',
        fname_l:'',
        age:0,
        gender:'',
        r_fname:'',
        s_ward_no:0,


        pre_vote_polled:0,
        voter_id:0,

       
	}; 
  }
  

  set_voter_detail(){
    let l_epic_no=this.state.epic_no;
    let l_name_l='';
    let l_fname_l='';
    let l_age=0;
    let l_gender='';
    let l_r_fname='';
    let l_poll_status=0;
    let l_total_records=0;
    let l_query='';
    let l_sr_no = this.state.serial_number;
    let l_ward_id = this.state.ward_no;
    let l_voter_id = 0;
    let l_relation = '';
    

    if(this.state.input_source == 2){
      // l_query = "SELECT * FROM voters where ward_id = " + l_ward_id + " and print_sr_no = "+ l_sr_no;
      l_query = "Select `vt`.`id`, `vt`.`voter_card_no`, `vt`.`name_l`, `vt`.`father_name_l`, `vt`.`age`, `vt`.`gender_id`, `vt`.`relation`, `vt`.`polled_status`, `vt`.`print_sr_no`, `wv`.`ward_no`  From `voters` `vt` inner join `ward_villages` `wv` on `wv`.`id` = `vt`.`ward_id` where `vt`.`ward_id` = " + l_ward_id + " and `vt`.`print_sr_no` = " + l_sr_no
      
    }else{
      l_query = "Select `vt`.`id`, `vt`.`voter_card_no`, `vt`.`name_l`, `vt`.`father_name_l`, `vt`.`age`, `vt`.`gender_id`, `vt`.`relation`, `vt`.`polled_status`, `vt`.`print_sr_no`, `wv`.`ward_no`  From `voters` `vt` inner join `ward_villages` `wv` on `wv`.`id` = `vt`.`ward_id` where `vt`.`voter_card_no` = '" + l_epic_no + "'"
    }
    
    db.transaction(function(txn) { 

      txn.executeSql(
        l_query,
        [],
        (tx, results) => {
          l_total_records = results.rows.length
          if(results.rows.length>0){
            let row = results.rows.item(0);
            l_epic_no = row.voter_card_no;
            l_name_l = row.name_l;
            l_fname_l = row.father_name_l;
            l_age = row.age;
            l_gender = row.gender_id;
            l_r_fname = row.relation;
            l_poll_status = row.polled_status;
            l_sr_no = row.print_sr_no;
            l_ward_id = row.ward_no;
            l_voter_id = row.id;
            if(l_r_fname==1){
              l_relation="पिता";  
            }else if(l_r_fname==2){
              l_relation="गुरु";  
            }else if(l_r_fname==3){
              l_relation="पति";  
            }else if(l_r_fname==4){
              l_relation="माता";  
            }else if(l_r_fname==5){
              l_relation="अन्य";  
            }else if(l_r_fname==6){
              l_relation="पत्नी";  
            }
            if(l_poll_status==1){
              alert("Already Polled");
            }
          }else{
            l_epic_no = '';
            l_name_l = '';
            l_fname_l = '';
            l_age = 0;
            l_gender = 0;
            l_r_fname = 0;
            l_poll_status = 0;
            l_sr_no = 0;
            l_ward_id = 0;
            l_voter_id = 0;
            alert("Detail Not Found");
          }  
        }
      );  
    });

    setTimeout(() => {;
      this.setState({
        epic_no: l_epic_no, name_l: l_name_l, fname_l:l_fname_l, gender:l_gender,
        vote_polled:l_poll_status, pre_vote_polled:l_poll_status,
        voter_id:l_voter_id,
        r_fname:l_relation, serial_number:l_sr_no, s_ward_no:l_ward_id,
        })
    },500);
  }

  componentDidMount(){   
    this.set_voter_detail();

  }
   
  updateVotePolled = async ()=>{ 
    let l_voter_id = this.state.voter_id;
    let l_poll_status;
    let l_poll_t = 0;
    let l_poll_m = 0;
    let l_poll_f = 0;
    let l_poll_o = 0;
    let l_gender;
    l_gender = this.state.gender;
    
    if(l_voter_id>0){
      if(this.state.vote_polled==0){
        l_poll_status = 1;
        l_poll_t = 1;
        if(l_gender == 1){
          l_poll_m = 1;  
        }else if(l_gender == 2){
          l_poll_f = 1;  
        }else if(l_gender == 3){
          l_poll_o = 1;  
        }
        this.setState({vote_polled:1})  
      }else{
        l_poll_status = 0;
        l_poll_t = -1;
        if(l_gender == 1){
          l_poll_m = -1;  
        }else if(l_gender == 2){
          l_poll_f = -1;  
        }else if(l_gender == 3){
          l_poll_o = -1;  
        }
        this.setState({vote_polled:0});
        
      }
      // Dashboard.setState({s_test_var:'test'});
      db.transaction(function(txn) {   
        txn.executeSql(
          "UPDATE `voters` set `polled_status` =? WHERE `id` =?",
          [l_poll_status,l_voter_id],
          (tx, results) => {  
            // if(results.rowsAffected>0){
            //   alert('Updated successfully'); 
            // }else{
            //   alert('Updation Failed');
            // }           
          }
        );
        txn.executeSql(
          "UPDATE polling_booths set vote_polled = vote_polled + ?, male_polled = male_polled + ?, female_polled = female_polled + ?, third_polled = third_polled + ?, upload_flag = 1",
          [l_poll_t,l_poll_m, l_poll_f, l_poll_o],
          (tx, results) => {  
            // if(results.rowsAffected>0){
            //   alert('Updated successfully'); 
            // }else{
            //   alert('Updation Failed');
            // }           
          }
        );  
      });

      alert('Updated successfully');
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
            onValueChange={() => this.updateVotePolled()}
            value={this.state.vote_polled ==1 ?true:false}
            />
            </View>
          
            <View style={styles.textBox}> 
                <View style={styles.list}>
                  <Text>EPIC No. : {this.state.epic_no}</Text>
                </View> 
                <View style={styles.list}>
                  <Text>नाम : {this.state.name_l}</Text>
                </View>
                <View style={styles.list}>
                  <Text>{this.state.r_fname} का नाम : {this.state.fname_l}</Text>
                </View> 

                <View style={styles.list}>
                  <Text>वार्ड संख्या : {this.state.s_ward_no}</Text>
                </View> 
                <View style={styles.list}>
                  <Text>क्रम संख्या : {this.state.serial_number}</Text>
                </View> 
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

export default VotePoll