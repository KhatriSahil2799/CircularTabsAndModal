import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Navigator from "./src/Navigator/Navigator";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="auto" hidden={Platform.OS === "ios"} />
      <Navigator />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  absoluteB: {
    position: "absolute",
    bottom: 100,
  },
  absoluteA: {
    position: "absolute",
    bottom: 100,
  },
  absoluteC: {
    position: "absolute",
    bottom: 100,
  },
});
