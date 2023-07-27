import { Button, Dimensions, StyleSheet, Text, View } from "react-native";
import React, { useCallback, useEffect, useMemo } from "react";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import {
  Gesture,
  GestureDetector,
  GestureStateChangeEvent,
  GestureUpdateEvent,
  PanGestureHandlerEventPayload,
} from "react-native-gesture-handler";

const { width, height } = Dimensions.get("screen");

const LEFT = "LEFT";
const RIGHT = "RIGHT";
const TOP = "TOP";
const BOTTOM = "BOTTOM";

type DirectionType = typeof LEFT | typeof RIGHT | typeof TOP | typeof BOTTOM;

const getModalInitialPosition = (
  direction: DirectionType,
  screenWidth: number,
  ScreenHeight: number
) => {
  if (direction === TOP) {
    return {
      bottom: ScreenHeight,
      left: 0,
    };
  }
  if (direction === BOTTOM) {
    return {
      top: ScreenHeight,
      left: 0,
    };
  }
  if (direction === LEFT) {
    return {
      bottom: 0,
      right: screenWidth,
    };
  }
  if (direction === RIGHT) {
    return {
      bottom: 0,
      left: screenWidth,
    };
  }
};

const SwipeableModal = ({ type, snapPoint }) => {
  const modalPosition = useSharedValue(width);
  const modalPanOffset = useSharedValue(0);

  const onUpdateGesture = (
    e: GestureUpdateEvent<PanGestureHandlerEventPayload>
  ) => {
    "worklet";

    console.log("🚀 ~ file: SwipeableModal.tsx:58 ~ SwipeableModal ~ e:", e);
    if (type === LEFT || type === RIGHT) {
      modalPosition.value = modalPanOffset.value - e.translationX;
    }
  };

  const onEndGesture = useCallback(
    (e: GestureStateChangeEvent<PanGestureHandlerEventPayload>) => {
      "worklet";

      if (type === LEFT) {
        console.log(
          "🚀 ~ file: SwipeableModal.tsx:77 ~ SwipeableModal ~ e.translationX:",
          e.translationX
        );
        // if (modalPosition.value <= width - snapPoint) {
        //   modalPosition.value = withTiming(width - snapPoint, {
        //     duration: 100,
        //   });
        // } else if (modalPosition.value > width - snapPoint) {
        //   modalPosition.value = withTiming(width, {
        //     duration: 100,
        //   });
        // }
        console.log(
          "🚀 ~ file: SwipeableModal.tsx:85 ~ SwipeableModal ~  width - snapPoint:",
          width - snapPoint
        );
        console.log(
          "🚀 ~ file: SwipeableModal.tsx:85 ~ SwipeableModal ~ modalPosition.value :",
          modalPosition.value
        );
      }
    },
    [modalPosition, modalPanOffset]
  );

  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .onStart((e) => {
          modalPanOffset.value = modalPosition.value;
        })
        .onUpdate(onUpdateGesture)
        .onEnd(onEndGesture),
    // .onFinalize(onFinalizeGesture),
    [
      onEndGesture,
      // onFinalizeGesture,
      onUpdateGesture,
    ]
  );

  const show = () => {
    console.log("called");

    modalPosition.value = withTiming(width - snapPoint, { duration: 300 });
    modalPanOffset.value = snapPoint;
  };

  const modalStyle = useAnimatedStyle(() => ({
    // transform: [{ translateX: modalPosition.value }],
    // right: modalPosition.value,
    right: interpolate(
      modalPosition.value,
      [0, width - snapPoint, width],
      [width - snapPoint, width - snapPoint, width]
    ),
  }));

  return (
    <View
      style={{
        // flex: 1,
        // width,
        // height,
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "red",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Button title="left modal" onPress={show} />
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.absolute, modalStyle]}>
          <Text>SwipeableModal</Text>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

export default SwipeableModal;

const styles = StyleSheet.create({
  absolute: {
    width: 200,
    height: 200,
    position: "absolute",
    top: 100,
    // left: 0,
    backgroundColor: "yellow",
    zIndex: 1,
  },
});
