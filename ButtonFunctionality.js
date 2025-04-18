import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const primary = 'white';
const secondary = 'blue';
const tertiary = 'green';
const quaternary = 'red';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: primary,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonContainer: {
    padding: 10,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonCheckin: {
    backgroundColor: secondary,
    padding: 10,
    borderRadius: 5,
    margin: 5
  },
  buttonHistory: {
    backgroundColor: tertiary,
    padding: 10,
    borderRadius: 5,
    margin: 5
  },
  buttonRecord: {
    backgroundColor: quaternary,
    padding: 10,
    borderRadius: 5,
    margin: 5
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: tertiary
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center'
  }
});

const ButtonFunctionality = ({navigation}) => {
  return (
    <View style = {styles.container}>
      <Text style = {styles.text}>Choose an option:</Text>
      <View style = {styles.buttonContainer}>
        <TouchableOpacity style = {styles.buttonCheckin} onPress = {() => navigation.navigate('Checkin')}>
          <Text style = {styles.buttonText}>Check In</Text>
        </TouchableOpacity>
        <TouchableOpacity style = {styles.buttonHistory} onPress = {() => navigation.navigate('History')}>
          <Text style = {styles.buttonText}>History</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonRecord} onPress={() => navigation.navigate('Workout Recording')}>
          <Text style={styles.buttonText}>Workout Recording</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ButtonFunctionality;
