 
import React, { Component } from 'react';
import { BackHandler,View, Text , ScrollView,TextInput,TouchableOpacity,StyleSheet,Alert,Picker,AsyncStorage} from 'react-native';
import MySqlConnection from 'react-native-my-sql-connection'; 
import { openDatabase } from 'react-native-sqlite-storage';
import Icon from 'react-native-vector-icons/FontAwesome'; 
import { NavigationContainer } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
var db = openDatabase({ name: 'VoterDatabase.db' });
let config = {
  host:'65.0.152.5',
  database:'admin_voter',
  user:'admin_voter',
  password:'admin_voter', 
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
	 setOptionValue = async (class_id)=>{ 
        this.setState({ 
        setSelectedValue: class_id
        })
    } 
    goToProfile = () =>
    { 
        this.props.navigation.push('Profile')
    }
    searchVoter = () =>
    {
        
     console.log(this.props.navigation.navigate)
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
                    <TouchableOpacity activeOpacity = { .5 } onPress={ this.goToProfile }> 
                        <View style={styles.menuBox}>
                            <Icon name="user" size={30} color="#900" /> 
                            <Text style={styles.info} onPress={() => this.goToProfile}>Profile</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity = { .5 } onPress={ this.searchVoter }> 
                        <View style={styles.menuBox}>
                            <Icon name="search" size={30} color="#900" /> 
                            <Text style={styles.info} onPress={() => this.searchVoter}>Search Voter</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity = { .5 } onPress={ this.goToProfile }> 
                        <View style={styles.menuBox}>
                            <Icon name="rocket" size={30} color="#900" /> 
                            <Text style={styles.info} onPress={() => this.goToProfile}>Parivaar Mapping</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity = { .5 } onPress={ this.goToProfile }> 
                        <View style={styles.menuBox}>
                            <Icon name="rocket" size={30} color="#900" /> 
                            <Text style={styles.info} onPress={() => this.goToProfile}>Profile</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity = { .5 } onPress={ this.goToProfile }> 
                        <View style={styles.menuBox}>
                            <Icon name="rocket" size={30} color="#900" /> 
                            <Text style={styles.info} onPress={() => this.goToProfile}>Profile</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity = { .5 } onPress={ this.goToProfile }> 
                        <View style={styles.menuBox}>
                            <Icon name="rocket" size={30} color="#900" /> 
                            <Text style={styles.info} onPress={() => this.goToProfile}>Profile</Text>
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