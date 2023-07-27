import React, { useMemo, useState, useRef } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
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

interface CircularTabsInterface {
  data: Array<any>;
}

const CircularTabs = ({ children }) => {
  const cardPosition = useRef({
    previous: "CardA",
    current: "CardB",
    next: "CardC",
  });

  const [cardIndex, setCardIndex] = useState({
    cardA: data.length - 1,
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

  const onSwipeHandler = (
    swipeDirection: typeof SWIPE_LEFT | typeof SWIPE_RIGHT
  ) => {
    if (swipeDirection === SWIPE_LEFT) {
      if (cardPosition.current.previous === "CardA") {
        setCardIndex((prev) => {
          return {
            ...prev,
            cardA: getValidArrayIndex(swipeDirection, prev.cardC + 1),
          };
        });
      } else if (cardPosition.current.previous === "CardB") {
        setCardIndex((prev) => {
          return {
            ...prev,
            cardB: getValidArrayIndex(swipeDirection, prev.cardA + 1),
          };
        });
      } else if (cardPosition.current.previous === "CardC") {
        setCardIndex((prev) => {
          return {
            ...prev,
            cardC: getValidArrayIndex(swipeDirection, prev.cardB + 1),
          };
        });
      }

      cardPosition.current = {
        previous: cardPosition.current.current,
        current: cardPosition.current.next,
        next: cardPosition.current.previous,
      };
    }
    if (swipeDirection === SWIPE_RIGHT) {
      if (cardPosition.current.next === "CardA") {
        setCardIndex((prev) => {
          return {
            ...prev,
            cardA: getValidArrayIndex(swipeDirection, prev.cardB - 1),
          };
        });
      } else if (cardPosition.current.next === "CardB") {
        setCardIndex((prev) => {
          return {
            ...prev,
            cardB: getValidArrayIndex(swipeDirection, prev.cardC - 1),
          };
        });
      } else if (cardPosition.current.next === "CardC") {
        setCardIndex((prev) => {
          return {
            ...prev,
            cardC: getValidArrayIndex(swipeDirection, prev.cardA - 1),
          };
        });
      }

      cardPosition.current = {
        previous: cardPosition.current.next,
        current: cardPosition.current.previous,
        next: cardPosition.current.current,
      };
    }
  };

  const changeCards = (value) => {
    "worklet";
    runOnJS(onSwipeHandler)(value);
  };

  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .onUpdate((e) => {
          cardAPosition.value = cardAPanOffset.value + e.translationX;
          cardBPosition.value = cardBPanOffset.value + e.translationX;
          cardCPosition.value = cardCPanOffset.value + e.translationX;
        })
        /**
         * to persist the previous scroll position
         */
        .onEnd((e) => {
          if (Math.abs(e.translationX) >= width / 4) {
            if (e.translationX < 0) {
              if (cardBPanOffset.value <= -width) {
                cardBPanOffset.value = width;
              } else {
                cardBPosition.value = withTiming(cardBPanOffset.value - width, {
                  duration: 100,
                });
                cardBPanOffset.value = cardBPanOffset.value - width;
              }

              if (cardCPanOffset.value <= -width) {
                cardCPanOffset.value = width;
              } else {
                cardCPosition.value = withTiming(cardCPanOffset.value - width, {
                  duration: 100,
                });
                cardCPanOffset.value = cardCPanOffset.value - width;
              }

              if (cardAPanOffset.value <= -width) {
                cardAPanOffset.value = width;
              } else {
                cardAPosition.value = withTiming(cardAPanOffset.value - width, {
                  duration: 100,
                });
                cardAPanOffset.value = cardAPanOffset.value - width;
              }
            }
            if (e.translationX > 0) {
              if (cardBPanOffset.value >= width) {
                cardBPanOffset.value = -width;
              } else {
                cardBPosition.value = withTiming(cardBPanOffset.value + width, {
                  duration: 100,
                });
                cardBPanOffset.value = cardBPanOffset.value + width;
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
                cardCPosition.value = withTiming(cardCPanOffset.value + width, {
                  duration: 100,
                });
                cardCPanOffset.value = cardCPanOffset.value + width;
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
              changeCards("SWIPE_LEFT");
            }
            if (e.translationX > 0) {
              changeCards("SWIPE_RIGHT");
            }
          }
        }),
    []
  );

  const cardAStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: cardAPosition.value }],
  }));
  const cardBStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: cardBPosition.value }],
  }));
  const cardCStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: cardCPosition.value }],
  }));

  console.log(
    "🚀 ~ file: CircularTabs.tsx:274 ~ CircularTabs ~ panGesture:",
    panGesture
  );
  return (
    <GestureDetector gesture={panGesture}>
      <View
        style={{
          flex: 1,
          width: "100%",
          backgroundColor: "yellow",
        }}
      >
        <Animated.View style={[styles.absolute, cardAStyle]}>
          {CardA}
        </Animated.View>

        <Animated.View style={[styles.absolute, cardCStyle]}>
          {CardC}
        </Animated.View>

        <Animated.View style={[styles.absolute, cardBStyle]}>
          {CardB}
        </Animated.View>
      </View>
    </GestureDetector>
  );
};

export default CircularTabs;

const styles = StyleSheet.create({
  absolute: {
    position: "absolute",
    bottom: 100,
  },
});
