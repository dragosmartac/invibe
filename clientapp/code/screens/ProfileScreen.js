import * as React from 'react';
import { Button, View } from "react-native";

export function ProfileScreen({navigation}) {
    return (
        <View>
        <Button
            title="Go back"
            onPress={() => navigation.navigate('Home')}
        />
        </View>
    );
}