import React, { useEffect, useState } from 'react';
import { Text, View, Alert, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';

// Styling Sheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topHalf: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 20,
  },
  map: {
    flex: 1,
  },
  buttonContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#3399FF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
  },
  bottomHalf: {
    flex: 1,
    padding: 10,
  },
  input: {
    marginBottom: 10,
    borderBottomWidth: 1,
    padding: 8,
  },
  activityCard: {
    marginVertical: 5,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
  },
});

const Checkin = () => {
  const [region, setRegion] = useState(null);
  const [activities, setActivities] = useState([]);
  const [type, setType] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [sets, setSets] = useState('');
  const [checkinTime, setCheckinTime] = useState('');

  // Getting permission for location, just like camera
  useEffect(() => {
    const getLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission denied',
          'We need your location to make sure you’re where the action is!'
        );
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    };
    getLocation();
  }, []);

  /**
   * Function to handle checking in with location and time
   */
  const handleCheckin = () => {
    if (region) {
      const currentTime = new Date().toLocaleString(); // Get current date and time based on device time 
      setCheckinTime(currentTime);
      Alert.alert('Checked In', `Checked in at: ${currentTime}`);
    }
  };

  /**
   * Function to handle checking out by sending data as JSON object to backend url
   */
const handleCheckout = async () => {
  if (!checkinTime) {
    Alert.alert('Error', 'You need to check in before you can checkout!');
    return;
  }

  const checkoutData = {
    [checkinTime]: {
      location: {
        latitude: region.latitude,
        longitude: region.longitude,
      },
      activities: activities,
    },
  };

  try {
    // Fetch data
    const response = await fetch(
      'https://mec402.boisestate.edu/csclasses/cs402/project/loadjson.php?user=couchrepel'
    );

    if (response.ok) {
      const existingData = await response.json();

      // Append data
      const updatedData = { ...existingData, ...checkoutData };

      // Send the updated data back to the server (inefficient, but the backend url doesn't automatically append data, so this will do)
      const updateResponse = await fetch(
        'https://mec402.boisestate.edu/csclasses/cs402/project/savejson.php?user=couchrepel',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (updateResponse.ok) {
        Alert.alert('Checkout successful');
      } else {
        Alert.alert('Checkout failed');
      }
    } else {
      Alert.alert('Failed to fetch existing data');
    }
  } catch (error) {
    Alert.alert('Error', 'An error occurred while checking out.');
  }
};


  /**
   * Function to add new activity 
   */
  const handleAddActivity = () => {
    if (type && reps && weight && sets) {
      const newActivity = { type, reps, weight, sets };
      setActivities([...activities, newActivity]);
      setType('');
      setReps('');
      setWeight('');
      setSets('');
    } else {
      Alert.alert('Missing fields', 'Please fill out all fields.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topHalf}>
        {/* Displaying map */}
        {region ? (
          <MapView
            style={styles.map}
            region={region}
            showsUserLocation={true}
            showsMyLocationButton={true}>
            <Marker coordinate={region} title="My Location" />
          </MapView>
        ) : (
          <Text>Loading your location...</Text>
        )}
        {/* Check-In button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleCheckin}>
            <Text style={styles.buttonText}>Check In</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.bottomHalf}>
        <ScrollView>
          <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>
            Add Gym Activity
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Type"
            value={type}
            onChangeText={setType}
          />
          <TextInput
            style={styles.input}
            placeholder="Reps"
            value={reps}
            onChangeText={setReps}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Weight"
            value={weight}
            onChangeText={setWeight}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Sets/Duration"
            value={sets}
            onChangeText={setSets}
            keyboardType="numeric"
          />

          {/* Add button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleAddActivity}>
              <Text style={styles.buttonText}>Add</Text>
            </TouchableOpacity>
          </View>

          {/* Displaying list */}
          <Text style={{ fontWeight: 'bold', marginVertical: 10 }}>
            Log Entry:
          </Text>
          {activities.map((activity, index) => (
            <View key={index} style={styles.activityCard}>
              <Text>Type: {activity.type}</Text>
              <Text>Reps: {activity.reps}</Text>
              <Text>Weight: {activity.weight} lbs</Text>
              <Text>Sets/Duration: {activity.sets}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Check-Out button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleCheckout}>
          <Text style={styles.buttonText}>Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Checkin;
