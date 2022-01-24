import * as React from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { NavigationContainer, useIsFocused } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IconButton, Colors, TextInput } from 'react-native-paper';

import AddingTask from './Screens/AddingTask';
import TaskView from './Screens/TaskScreen';

function HomeScreen({ navigation }) {
  const isFocused = useIsFocused();
  const [taskItems, setTasks] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState('');

  React.useEffect(() => {
    if (isFocused)
      taskUpdate();
  }, [isFocused]);

  const taskUpdate = async () => {
    const keys = await AsyncStorage.getAllKeys();
    await AsyncStorage.multiGet(keys).then((data) => {
      setTasks(data);

    }).catch((error) => {
      console.log(error);
    });
  }



  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.appBarView}>

          <IconButton
            icon="plus"
            color={Colors.black}
            size={25}
            onPress={() => navigation.navigate('AddTask')} />
        </View>
      ),

    });
  });

  const Task = (props) => {
    const deleteTask = async (title) => {
      try {
        await AsyncStorage.removeItem(title);
        taskUpdate();
      }
      catch (exception) {
        console.error(exception)
      }
    }

    return (
      <View style={props.isComplete ? styles.completeitem : styles.item}>

        <View style={styles.itemLeft}>
          <View >
            <Text style={props.isComplete ? styles.comItemTitle : styles.itemTitle}>{props.title}</Text>
            <View><Text style={props.isComplete ? styles.compItems : styles.itemDesc}>{props.desc}</Text></View>
          </View>
        </View>

        <IconButton
          icon="delete-forever"
          size={20}
          color='purple'
          onPress={() => { deleteTask(props.title) }}
        />

      </View>
    );
  }

  const searchTask = (searchQuery) => {
    const searchingList = []
    const addedItem = []
    taskItems.map((item, index) => {
      if (item[0].includes(searchQuery) && !addedItem.includes(item[0])) {
        console.log(addedItem)
        console.log(item[0])
        addedItem.push(item[0])
        searchingList.push(<TouchableOpacity key={index} onPress={() => JSON.parse(item[1])['isComplete'] ? null : navigation.navigate('Task', { title: item[0], desc: JSON.parse(item[1])['desc'], isComplete: JSON.parse(item[1])['isComplete'] })}>
          <Task title={item[0]} desc={JSON.parse(item[1])['desc']} isComplete={JSON.parse(item[1])['isComplete']} />
        </TouchableOpacity>)
      }
    })
    return searchingList;
  }

  return (
    <View style={styles.container}>
      <View style={{ paddingTop: 10, paddingLeft: 20, paddingRight: 20, }}>
        <TextInput
          mode='outlined'
          label="Search Task"
          value={searchQuery}
          onChangeText={text => setSearchQuery(text)}
        />
      </View>
      <ScrollView style={styles.task} contentContainerStyle={{ padding: 20 }}>
        {

          taskItems.map((item, index) => {
            return searchQuery.length < 1 ? <TouchableOpacity key={index} onPress={() => JSON.parse(item[1])['isComplete'] ? null : navigation.navigate('Task Completed', { title: item[0], desc: JSON.parse(item[1])['desc'], isComplete: JSON.parse(item[1])['isComplete'] })}>
              <Task title={item[0]} desc={JSON.parse(item[1])['desc']} isComplete={JSON.parse(item[1])['isComplete']} />
            </TouchableOpacity> : searchTask(searchQuery)
          })
        }
      </ScrollView>

    </View>
  );
}


const Stack = createNativeStackNavigator();

function App({ navigation }) {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home"
        screenOptions={{ headerStyle: styles.appbarStyle }}>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'All Tasks (TO - DO)',
          }}
        />
        <Stack.Screen name="AddTask" component={AddingTask} />
        <Stack.Screen name="Task Completed" component={TaskView} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

const styles = StyleSheet.create({


  appbarStyle: {
    backgroundColor: '#03b6fc'
  },
  appBarView: {
    flexDirection: 'row'
  },
  container: {
    flex: 1,
    
  },

  input: {
    height: 5,
    backgroundColor: '#e6ebed',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 15,
  },
  //Task UI Style Start
  item: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  completeitem: {
    backgroundColor: '#E8EAED',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    paddingLeft: 10,
  },

  sq: {
    width: 24,
    height: 24,
    backgroundColor: '#e6ebed',
    opacity: 0.4,
    borderRadius: 5,
    marginRight: 15,
  },
  itemDesc: {
    fontSize: 12,
  },
  compItems: {
    fontSize: 12,
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid'
  },
  itemTitle: {
    fontWeight: 'bold',
    fontSize: 20,

  },
  comItemTitle: {
    fontWeight: 'bold',
    fontSize: 17,
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid'

  },
  cr: {
    width: 12,
    height: 12,
    borderColor: '#55BCF6',
    borderWidth: 2,
    borderRadius: 5,
  },
  //Task UI Style End

});