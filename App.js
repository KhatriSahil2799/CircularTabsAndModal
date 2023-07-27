import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
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
        height: 500,
        backgroundColor: useGenerateRandomColor(),
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
  const [pivot, setPivot] = useState(0);

  const [cardA, setCardA] = useState(<Card text={"cardA"} key={"cardA"} />);

  // let CardA = <Card text={"cardA"} key={"cardA"} />;
  let CardB = <Card text={"cardB"} key={"cardB"} />;
  let CardC = <Card text={"cardC"} key={"cardC"} />;

  // useEffect(() => {
  //   setCardA(<Card text={"cardD"} key={"cardD"} />);
  //   console.log("🚀 ~ file: App.js:57 ~ useEffect ~ setCardA:");
  // }, [pivot]);

  const END_POSITION = width;

  const cardAPosition = useSharedValue(0);
  const cardAPanOffset = useSharedValue(-width);

  const cardBPosition = useSharedValue(0);
  const cardBPanOffset = useSharedValue(0);

  const cardCPosition = useSharedValue(0);
  const cardCPanOffset = useSharedValue(width);

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      cardAPosition.value = cardAPanOffset.value + e.translationX;
      cardBPosition.value = cardBPanOffset.value + e.translationX;
      cardCPosition.value = cardCPanOffset.value + e.translationX;
    })
    /**
     * to persist the previous scroll position
     */
    .onEnd((e) => {
      // cardAPanOffset.value = cardAPanOffset.value + e.translationX;
      // cardBPanOffset.value = cardBPanOffset.value + e.translationX;
      // cardCPanOffset.value = cardCPanOffset.value + e.translationX;

      if (Math.abs(e.translationX) >= width / 3) {
        if (e.translationX < 0) {
          if (cardBPanOffset.value <= -width) {
            cardBPanOffset.value = width;
          } else {
            cardBPosition.value = withTiming(
              cardBPanOffset.value - END_POSITION,
              { duration: 100 }
            );
            cardBPanOffset.value = cardBPanOffset.value - END_POSITION;
          }

          if (cardCPanOffset.value <= -width) {
            cardCPanOffset.value = width;
          } else {
            cardCPosition.value = withTiming(
              cardCPanOffset.value - END_POSITION,
              { duration: 100 }
            );
            cardCPanOffset.value = cardCPanOffset.value - END_POSITION;
          }

          if (cardAPanOffset.value <= -width) {
            cardAPanOffset.value = width;
          } else {
            cardAPosition.value = withTiming(
              cardAPanOffset.value - END_POSITION,
              { duration: 100 }
            );
            cardAPanOffset.value = cardAPanOffset.value - END_POSITION;
          }
        }
        if (e.translationX > 0) {
          if (cardBPanOffset.value >= width) {
            cardBPanOffset.value = -width;
          } else {
            cardBPosition.value = withTiming(
              cardBPanOffset.value + END_POSITION,
              { duration: 100 }
            );
            cardBPanOffset.value = cardBPanOffset.value + END_POSITION;
          }

          if (cardAPanOffset.value >= width) {
            cardAPanOffset.value = -width;
          } else {
            cardAPosition.value = withTiming(cardAPanOffset.value + width, {
              duration: 100,
            });
            cardAPanOffset.value = cardAPanOffset.value + width;
          }

          if (cardCPanOffset.value >= width) {
            cardCPanOffset.value = -width;
          } else {
            cardCPosition.value = withTiming(
              cardCPanOffset.value + END_POSITION,
              { duration: 100 }
            );
            cardCPanOffset.value = cardCPanOffset.value + END_POSITION;
          }
        }
      } else {
        cardBPosition.value = withTiming(cardBPanOffset.value, {
          duration: 100,
        });

        cardCPosition.value = withTiming(cardCPanOffset.value, {
          duration: 100,
        });

        cardAPosition.value = withTiming(cardAPanOffset.value, {
          duration: 100,
        });
      }

      // if (Number(cardAPanOffset.value / width) < 0) {
      //   runOnJS(pivotIncrement)();
      // }

      // runOnJS(setPivot)(1);
    });

  const cardAStyle = useAnimatedStyle(() => {
    // console.log(
    //   "🚀 ~ file: App.js:119 ~ cardAStyle ~ cardAPosition.value :",
    //   cardAPosition.value
    // );
    return {
      transform: [{ translateX: cardAPosition.value }],
    };
  });
  const cardBStyle = useAnimatedStyle(() => {
    // console.log(
    //   "🚀 ~ file: App.js:133 ~ cardBStyle ~ cardBPosition.value :",
    //   cardBPosition.value
    // );
    return {
      transform: [{ translateX: cardBPosition.value }],
    };
  });
  const cardCStyle = useAnimatedStyle(() => {
    // console.log(
    //   "🚀 ~ file: App.js:155 ~ cardCStyle ~ cardCPosition.value :",
    //   cardCPosition.value
    // );
    return {
      transform: [{ translateX: cardCPosition.value }],
    };
  });

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
      <GestureDetector gesture={panGesture}>
        <View
          style={{
            flex: 1,
            width: "100%",
            // flexDirection: "row",
            // paddingHorizontal: 20,
            backgroundColor: "yellow",
            // overflow: "scroll",
          }}
        >
          <Animated.View style={[styles.absoluteA, cardAStyle]}>
            {cardA}
          </Animated.View>

          <Animated.View style={[styles.absoluteC, cardCStyle]}>
            {CardC}
          </Animated.View>

          <Animated.View style={[styles.absoluteB, cardBStyle]}>
            {CardB}
          </Animated.View>
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
  absoluteB: {
    position: "absolute",
    // top: 0,
    // left: 0,
    // right: 100,
    bottom: 100,
    // zIndex: 10,
  },
  absoluteA: {
    position: "absolute",
    // top: 0,
    // left: 0,
    // right: width - 20,
    bottom: 100,
    // zIndex: 10,
  },
  absoluteC: {
    position: "absolute",
    // top: 0,
    // left: width - 20,
    // right: 100,
    bottom: 100,
    // zIndex: 10,
  },
});
