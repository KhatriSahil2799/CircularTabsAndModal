import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ModalDemo from "./ModalDemo";
import CircularTabsDemo from "./CircularTabsDemo";
import Button from "./Button";

function HomeScreen() {
  const navigation = useNavigation();
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Button
        title="Modal"
        style={styles.button}
        onPress={() => {
          navigation.navigate("Modal");
        }}
      />

      <Button
        style={styles.button}
        title="Circular Tabs"
        onPress={() => {
          navigation.navigate("Circular Tabs");
        }}
      />
    </View>
  );
}

const Stack = createNativeStackNavigator();

const Navigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ animation: "fade_from_bottom" }}>
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

const styles = StyleSheet.create({
  button: { padding: 5, width: "60%" },
});
