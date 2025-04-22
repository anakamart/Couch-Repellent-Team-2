import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const screenWidth = Dimensions.get('window').width;

const History = () => {
  const [view, setView] = useState('Past Record');
  const [records, setRecords] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await fetch(
          'https://mec402.boisestate.edu/csclasses/cs402/project/loadjson.php?user=couchrepel'
        );
        const data = await response.json();
        setRecords(data);
      } catch (error) {
        Alert.alert('Error', 'Unable to fetch records.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[ styles.button, view === 'Past Record' && styles.activeButton, { width: screenWidth / 2 } ]}
          onPress={() => setView('Past Record')}>
          <Text style={styles.buttonText}>Past Record</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            view === 'Location' && styles.activeButton,
            { width: screenWidth / 2 },
          ]}
          onPress={() => setView('Location')}>
          <Text style={styles.buttonText}>Location</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <Text style={styles.text}>Loading records...</Text>
      ) : view === 'Past Record' ? (
        <ScrollView style={styles.content}>
          {Object.keys(records).length > 0 ? (
            Object.entries(records).map(([timestamp, record], index) => (
              <View key={index} style={styles.recordContainer}>
                <Text style={styles.dateText}>Date and Time: {timestamp}</Text>
                {record.activities.map((activity, idx) => (
                  <View key={idx} style={styles.activityCard}>
                    <Text style={styles.text}>Type: {activity.type}</Text>
                    <Text style={styles.text}>Reps: {activity.reps}</Text>
                    <Text style={styles.text}>Weight: {activity.weight} lbs</Text>
                    <Text style={styles.text}>Sets/Duration: {activity.sets}</Text>
                  </View>
                ))}
              </View>
            ))
          ) : (
            <Text style={styles.text}>No records available.</Text>
          )}
        </ScrollView>
      ) : (
        <ScrollView style={styles.content}>
          {Object.keys(records).length > 0 ? (
            Object.entries(records).map(([timestamp, record], index) => (
              <View key={index} style={styles.recordContainer}>
                <Text style={styles.dateText}>Date and Time: {timestamp}</Text>
                <MapView
                  style={styles.map}
                  region={{
                    latitude: record.location.latitude,
                    longitude: record.location.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }}
                  showsUserLocation={false}
                  scrollEnabled={false}
                  zoomEnabled={false}>
                  <Marker
                    coordinate={{
                      latitude: record.location.latitude,
                      longitude: record.location.longitude,
                    }}
                    title="Past Location"
                  />
                </MapView>
              </View>
            ))
          ) : (
            <Text style={styles.text}>No location records available.</Text>
          )}
        </ScrollView>
      )}
    </View>
  );
};

const primary = 'white';
const secondary = 'blue';
const tertiary = 'green';
const quaternary = 'black';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: primary,
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'gray',
    padding: 10,
  },
  activeButton: {
    backgroundColor: secondary,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  content: {
    width: '90%',
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
    color: quaternary,
  },
  recordContainer: {
    marginVertical: 10,
    padding: 10,
    borderWidth: 5,
    borderRadius: 5,
    borderColor: secondary,
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: tertiary,
  },
  map: {
    height: 200,
    marginVertical: 10,
  },
  activityCard: {
    marginVertical: 5,
    padding: 10,
    borderWidth: 3,
    borderRadius: 5,
    borderColor: tertiary,
  },
});

export default History;
