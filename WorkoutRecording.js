import React, { useState } from 'react';
import { TextInput, TouchableOpacity, Button, FlatList, Text, View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const WorkoutRecording = () => {
  const navigation = useNavigation();

  const [list, setlist] = useState([
  ]);
  const [inputText, setInputText] = useState('');

  const Item = ({ item, onPress, backgroundColor, textColor }) => (
    <TouchableOpacity onPress={onPress} style={{ backgroundColor }}>
      <Text style={[styles.input, textColor]}>{item.key}</Text>
    </TouchableOpacity>
  );

  function addLabel() {
    if (inputText.trim() === '') {
      alert('Please enter a valid item');
      return;
    }
    const newList = [...list, { key: inputText, selected: false }];
    setlist(newList);
    setInputText('');
  }

  function toggleList(akey) {
  let newList = list.map((item) =>
    item.key === akey ? { ...item, selected: !item.selected } : item
  );

  setlist(newList);
}

function deleteLabel() {
  setlist(list.filter((item) => !item.selected));
}

function checkOutLabel() {
  setlist(list.filter((item) => !item.selected));
  navigation.navigate('Home');
}

  function frenderItem({ item }) {
    const backgroundColor = item.selected ? '#800020' : 'beige';
    const color = item.selected ? 'white' : 'black';
    return <Item backgroundColor={backgroundColor} textColor={{ color }} item={item} onPress={   () => toggleList(item.key)} />;
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  middle: {
    flex: 1,
  },
});

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter exercise name, number of reps and weight used."
        value={inputText}
        onChangeText={(text) => setInputText(text)}
      />
      
      <View style={styles.buttonContainer}>
        <Button title="Add Exercise" onPress={addLabel} />
        <Button title="Remove Exercise" onPress={deleteLabel} />
        <Button title="Check out" onPress={checkOutLabel} />
        
      </View>
      
      <FlatList style={styles.middle} data={list} renderItem={frenderItem} keyExtractor={(item) => item.key} />
    </View>
  );
};

export default WorkoutRecording;
