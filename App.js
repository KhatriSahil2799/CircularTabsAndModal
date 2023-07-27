import { StatusBar } from "expo-status-bar";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import {
  GestureDetector,
  Gesture,
  PanGestureHandler,
} from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const { width } = Dimensions.get("screen");

const useGenerateRandomColor = () => {
  return "#" + Math.random().toString(16).substr(-6);
};

const Card = ({ text }) => {
  return (
    <View
      style={{
        width: width,
        // flex: 1,
        height: 400,
        backgroundColor: useGenerateRandomColor(),
      }}
    >
      <Text>{text}</Text>
    </View>
  );
};

const CardB1 = ({ text }) => {
  return (
    <View
      style={{
        width: width,
        // flex: 1,
        height: 400,
        // position: "absolute",
        backgroundColor: useGenerateRandomColor(),
        top: 50,
        // left: 5,

        // zIndex: 10,
      }}
    >
      <Text>{text}</Text>
    </View>
  );
};

const data = [1, 2, 3];

let pivot = 0;

const pivotIncrement = () => {
  pivot = pivot + 1;
  console.log("🚀 ~ file: App.js:63 ~ pivotIncrement ~ pivot:", pivot);
};

export default function App() {
  const CardA = <Card text={"cardA"} key={"cardA"} />;
  const CardB = <Card text={"cardB"} key={"cardB"} />;
  const CardC = <Card text={"cardC"} key={"cardC"} />;

  const END_POSITION = width;

  const cardAPosition = useSharedValue(0);
  const cardAPanOffset = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      position.value = panOffset.value + e.translationX;
    })
    /**
     * to persist the previous scroll position
     */
    .onEnd((e) => {
      panOffset.value = panOffset.value + e.translationX;

      if (Number(panOffset.value / width) < 0) {
        runOnJS(pivotIncrement)();
      }

      if (position.value < END_POSITION / 2) {
        position.value = withTiming(-END_POSITION * 1, { duration: 100 });
        panOffset.value = -END_POSITION;
      }
    });

  const cardAStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: position.value }],
  }));
  const cardBStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: position.value }],
  }));
  const cardCStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: position.value }],
  }));

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
      <GestureDetector gesture={panGesture}>
        <View
          style={{
            flexDirection: "row",
            // paddingHorizontal: 20,
            // backgroundColor: "red",
            overflow: "scroll",
          }}
        >
          <Animated.View style={cardAStyle}>{CardA}</Animated.View>
          <Animated.View style={cardBStyle}>{CardB}</Animated.View>
          <Animated.View style={cardCStyle}>{CardC}</Animated.View>
        </View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
