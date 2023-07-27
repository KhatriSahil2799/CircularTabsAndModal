import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import CircularTabs from "./src/components/CircularTabs";
import SwipeableModal from "./src/components/SwipeableModal";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* <Text>Open up App.js to start working on your app!</Text> */}
        <StatusBar style="auto" />
        {/* <CircularTabs />  */}
        <SwipeableModal type="LEFT" snapPoint={200} />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
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
