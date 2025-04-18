import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import ButtonFunctionality from './ButtonFunctionality';
import Checkin from './Checkin';
import History from './History';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';

const Stack = createStackNavigator();

const CustomBackButton = ({onPress, label}) => (
  <TouchableOpacity onPress = {onPress} style = {styles.backButton}>
    <Text style ={styles.backText}>{`< ${label}`}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  backButton: {
    marginLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    color: 'blue',
    fontSize: 18,
  },
});

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName = "Home"
        screenOptions = {{
          headerTitleAlign: 'center', 
        }}
      >
        <Stack.Screen
          name="Home"
          component = {ButtonFunctionality}
          options = {{
            title: 'Home',
          }}
        />
        <Stack.Screen
          name="Checkin"
          component = {Checkin}
          options = {({navigation}) => ({
            title: 'Checkin',
            headerLeft: () => (
              <CustomBackButton onPress={() => navigation.goBack()} label="Home" />
            ),
          })}
        />
        <Stack.Screen
          name="History"
          component = {History}
          options = {({navigation}) => ({
            title: 'History',
            headerLeft: () => (
              <CustomBackButton onPress={() => navigation.goBack()} label="Home" />
            ),
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
