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
  // const modalPosition = useSharedValue(width);
  const modalPosition = useSharedValue(height);
  const modalPanOffset = useSharedValue(0);

  const onLeftUpdate = () => {};

  const onUpdateGesture = (
    e: GestureUpdateEvent<PanGestureHandlerEventPayload>
  ) => {
    "worklet";

    console.log(
      "🚀 ~ file: SwipeableModal.tsx:73 ~ SwipeableModal ~ e.translationX:",
      e.translationX
    );
    if (type === LEFT) {
      //   modalPosition.value = modalPanOffset.value - e.translationX;
      modalPosition.value = interpolate(
        modalPanOffset.value - e.translationX,
        [0, width - snapPoint, width],
        [width - snapPoint, width - snapPoint, width]
      );
    }

    console.log(
      "🚀 ~ file: SwipeableModal.tsx:86 ~ SwipeableModal ~ modalPanOffset.value + e.translationX:",
      modalPanOffset.value + e.translationX
    );
    if (type === RIGHT) {
      //   modalPosition.value = modalPanOffset.value + e.translationX;
      modalPosition.value = interpolate(
        modalPanOffset.value + e.translationX,
        [0, width - snapPoint, width],
        [width - snapPoint, width - snapPoint, width]
      );
    }

    if (type === BOTTOM) {
      //   modalPosition.value = modalPanOffset.value + e.translationY;
      modalPosition.value = interpolate(
        modalPanOffset.value + e.translationY,
        [0, height - snapPoint, height],
        [height - snapPoint, height - snapPoint, height]
      );
    }

    if (type === TOP) {
      //   modalPosition.value = modalPanOffset.value + e.translationY;
      modalPosition.value = interpolate(
        modalPanOffset.value - e.translationY,
        [0, height - snapPoint, height],
        [height - snapPoint, height - snapPoint, height]
      );
    }
  };

  const onEndGesture = useCallback(
    (e: GestureStateChangeEvent<PanGestureHandlerEventPayload>) => {
      "worklet";

      /**
       * Closes the modal if it goes below threshold
       */
      if (type === LEFT || type === RIGHT) {
        if (modalPosition.value > width - snapPoint) {
          modalPosition.value = withTiming(width, {
            duration: 100,
          });
        }
      }

      /**
       * Closes the modal if it goes below threshold
       */
      if (type === BOTTOM || type === TOP) {
        if (modalPosition.value > height - snapPoint) {
          modalPosition.value = withTiming(height, {
            duration: 100,
          });
        }
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

    modalPosition.value = withTiming(height - snapPoint, { duration: 300 });
    modalPanOffset.value = snapPoint;
  };

  const modalStyle = useAnimatedStyle(() => ({
    // // for left modal
    // right: modalPosition.value,

    // // for right modal
    // left: modalPosition.value,

    // // for bottom modal
    //   top: modalPosition.value,

    // for bottom modal
    bottom: modalPosition.value,
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
    // top: 100,
    left: 0,
    backgroundColor: "yellow",
    zIndex: 1,
  },
});
