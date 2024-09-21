import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TaskListScreen from './screens/TaskListScreen';
import AddTaskScreen from './screens/AddTaskScreen';
import TaskDetailsScreen from './screens/TaskDetailsScreen';
import Toast from 'react-native-toast-message';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer theme={DarkTheme}>
      <Stack.Navigator screenOptions={{headerStyle: { backgroundColor: '#222629' }, headerTintColor: '#fff',}}>
        <Stack.Screen name="TaskList" component={TaskListScreen} options={{ title: 'Task list'}} />
        <Stack.Screen name="AddTask" component={AddTaskScreen} options={{ title: 'Add task' }} />
        <Stack.Screen name="TaskDetails" component={TaskDetailsScreen} options={{ title: 'Task details' }} />
      </Stack.Navigator>

      <StatusBar style='light'/>
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </NavigationContainer>
  );
}