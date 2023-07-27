import { StatusBar } from "expo-status-bar";
import { useMemo, useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import {
  GestureDetector,
  Gesture,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const { width } = Dimensions.get("screen");

const SWIPE_LEFT = "SWIPE_LEFT";
const SWIPE_RIGHT = "SWIPE_RIGHT";

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

const data = [
  "card A",
  "card B",
  "card C",
  "card D",
  "card E",
  "card F",
  "card G",
  "card H",
  "card I",
  "card J",
];

export default function App() {
  const [cardPosition, setCardPosition] = useState({
    previous: "CardA",
    current: "CardB",
    next: "CardC",
  });

  const [cardIndex, setCardIndex] = useState({
    cardA: -1,
    cardB: 0,
    cardC: 1,
  });

  const CardA = useMemo(() => {
    return <Card text={data[cardIndex.cardA] + " cardA"} key={"cardA"} />;
  }, [cardIndex.cardA]);

  const CardB = useMemo(() => {
    return <Card text={data[cardIndex.cardB] + " cardB"} key={"cardB"} />;
  }, [cardIndex.cardB]);

  const CardC = useMemo(() => {
    return <Card text={data[cardIndex.cardC] + " cardC"} key={"cardC"} />;
  }, [cardIndex.cardC]);

  const END_POSITION = width;

  const cardPivot = useSharedValue(null);

  const cardAPosition = useSharedValue(0);
  const cardAPanOffset = useSharedValue(-width);

  const cardBPosition = useSharedValue(0);
  const cardBPanOffset = useSharedValue(0);

  const cardCPosition = useSharedValue(0);
  const cardCPanOffset = useSharedValue(width);

  function isIndexInArray(index, arr) {
    // Check if the index is a non-negative integer and less than the array length.
    return Number.isInteger(index) && index >= 0 && index < arr.length;
  }

  const getValidArrayIndex = (swipeDirection, index) => {
    if (swipeDirection === SWIPE_LEFT) {
      return isIndexInArray(index, data) ? index : 0;
    }
    if (swipeDirection === SWIPE_RIGHT) {
      return isIndexInArray(index, data) ? index : data.length - 1;
    }
  };

  const onSwipeHandler = (swipeDirection) => {
    if (swipeDirection === SWIPE_LEFT) {
      if (cardPosition.previous === "CardA") {
        setCardIndex((prev) => {
          return {
            ...prev,
            cardA: getValidArrayIndex(swipeDirection, prev.cardC + 1),
          };
        });
      } else if (cardPosition.previous === "CardB") {
        setCardIndex((prev) => {
          return {
            ...prev,
            cardB: getValidArrayIndex(swipeDirection, prev.cardA + 1),
          };
        });
      } else if (cardPosition.previous === "CardC") {
        setCardIndex((prev) => {
          return {
            ...prev,
            cardC: getValidArrayIndex(swipeDirection, prev.cardB + 1),
          };
        });
      }

      setCardPosition((prev) => {
        return {
          previous: prev.current,
          current: prev.next,
          next: prev.previous,
        };
      });
    }
    if (swipeDirection === SWIPE_RIGHT) {
      if (cardPosition.next === "CardA") {
        setCardIndex((prev) => {
          return {
            ...prev,
            cardA: getValidArrayIndex(swipeDirection, prev.cardB - 1),
          };
        });
      } else if (cardPosition.next === "CardB") {
        setCardIndex((prev) => {
          return {
            ...prev,
            cardB: getValidArrayIndex(swipeDirection, prev.cardC - 1),
          };
        });
      } else if (cardPosition.next === "CardC") {
        setCardIndex((prev) => {
          return {
            ...prev,
            cardC: getValidArrayIndex(swipeDirection, prev.cardA - 1),
          };
        });
      }

      setCardPosition((prev) => {
        return {
          previous: prev.next,
          current: prev.previous,
          next: prev.current,
        };
      });
    }
  };

  const changeCards = (value) => {
    "worklet";
    runOnJS(onSwipeHandler)(value);
  };

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
          // cardPivot.value = cardPivot.value + 1;

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
          // cardPivot.value = cardPivot.value - 1;
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
    })
    .onFinalize((e) => {
      if (Math.abs(e.translationX) >= width / 3) {
        if (e.translationX < 0) {
          // cardPivot.value = "swipeLeft";
          changeCards("SWIPE_LEFT");
        }
        if (e.translationX > 0) {
          // cardPivot.value = cardPivot.value - 1;
          changeCards("SWIPE_RIGHT");
        }
      }
    });

  const cardAStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: cardAPosition.value }],
    };
  });
  const cardBStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: cardBPosition.value }],
    };
  });
  const cardCStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: cardCPosition.value }],
    };
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text>Open up App.js to start working on your app!</Text>
        <StatusBar style="auto" />
        <GestureDetector gesture={panGesture}>
          <View
            style={{
              flex: 1,
              width: "100%",
              backgroundColor: "yellow",
            }}
          >
            <Animated.View style={[styles.absoluteA, cardAStyle]}>
              {CardA}
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
