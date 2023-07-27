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
  onRemoveTab?: (index: number, success: boolean) => void;
}

export interface CircularTabsRefInterface {
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

/**
 *
 * @param currentIndex
 * @param dataSetSize
 * @returns newValidIndex as per the circular List
 */
const getNextValidArrayIndex = (
  currentIndex: number,
  dataSetSize: number
): number => {
  let newIndex = currentIndex + 1;
  if (newIndex >= dataSetSize) {
    newIndex = 0;
  }
  return newIndex;
};

/**
 *
 * @param currentIndex
 * @param dataSetSize
 * @returns newValidIndex as per the circular List
 */
const getPreviousValidArrayIndex = (
  currentIndex: number,
  dataSetSize: number
): number => {
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
        return;
        // throw new Error(`${index} index doesn't exist`);
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

  /**
   * @param item
   * adds new item to the end of the dataSet
   */
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

  /**
   * @param index
   * Removes an item from the dataSet as per the index value
   */
  const removeTab = useCallback(
    (index: number) => {
      if (data?.length <= 0) {
        onRemoveTab?.(index, false);
        return;
      }

      data.splice(index, 1);
      const newLastItemIndex = data?.length - 1;

      const nextItemIndex =
        index - 1 === newLastItemIndex ? newLastItemIndex : index;

      scrollToIndex(nextItemIndex);

      onRemoveTab?.(index, true);
    },
    [data, scrollToIndex, onRemoveTab]
  );

  /**
   * This is used to expose
   * scrollToIndex, addTab, removeTab
   * on the ref
   */
  useImperativeHandle(
    ref,
    () => {
      return { scrollToIndex, addTab, removeTab };
    },
    [scrollToIndex]
  );

  /**
   * It calculates new card index as per the swipe right or left
   */
  const getValidArrayIndex = useCallback(
    (
      swipeDirection: typeof SWIPE_LEFT | typeof SWIPE_RIGHT,
      currentIndex: number
    ): number => {
      const totalCards = data.length;
      let newIndex: number;

      if (swipeDirection === SWIPE_LEFT) {
        newIndex = getNextValidArrayIndex(currentIndex, totalCards);
      } else if (swipeDirection === SWIPE_RIGHT) {
        newIndex = getPreviousValidArrayIndex(currentIndex, totalCards);
      }

      return newIndex;
    },
    [data]
  );

  /**
   * On the basic of swipeDirection
   * cards positions {previous,current, next} are getting changed
   *  and new items are being assigned to them
   */
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

  /**
   * Translate cards in horizontal direction as we drag cards
   * with swipe left and right gesture
   */
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

  /**
   * As we stop dragging cards, this will figure out the final position of all three cards
   */
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

  /**
   * At the end of gesture cycle,
   * finally new cards position and data will assigned to them accordingly
   */
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
        }}
      >
        {/* Card A, initially positioned on the left of the ViewPort */}
        <Animated.View style={[styles.absolute, cardAStyle]}>
          {renderer(data[cardIndex.cardA], cardIndex.cardA)}
        </Animated.View>

        {/* Card C, initially positioned on the right of the ViewPort */}
        <Animated.View style={[styles.absolute, cardCStyle]}>
          {renderer(data[cardIndex.cardC], cardIndex.cardC)}
        </Animated.View>

        {/* Card B, initially positioned on the center of the ViewPort */}
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
