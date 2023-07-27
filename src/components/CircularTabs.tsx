import React, {
  useState,
  useRef,
  ReactNode,
  useCallback,
  useMemo,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Dimensions, StyleSheet, View } from "react-native";
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
  withSpring,
} from "react-native-reanimated";
import useCardsPositionAndOffset from "./useCardsPositionAndOffset";

const { width } = Dimensions.get("screen");

const SWIPE_LEFT = "SWIPE_LEFT";
const SWIPE_RIGHT = "SWIPE_RIGHT";

interface CircularTabsInterface<T> {
  data: Array<T>;
  animation: boolean;
  renderer: (item: T, index: number) => ReactNode;
  onAddTab?: (index: number) => void;
  onRemoveTab?: (success: boolean) => void;
}

interface CircularTabsRefInterface {
  scrollToIndex: (index: number) => void;
  addTab: (item: any) => void;
  removeTab: (index: number) => void;
}

const SPRING_CONFIG = {
  damping: 80,
  overshootClamping: true,
  restDisplacementThreshold: 0.1,
  restSpeedThreshold: 0.1,
  stiffness: 500,
};

const getNextValidArrayIndex = (currentIndex: number, dataSetSize: number) => {
  let newIndex = currentIndex + 1;
  if (newIndex >= dataSetSize) {
    newIndex = 0;
  }
  return newIndex;
};

const getPreviousValidArrayIndex = (
  currentIndex: number,
  dataSetSize: number
) => {
  let newIndex = currentIndex - 1;
  if (newIndex < 0) {
    newIndex = dataSetSize - 1;
  }
  return newIndex;
};

const CircularTabs = <T,>(
  {
    data,
    animation = true,
    renderer,
    onAddTab,
    onRemoveTab,
  }: CircularTabsInterface<T>,
  ref: React.Ref<CircularTabsRefInterface>
) => {
  const cardPosition = useRef({
    previous: "cardA",
    current: "cardB",
    next: "cardC",
  });

  const [cardIndex, setCardIndex] = useState({
    cardA: getPreviousValidArrayIndex(0, data?.length),
    cardB: 0,
    cardC: getNextValidArrayIndex(0, data?.length),
  });

  const {
    cardAPosition,
    cardAPanOffset,
    cardBPosition,
    cardBPanOffset,
    cardCPosition,
    cardCPanOffset,
  } = useCardsPositionAndOffset({ componentWidth: width });

  const scrollToIndex = useCallback(
    (index: number) => {
      if (!(index >= 0 && index < data?.length)) {
        throw new Error(`${index} index doesn't exist`);
      }

      setCardIndex((prev) => {
        // just for typescript
        const newCardsIndex = { ...prev };

        newCardsIndex[cardPosition.current.current] = index;
        newCardsIndex[cardPosition.current.previous] =
          getPreviousValidArrayIndex(index, data?.length);
        newCardsIndex[cardPosition.current.next] = getNextValidArrayIndex(
          index,
          data?.length
        );

        return newCardsIndex;
      });
    },
    [
      data,
      cardPosition,
      setCardIndex,
      getPreviousValidArrayIndex,
      getNextValidArrayIndex,
    ]
  );

  const addTab = useCallback(
    (item: T) => {
      const newLastItemIndex = data?.push(item);

      // Scrolls to the last item
      scrollToIndex(newLastItemIndex - 1);

      // calls the callback with the item index
      onAddTab?.(newLastItemIndex - 1);
    },
    [data, scrollToIndex, onAddTab]
  );

  const removeTab = useCallback(
    (index: number) => {
      if (data?.length <= 0) {
        onRemoveTab?.(false);
        return;
      }

      data.splice(index, 1);
      const newLastItemIndex = data?.length - 1;

      const nextItemIndex =
        index - 1 === newLastItemIndex ? newLastItemIndex : index;

      scrollToIndex(nextItemIndex);

      onRemoveTab?.(true);
    },
    [data, scrollToIndex, onRemoveTab]
  );

  useImperativeHandle(
    ref,
    () => {
      return { scrollToIndex, addTab, removeTab };
    },
    [scrollToIndex]
  );

  const getValidArrayIndex = useCallback(
    (
      swipeDirection: typeof SWIPE_LEFT | typeof SWIPE_RIGHT,
      currentIndex: number
    ): number => {
      const totalCards = data.length;
      let newIndex: number;

      if (swipeDirection === SWIPE_LEFT) {
        newIndex = getNextValidArrayIndex(currentIndex, totalCards);
        // newIndex = currentIndex + 1;
        // if (newIndex >= totalCards) {
        //   newIndex = 0;
        // }
      } else if (swipeDirection === SWIPE_RIGHT) {
        newIndex = getPreviousValidArrayIndex(currentIndex, totalCards);
        // newIndex = currentIndex - 1;
        // if (newIndex < 0) {
        //   newIndex = totalCards - 1;
        // }
      }

      return newIndex;
    },
    [data]
  );

  const onSwipeHandler = useCallback(
    (swipeDirection: typeof SWIPE_LEFT | typeof SWIPE_RIGHT) => {
      if (swipeDirection === SWIPE_LEFT) {
        cardPosition.current = {
          previous: cardPosition.current.current,
          current: cardPosition.current.next,
          next: cardPosition.current.previous,
        };
        setCardIndex((prev) => {
          const newCardIndex = { ...prev };
          newCardIndex[cardPosition.current.next] = getValidArrayIndex(
            swipeDirection,
            prev[cardPosition.current.current]
          );

          return newCardIndex;
        });
      }

      if (swipeDirection === SWIPE_RIGHT) {
        cardPosition.current = {
          previous: cardPosition.current.next,
          current: cardPosition.current.previous,
          next: cardPosition.current.current,
        };

        setCardIndex((prev) => {
          const newCardIndex = { ...prev };
          newCardIndex[cardPosition.current.previous] = getValidArrayIndex(
            swipeDirection,
            prev[cardPosition.current.current]
          );

          return newCardIndex;
        });
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
      cardAPanOffset,
      cardAPosition,
      cardBPanOffset,
      cardBPosition,
      cardCPanOffset,
      cardCPosition,
    ]
  );

  const onEndGesture = useCallback(
    (e: GestureStateChangeEvent<PanGestureHandlerEventPayload>) => {
      "worklet";

      if (Math.abs(e.translationX) >= width / 16) {
        if (e.translationX < 0) {
          if (cardBPanOffset.value <= -width) {
            cardBPanOffset.value = width;
          } else {
            cardBPosition.value = withSpring(
              cardBPanOffset.value - width,
              SPRING_CONFIG
            );
            cardBPanOffset.value -= width;
          }

          if (cardCPanOffset.value <= -width) {
            cardCPanOffset.value = width;
          } else {
            cardCPosition.value = withSpring(
              cardCPanOffset.value - width,
              SPRING_CONFIG
            );
            cardCPanOffset.value -= width;
          }

          if (cardAPanOffset.value <= -width) {
            cardAPanOffset.value = width;
          } else {
            cardAPosition.value = withSpring(
              cardAPanOffset.value - width,
              SPRING_CONFIG
            );
            cardAPanOffset.value -= width;
          }
        }
        if (e.translationX > 0) {
          if (cardBPanOffset.value >= width) {
            cardBPanOffset.value = -width;
          } else {
            cardBPosition.value = withSpring(
              cardBPanOffset.value + width,
              SPRING_CONFIG
            );
            cardBPanOffset.value += width;
          }

          if (cardAPanOffset.value >= width) {
            cardAPanOffset.value = -width;
          } else {
            cardAPosition.value = withSpring(
              cardAPanOffset.value + width,
              SPRING_CONFIG
            );
            cardAPanOffset.value += width;
          }

          if (cardCPanOffset.value >= width) {
            cardCPanOffset.value = -width;
          } else {
            cardCPosition.value = withSpring(
              cardCPanOffset.value + width,
              SPRING_CONFIG
            );
            cardCPanOffset.value += width;
          }
        }
      } else {
        cardBPosition.value = withSpring(cardBPanOffset.value, SPRING_CONFIG);

        cardCPosition.value = withSpring(cardCPanOffset.value, SPRING_CONFIG);

        cardAPosition.value = withSpring(cardAPanOffset.value, SPRING_CONFIG);
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

      if (Math.abs(e.translationX) >= width / 16) {
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

  if (data?.length <= 0) {
    return <></>;
  }

  return (
    <GestureDetector gesture={panGesture}>
      <View
        style={{
          flex: 1,
          width: "100%",
          // backgroundColor: "whi",
        }}
      >
        <Animated.View style={[styles.absolute, cardAStyle]}>
          {renderer(data[cardIndex.cardA], cardIndex.cardA)}
        </Animated.View>

        <Animated.View style={[styles.absolute, cardCStyle]}>
          {renderer(data[cardIndex.cardC], cardIndex.cardC)}
        </Animated.View>

        <Animated.View style={[styles.absolute, cardBStyle]}>
          {renderer(data[cardIndex.cardB], cardIndex.cardB)}
        </Animated.View>
      </View>
    </GestureDetector>
  );
};

export default forwardRef<CircularTabsRefInterface, CircularTabsInterface<any>>(
  CircularTabs
);

const styles = StyleSheet.create({
  absolute: {
    position: "absolute",
  },
});
