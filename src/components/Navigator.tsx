import { View, Text, Button } from "react-native";
import React from "react";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ModalDemo from "./ModalDemo";
import CircularTabsDemo from "./CircularTabsDemo";

function HomeScreen() {
  const navigation = useNavigation();
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "red",
      }}
    >
      <Button
        title="Modal"
        onPress={() => {
          navigation.navigate("Modal");
        }}
      />

      <Button
        title="Circular Tabs"
        onPress={() => {
          navigation.navigate("Circular Tabs");
        }}
      />

      <Text>Home Screen</Text>
    </View>
  );
}

const Stack = createNativeStackNavigator();

const Navigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Circular Tabs" component={CircularTabsDemo} />
        <Stack.Screen
          name="Modal"
          component={ModalDemo}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigator;
