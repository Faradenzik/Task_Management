import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, Text, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import Toast from 'react-native-toast-message';

const AddTaskScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [inputHeight, setInputHeight] = useState(50);
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [mode, setMode] = useState('date');
  const placeholderStyle = {
    placeholderTextColor: '#6B6E70',
  };

  const handleContentSizeChange = (event) => {
    const contentHeight = event.nativeEvent.contentSize.height;
    const maxHeight = 200;
    
    if (contentHeight < maxHeight) {
      setInputHeight(contentHeight);
    } else {
      setInputHeight(maxHeight);
    }
  };

  const showDatePicker = () => {
    setMode('date');
    setShowPicker(true);
  };

  const showTimePicker = () => {
    setMode('time');
    setShowPicker(true);
  };

  const onDateChange = (event, selectedDate) => {
    setShowPicker(false);
    if (selectedDate) {
      setDate(selectedDate);
      if (mode === 'date') {
        showTimePicker();
      }
    }
  };

  const saveTask = async () => {
    if (!title) {
      Toast.show({
        text1: 'Please, enter the title',
        type: 'info',
        position: 'bottom',
        color: 'white',
        visibilityTime: 2000,
        autoHide: true,
      });
      return;
    }

    const newTask = {
      id: Date.now(),
      title,
      description,
      date,
      location,
      status: 'In Progress',
    };

    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      const tasks = storedTasks ? JSON.parse(storedTasks) : [];
      tasks.push(newTask);
      await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
      navigation.goBack();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ScrollView style={{ height: '100%', padding: 20, backgroundColor: '#222629' }}>
      <Text style={styles.text}>Title</Text>
      <TextInput placeholder="Enter title" {...placeholderStyle} value={title} onChangeText={setTitle} style={styles.textInput} />
      
      <Text style={styles.text}>Description</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        style={[styles.textInput, { height: Math.max(50, inputHeight) }]}
        placeholder="Enter description"
        {...placeholderStyle}
        multiline={true}
        scrollEnabled={inputHeight >= 200}
        onContentSizeChange={handleContentSizeChange}
      />

      <Text style={styles.text}>Date&Time</Text>
      <TouchableOpacity style={styles.textInput} onPress={showDatePicker}>
        <Text style={{fontSize: 18, color: "white"}}>{date.toLocaleString()}</Text>
      </TouchableOpacity>
      
      <Text style={styles.text}>Location</Text>
      <TextInput placeholder="Enter location" {...placeholderStyle} value={location} onChangeText={setLocation} style={styles.textInput} />

      <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={saveTask}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>

      {showPicker && (
        <DateTimePicker
          value={date}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={onDateChange}
        />
      )}
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    alignItems: 'center'
  },
  textInput: {
    color: "white",
    fontSize: 18,
    height: 50,
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
  button: {
    backgroundColor: '#86C232',
    height: 50,
    width: '60%',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddTaskScreen;