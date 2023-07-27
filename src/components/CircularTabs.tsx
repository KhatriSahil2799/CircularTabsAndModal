import React, { useMemo, useState, useRef, useCallback } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureStateChangeEvent,
  GestureUpdateEvent,
  PanGestureHandlerEventPayload,
} from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import useCardsPositionAndOffset from "./useCardsPositionAndOffset";

const { width } = Dimensions.get("screen");

const SWIPE_LEFT = "SWIPE_LEFT";
const SWIPE_RIGHT = "SWIPE_RIGHT";

const useGenerateRandomColor = () =>
  `#${Math.random().toString(16).substr(-6)}`;

const Card = ({ text }) => (
  <View
    style={{
      width,
      height: 500,
      backgroundColor: useGenerateRandomColor(),
    }}
  >
    <Text>{text}</Text>
  </View>
);

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
  animation: boolean;
}

function isIndexInArray(index: number, arr: Array<any>) {
  // Check if the index is a non-negative integer and less than the array length.
  return Number.isInteger(index) && index >= 0 && index < arr.length;
}

const CircularTabs = ({
  children,
  animation = true,
}: CircularTabsInterface) => {
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
  console.log("🚀 ~ file: CircularTabs.tsx:75 ~ cardIndex:", cardIndex);

  const CardA = useMemo(
    () => <Card text={`${data[cardIndex.cardA]} cardA`} key="cardA" />,
    [cardIndex.cardA]
  );

  const CardB = useMemo(
    () => <Card text={`${data[cardIndex.cardB]} cardB`} key="cardB" />,
    [cardIndex.cardB]
  );

  const CardC = useMemo(
    () => <Card text={`${data[cardIndex.cardC]} cardC`} key="cardC" />,
    [cardIndex.cardC]
  );

  const {
    cardAPosition,
    cardAPanOffset,
    cardBPosition,
    cardBPanOffset,
    cardCPosition,
    cardCPanOffset,
  } = useCardsPositionAndOffset({ componentWidth: width });

  const getValidArrayIndex = useCallback(
    (swipeDirection: typeof SWIPE_LEFT | typeof SWIPE_RIGHT, index: number) => {
      if (swipeDirection === SWIPE_LEFT) {
        return isIndexInArray(index, data) ? index : 0;
      }
      if (swipeDirection === SWIPE_RIGHT) {
        return isIndexInArray(index, data) ? index : data.length - 1;
      }
      return 0;
    },
    [data, isIndexInArray]
  );

  const onSwipeHandler = useCallback(
    (swipeDirection: typeof SWIPE_LEFT | typeof SWIPE_RIGHT) => {
      if (swipeDirection === SWIPE_LEFT) {
        if (cardPosition.current.previous === "CardA") {
          setCardIndex((prev) => ({
            ...prev,
            cardA: getValidArrayIndex(swipeDirection, prev.cardC + 1),
          }));
        } else if (cardPosition.current.previous === "CardB") {
          setCardIndex((prev) => ({
            ...prev,
            cardB: getValidArrayIndex(swipeDirection, prev.cardA + 1),
          }));
        } else if (cardPosition.current.previous === "CardC") {
          setCardIndex((prev) => ({
            ...prev,
            cardC: getValidArrayIndex(swipeDirection, prev.cardB + 1),
          }));
        }

        cardPosition.current = {
          previous: cardPosition.current.current,
          current: cardPosition.current.next,
          next: cardPosition.current.previous,
        };
      }
      if (swipeDirection === SWIPE_RIGHT) {
        if (cardPosition.current.next === "CardA") {
          setCardIndex((prev) => ({
            ...prev,
            cardA: getValidArrayIndex(swipeDirection, prev.cardB - 1),
          }));
        } else if (cardPosition.current.next === "CardB") {
          setCardIndex((prev) => ({
            ...prev,
            cardB: getValidArrayIndex(swipeDirection, prev.cardC - 1),
          }));
        } else if (cardPosition.current.next === "CardC") {
          setCardIndex((prev) => ({
            ...prev,
            cardC: getValidArrayIndex(swipeDirection, prev.cardA - 1),
          }));
        }

        cardPosition.current = {
          previous: cardPosition.current.next,
          current: cardPosition.current.previous,
          next: cardPosition.current.current,
        };
      }
    },
    [cardPosition, setCardIndex, getValidArrayIndex]
  );

  const changeCards = useCallback(
    (value: typeof SWIPE_LEFT | typeof SWIPE_RIGHT) => {
      "worklet";

      runOnJS(onSwipeHandler)(value);
    },
    [onSwipeHandler]
  );

  const onUpdateGesture = useCallback(
    (e: GestureUpdateEvent<PanGestureHandlerEventPayload>) => {
      "worklet";

      cardAPosition.value = cardAPanOffset.value + e.translationX;
      cardBPosition.value = cardBPanOffset.value + e.translationX;
      cardCPosition.value = cardCPanOffset.value + e.translationX;
    },
    [
      cardAPanOffset.value,
      cardAPosition,
      cardBPanOffset.value,
      cardBPosition,
      cardCPanOffset.value,
      cardCPosition,
    ]
  );

  const onEndGesture = useCallback(
    (e: GestureStateChangeEvent<PanGestureHandlerEventPayload>) => {
      "worklet";

      if (Math.abs(e.translationX) >= width / 4) {
        if (e.translationX < 0) {
          if (cardBPanOffset.value <= -width) {
            cardBPanOffset.value = width;
          } else {
            cardBPosition.value = withTiming(cardBPanOffset.value - width, {
              duration: 100,
            });
            cardBPanOffset.value -= width;
          }

          if (cardCPanOffset.value <= -width) {
            cardCPanOffset.value = width;
          } else {
            cardCPosition.value = withTiming(cardCPanOffset.value - width, {
              duration: 100,
            });
            cardCPanOffset.value -= width;
          }

          if (cardAPanOffset.value <= -width) {
            cardAPanOffset.value = width;
          } else {
            cardAPosition.value = withTiming(cardAPanOffset.value - width, {
              duration: 100,
            });
            cardAPanOffset.value -= width;
          }
        }
        if (e.translationX > 0) {
          if (cardBPanOffset.value >= width) {
            cardBPanOffset.value = -width;
          } else {
            cardBPosition.value = withTiming(cardBPanOffset.value + width, {
              duration: 100,
            });
            cardBPanOffset.value += width;
          }

          if (cardAPanOffset.value >= width) {
            cardAPanOffset.value = -width;
          } else {
            cardAPosition.value = withTiming(cardAPanOffset.value + width, {
              duration: 100,
            });
            cardAPanOffset.value += width;
          }

          if (cardCPanOffset.value >= width) {
            cardCPanOffset.value = -width;
          } else {
            cardCPosition.value = withTiming(cardCPanOffset.value + width, {
              duration: 100,
            });
            cardCPanOffset.value += width;
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
    },
    [
      cardAPanOffset,
      cardAPosition,
      cardBPanOffset,
      cardBPosition,
      cardCPanOffset,
      cardCPosition,
    ]
  );

  const onFinalizeGesture = useCallback(
    (e: GestureStateChangeEvent<PanGestureHandlerEventPayload>) => {
      "worklet";

      if (Math.abs(e.translationX) >= width / 3) {
        if (e.translationX < 0) {
          changeCards("SWIPE_LEFT");
        }
        if (e.translationX > 0) {
          changeCards("SWIPE_RIGHT");
        }
      }
    },
    [changeCards]
  );

  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .onUpdate(onUpdateGesture)
        .onEnd(onEndGesture)
        .onFinalize(onFinalizeGesture),
    [onEndGesture, onFinalizeGesture, onUpdateGesture]
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
