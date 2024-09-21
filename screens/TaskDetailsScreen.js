import React from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';

const TaskDetailsScreen = ({ route }) => {
  const { task } = route.params;

  return (
    <ScrollView style={{backgroundColor: '#222629'}}>
      <View style={styles.view}>
        <Text style={styles.text}>Title</Text>
        <Text style={styles.textInput}>{task.title}</Text>
        
        <Text style={styles.text}>Description</Text>
        <Text style={styles.textInput}>{task.description}</Text>

        <Text style={styles.text}>Date&Time</Text>
        <Text style={styles.textInput}>{new Date(task.date).toLocaleString()}</Text>
        
        <Text style={styles.text}>Location</Text>
        <Text style={styles.textInput}>{task.location}</Text>

        <Text style={styles.text}>Status</Text>
        <Text style={styles.textInput}>{task.status}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  textInput: {
    color: "white",
    fontSize: 18,
    minHeight: 50,
    padding: 10, 
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 15, 
    marginBottom: 10
  },
  text: {
    color: "white",
    padding: 5
  },
  view: {
    flex: 1,
    padding: 20,
    margin: 20,
    borderRadius: 25,
    backgroundColor: '#474b4f',
  }
});

export default TaskDetailsScreen;