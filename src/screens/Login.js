
import React, { Component } from 'react';
import { View, Text , TextInput,TouchableOpacity,StyleSheet,Alert,Picker,AsyncStorage} from 'react-native';
import MySqlConnection from 'react-native-my-sql-connection';
import Button from 'react-native-material-ui';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'; 
import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase({ name: 'VoterDatabase.db' });
let config = {
    host:'65.0.152.5',
    database:'admin_voter',
    user:'admin_voter',
    password:'admin_voter', 
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
	 checkLogin = async ()=>{
     const {mobile_no,password}=this.state  
      
      try{
          const connection = await MySqlConnection.createConnection(config);
          let userdetails = await connection.executeQuery("SELECT id,d_code,b_code,v_code,max_sahayak FROM app_users WHERE mobile_no = '"+mobile_no+"' AND  password = '"+password+"' AND  status = 1 LIMIT 1");
   
          if (userdetails.length == 0) {
            alert("Invalid Mobile and Password")
          }else{
            let sahayak_list = await connection.executeQuery("select count(*) as already_sahayak from sahayak_list where app_user_id = '"+userdetails[0].id+"'");
            
            if (userdetails[0].max_sahayak > sahayak_list[0].already_sahayak) {
                let booth = await connection.executeQuery("SELECT id, booth_no,	b_name FROM booths WHERE d_code = '"+userdetails[0].d_code+"' AND  b_code = '"+userdetails[0].b_code+"' AND v_code = '"+userdetails[0].v_code+"' order by 'booth_no'");
                this.setState({
                        loading: false,
                        userdetails: userdetails[0]
                }) 
                this.setState({
                    loading: false,
                    options: booth
                })   
            }else{
                alert("Maximum "+sahayak_list[0].already_sahayak+" Sahayak Allowed Plz contact your admin.") 
            }
              
          }   
          connection.close(); 
           
      }catch(err){
          
      }  
 
     }
     configureData = async ()=>{  
         try {
            const connection = await MySqlConnection.createConnection(config);
            
            let boothdetails = await connection.executeQuery("SELECT * FROM booths WHERE id = '"+this.state.setSelectedValue+"' LIMIT 1"); 
           
            // let insert = await connection.executeQuery("INSERT INTO sahayak_list (app_user_id, mobile_no, d_code, b_code, v_code, booth_no) values (1, 1234567890, d1, b1, v1, b1)");
            // console.log(insert[0])
            if (boothdetails.length == 0) {
                alert("Invalid Booth")
            }else{
                let voters = await connection.executeQuery("SELECT * FROM voters WHERE d_code = '"+boothdetails[0].d_code+"' AND b_code = '"+boothdetails[0].b_code+"' AND  v_code = '"+boothdetails[0].v_code+"'");
                
                db.transaction(function(txn) { 
                    txn.executeSql(
                      "SELECT name FROM sqlite_master WHERE type='table' AND name='voters'",
                      [],
                      function(tx, res) {
                          txn.executeSql('DROP TABLE IF EXISTS voters', []);
                          txn.executeSql(
                            'CREATE TABLE IF NOT EXISTS voters(id INTEGER PRIMARY KEY AUTOINCREMENT, name_e TEXT, father_name TEXT, age INTEGER, wardno INTEGER, booth_no TEXT, srno INTEGER, epicno TEXT, favour_status INTEGER, vote_polled INTEGER, mobileno TEXT, parivaar_id INTEGER, sah_sahayak_id INTEGER)',
                            []
                          );
                          txn.executeSql(
                            'CREATE TABLE IF NOT EXISTS booths(boothno TEXT, booth_name TEXT)',
                            []
                          );
                          txn.executeSql(
                            'CREATE TABLE IF NOT EXISTS parivaars(id INTEGER PRIMARY KEY AUTOINCREMENT, parivaar_name TEXT UNIQUE, mobileno TEXT)',
                            []
                          );
                          txn.executeSql(
                            'CREATE TABLE IF NOT EXISTS sahshayaks(id INTEGER PRIMARY KEY AUTOINCREMENT, name_e TEXT UNIQUE, mobileno TEXT)',
                            []
                          );
                          txn.executeSql(
                            'CREATE INDEX  v_name ON voters(name_e ASC, father_name ASC)',
                            []
                          );
                          txn.executeSql(
                            'CREATE TABLE appuserdetail (boothno TEXT, mobileno TEXT)',
                            []
                          );

                          txn.executeSql(
                            "INSERT INTO appuserdetail (boothno, mobileno) VALUES ('"+boothdetails[0].booth_no+"','1234567890')",
                            [],
                          );

                          voters.map((itemValue,index) => {  
                            txn.executeSql(
                                'INSERT INTO voters (name_e, father_name, age, wardno, booth_no, srno, epicno, mobileno, favour_status, vote_polled, parivaar_id, sah_sahayak_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',
                                [itemValue.name_e, itemValue.fname_e, itemValue.age,itemValue.v_ward,itemValue.booth_no,itemValue.srno,itemValue.card_no,itemValue.mobile_no,0,0,0,0],
                                (tx, results) => {
                                  console.log('Insert Results',results.rowsAffected);
                                  if(results.rowsAffected>0){
                                    console.log('Creaded Successfully'); 
                                  }else{
                                    console.log('Updation Failed');
                                  }
                                }
                              ); 
                        })
                        options.map((itemValue,index) => {  
                              txn.executeSql(
                                'INSERT INTO booths (boothno, booth_name) VALUES (?,?)',
                                [itemValue.boothno, itemValue.booth_name],
                                (tx, results) => {
                                  console.log('Insert Results',results.rowsAffected);
                                  if(results.rowsAffected>0){
                                    console.log('Booth Creaded Successfully'); 
                                  }else{
                                    console.log('Booth Created Failed');
                                  }
                                }
                              ); 
                        })
                       

                      }
                    );
                    
                  });
                  
                  let sahayak_insert = await connection.executeQuery(" call up_instal_sahayak("+this.state.userdetails.id+", '1234567890', '"+this.state.userdetails.d_code+"', '"+this.state.userdetails.b_code+"', '"+this.state.userdetails.v_code+"', '"+boothdetails[0].booth_no+"');");

                
            }
            
         } catch (error) {
             
         }
         
    
      this.props.navigation.navigate('Dashboard');
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