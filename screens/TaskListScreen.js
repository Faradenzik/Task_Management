import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';

const TaskListScreen = ({ navigation }) => {
  const [tasks, setTasks] = useState([]);
  const [sortType, setSortType] = useState('date');
  const [selectedTasks, setSelectedTasks] = useState(new Set());
  const [selectionMode, setSelectionMode] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);
  const [statusOptions] = useState(['In Progress', 'Completed', 'Cancelled']);

  const toggleTaskSelection = (id) => {
      setSelectedTasks((prevSelected) => {
        const newSelected = new Set(prevSelected);
        if (newSelected.has(id)) {
          newSelected.delete(id);
          if (newSelected.size === 0) {
            setSelectionMode(false);
          }
        } else {
          newSelected.add(id);
        }
        return newSelected;
      });
    };
  
  const handleLongPress = (item) => {
    if (!selectionMode) {
      setSelectionMode(true);
    }
    toggleTaskSelection(item.id);
  };

  const handleDeleteSelected = () => {
    const tasksToDelete = Array.from(selectedTasks);
    const updatedTasks = tasks.filter(task => !tasksToDelete.includes(task.id));
    saveTasks(updatedTasks);
    setSelectedTasks(new Set());
    setSelectionMode(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      loadTasks();
    }, [])
  );

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const saveTasks = async (tasks) => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
      setTasks(tasks);
    } catch (error) {
      console.error(error);
    }
  };

  const changeTaskStatus = (id, status) => {
    const newTasks = tasks.map(task => task.id === id ? { ...task, status } : task);
    saveTasks(newTasks);
  };

  const openStatusModal = (id) => {
    setCurrentTaskId(id);
    setModalVisible(true);
  };

  const selectStatus = (status) => {
    if (currentTaskId !== null) {
      changeTaskStatus(currentTaskId, status);
      setModalVisible(false);
    }
  };

  const toggleSortType = () => {
    const newSortType = sortType === 'date' ? 'status' : 'date';
    setSortType(newSortType);

    Toast.show({
      text1: `Sorting by ${newSortType === 'date' ? 'date' : 'status'}`,
      position: 'bottom',
      type: 'info',
      color: 'white',
      visibilityTime: 2000,
      autoHide: true,
    });
  };

  const sortedTasks = tasks.sort((a, b) => {
    if (sortType === 'date') {
      return new Date(a.date) - new Date(b.date);
    }
    return a.status.localeCompare(b.status);
  });

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: '#222629' }}>
        
      <View style={{flexDirection: 'row', justifyContent: 'space-around', marginBottom: 25}}>
        <TouchableOpacity style={[styles.button, {width: '60%'}]} onPress={() => navigation.navigate('AddTask')}>
          <Text style={styles.buttonText}>Add task</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, {height: 50, width: 50}]} onPress={toggleSortType}>
          <Icon name='funnel-outline' size={25} color="white"/>
        </TouchableOpacity>
      </View>

      <FlatList
        data={sortedTasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity 
            onPress={() => selectionMode ? toggleTaskSelection(item.id) : navigation.navigate('TaskDetails', { task: item })}
            onLongPress={() => handleLongPress(item)}
          >
            <View style={[styles.task, selectedTasks.has(item.id) && styles.selectedTask]}>
              
              <Text style={[styles.taskText, {fontWeight: 'bold', alignSelf: 'center'}]}>{item.title}</Text>
              <Text style={styles.taskText}>Date: {new Date(item.date).toLocaleString()}{'\n'}
              Status: {item.status}</Text>

              <TouchableOpacity onPress={() => openStatusModal(item.id)} style={styles.statusButton}>
                <Text style={styles.statusButtonText}>Select status</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />
      {selectionMode && (
        <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteSelected}>
          <Text style={styles.deleteButtonText}>Delete selected</Text>
        </TouchableOpacity>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Выберите статус</Text>
            {statusOptions.map((status, index) => (
              <TouchableOpacity key={index} onPress={() => selectStatus(status)} style={styles.modalButton}>
                <Text style={styles.modalText}>{status}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Закрыть</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </View>
  );
};

const styles = StyleSheet.create({
  task: {
    padding: 15,
    backgroundColor: '#474b4f',
    borderRadius: 15,
    margin: 5
  },
  selectedTask: {
    backgroundColor: '#d3d3d3', // Цвет выделения
  },
  taskText: {
    color: 'white',
    fontSize: 15
  },
  button: {
    backgroundColor: '#86C232',
    height: 50,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    borderRadius: 15,
    marginTop: 20,
    width: '55%',
    backgroundColor: 'red',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 15,
  },
  statusButton: {
    marginTop: 10,
    backgroundColor: '#86C232',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  statusButtonText: {
    color: 'white',
    fontSize: 15,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalView: {
    backgroundColor: '#333',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  modalButton: {
    backgroundColor: '#474b4f',
    borderRadius: 15,
    padding: 5,
    marginBottom: 3,
    width: '40%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalText: {
    color: 'white',
    fontSize: 18,
    marginBottom: 15,
  },
  closeButton: {
    backgroundColor: '#d9534f',
    borderRadius: 10,
    padding: 10,
    width: '80%',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
  icon: {
    color: 'white',
    width: 24,
    height: 24,
  },
});

export default TaskListScreen;