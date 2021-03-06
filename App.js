import * as React from 'react';
import { View, Text , Button,StyleSheet,TextInput, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './src/screens/Login';
import { Dashboard } from './src/screens/Dashboard';

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
          headerLeft: () =>  null,
        }} name="Dashboard" component={Dashboard} />
      
    </DashboardStack.Navigator>
  );
}

function App() {
  
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Home" component={Login} />
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