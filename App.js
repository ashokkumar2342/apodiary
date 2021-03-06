import * as React from 'react';
import { View, Text , Button,StyleSheet,TextInput, TouchableOpacity,Image  } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Loader from './src/screens/Loader';
import Login from './src/screens/Login';
import { Dashboard } from './src/screens/Dashboard';
import { SearchVoter } from './src/screens/SearchVoter';
import { VotePoll } from './src/screens/VotePoll';
import { QueueUpdate } from './src/screens/QueueUpdate';

function ActionBarIcon() {
  return (
    <Image
    source={{uri : 'http://eageskool.com/skool/public/apk/po_logo_1.jpeg'}}
    style={{ width: 390, height: 50,  }} />
  );
}
function HomeScreen({ navigation }) { 
  
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}> 
      <Button
        title="Configure Data"
        onPress={() => navigation.navigate('Details')}
      />
    </View>
  );
}
function DetailsScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Details Screen</Text>
    </View>
  );
}

const Stack = createStackNavigator(); 
const DashboardStack = createStackNavigator(); 
function DashboardStak() {
  return (
    <DashboardStack.Navigator>
        <DashboardStack.Screen options={{          
           title: '' ,
           headerLeft : props => <ActionBarIcon {...props} 
           />
        }} name="Dashboard" component={Dashboard} />
        <DashboardStack.Screen  name="SearchVoter"  component={SearchVoter} options={{          
           title: '' ,
           headerLeft : props => <ActionBarIcon {...props} />
        }} />
        <DashboardStack.Screen  name="VotePoll"  component={VotePoll} options={{ 
           title: '' ,
           headerLeft : props => <ActionBarIcon {...props} />
        }} />
        <DashboardStack.Screen  name="QueueUpdate"  component={QueueUpdate} options={{ 
           title: '' ,
           headerLeft : props => <ActionBarIcon {...props} />
        }} />
    </DashboardStack.Navigator>
  );
}

function App() {
  
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Loader">
        <Stack.Screen name="Loader" component={Loader} options={{
          
          headerLeft: () =>  null,
           headerShown: false ,
        }} />
        <Stack.Screen name="Login"  component={Login} options={{
          
          headerLeft: () =>  null,
           headerShown: false ,
        }} />
        <Stack.Screen name="Dashboard" options={{
          
          headerLeft: () =>  null,
           headerShown: false ,
        }} component={DashboardStak} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 10
  },
  button: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10
  },
  countContainer: {
    alignItems: "center",
    padding: 10
  }
});
export default App;