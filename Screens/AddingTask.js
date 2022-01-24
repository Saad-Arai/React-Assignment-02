import * as React from 'react';
import { View, Text, StyleSheet, Keyboard, } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';


function AddingTask() {
    const [task, addTaskset] = React.useState();
    const [desc, setDesc] = React.useState();

    const taskHandler = async () => {
        const data = { 'desc': `${desc}`, 'isComplete': false }
        Keyboard.dismiss();
        try {
            await AsyncStorage.setItem(task.toString(), JSON.stringify(data))
        } catch (e) {
            console.error(e);
        }

        addTaskset(null);
        setDesc(null);
    }

    return (
        <View style={styles.container}>
            <TextInput
                mode='outlined'
                label="Title"
                value={task}
                onChangeText={text => addTaskset(text)}
            />
            <TextInput
                mode='outlined'
                multiline={true}
                numberOfLines={8}
                label="Description (Optional)"
                value={desc}
                onChangeText={text => setDesc(text)}
            />
            <Button
                mode='contained'
                color='#55BCF6'
                marginTop={30}
                labelStyle={{ color: 'white' }}
                onPress={taskHandler} >
                Confirm
            </Button>

        </View>
    );
}
export default AddingTask;

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#E8EAED',
        padding: 25
    },
});