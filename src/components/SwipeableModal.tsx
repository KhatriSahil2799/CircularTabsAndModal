import {
  Button,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
} from "react-native";
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
} from "react";
import Animated, {
  SharedValue,
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

const {
  width,
  height,
  // : ScreenHeight
} = Dimensions.get("screen");

const LEFT = "LEFT";
const RIGHT = "RIGHT";
const TOP = "TOP";
const BOTTOM = "BOTTOM";

type DirectionType = typeof LEFT | typeof RIGHT | typeof TOP | typeof BOTTOM;

const getModalDirectionAnimatedStyle = (
  direction: DirectionType,
  modalPosition: SharedValue<number>
) => {
  "worklet";

  if (direction === LEFT) {
    return {
      right: modalPosition.value,
      bottom: 0,
    };
  }
  if (direction === RIGHT) {
    return {
      left: modalPosition.value,
      bottom: 0,
    };
  }
  if (direction === TOP) {
    return {
      bottom: modalPosition.value,
      left: 0,
    };
  }
  if (direction === BOTTOM) {
    return {
      top: modalPosition.value,
      left: 0,
    };
  }
};

interface SwipeableModalInterface {
  direction: DirectionType;
  snapPoint: number;
  onShow: () => void;
  onHide: () => void;
  style: ViewStyle;
  containerStyle: ViewStyle;
  /**
   * @description: disables the modal backdrop hiding feature
   * @default: This is true by default
   */
  enableBackdropDismiss: boolean;
}

const SwipeableModal = (
  {
    direction,
    snapPoint,
    onShow,
    onHide,
    containerStyle,
    style,
    children,
    enableBackdropDismiss = true,
  }: SwipeableModalInterface,
  ref
) => {
  //   const {} = useWindowDimensions();

  const modalPosition = useSharedValue(
    direction === LEFT || direction === RIGHT ? width : height
  );
  const modalPanOffset = useSharedValue(0);

  const onUpdateGesture = (
    e: GestureUpdateEvent<PanGestureHandlerEventPayload>
  ) => {
    "worklet";

    if (direction === LEFT) {
      //   modalPosition.value = modalPanOffset.value - e.translationX;
      modalPosition.value = interpolate(
        modalPanOffset.value - e.translationX,
        [0, width - snapPoint, width],
        [width - snapPoint, width - snapPoint, width]
      );
    }

    if (direction === RIGHT) {
      //   modalPosition.value = modalPanOffset.value + e.translationX;
      modalPosition.value = interpolate(
        modalPanOffset.value + e.translationX,
        [0, width - snapPoint, width],
        [width - snapPoint, width - snapPoint, width]
      );
    }

    if (direction === BOTTOM) {
      //   modalPosition.value = modalPanOffset.value + e.translationY;
      modalPosition.value = interpolate(
        modalPanOffset.value + e.translationY,
        [0, height - snapPoint, height],
        [height - snapPoint, height - snapPoint, height]
      );
    }

    if (direction === TOP) {
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
      if (direction === LEFT || direction === RIGHT) {
        if (modalPosition.value > width - snapPoint) {
          modalPosition.value = withTiming(width, {
            duration: 100,
          });
        }
      }

      /**
       * Closes the modal if it goes below threshold
       */
      if (direction === BOTTOM || direction === TOP) {
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
    [onEndGesture, onUpdateGesture]
  );

  const show = () => {
    if (direction === LEFT || direction === RIGHT) {
      modalPosition.value = withTiming(width - snapPoint, { duration: 300 });
    }

    if (direction === BOTTOM || direction === TOP) {
      modalPosition.value = withTiming(height - snapPoint, { duration: 300 });
    }
  };

  const hide = () => {
    if (direction === LEFT || direction === RIGHT) {
      modalPosition.value = withTiming(width, { duration: 300 });
    }

    if (direction === BOTTOM || direction === TOP) {
      modalPosition.value = withTiming(height, { duration: 300 });
    }
  };

  useImperativeHandle(
    ref,
    () => {
      return {
        show,
        hide,
      };
    },
    [show, hide]
  );

  const modalStyle = useAnimatedStyle(() => {
    return getModalDirectionAnimatedStyle(direction, modalPosition);
  });

  return (
    <>
      <Pressable style={[styles.container, containerStyle]} onPress={hide}>
        {/* <Button title="show modal" onPress={show} /> */}

        <GestureDetector gesture={panGesture}>
          <Animated.View style={[styles.absolute, style, modalStyle]}>
            {children}
          </Animated.View>
        </GestureDetector>
      </Pressable>
    </>
  );
};

export default forwardRef(SwipeableModal);

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 0, 0, 0.25)",
    justifyContent: "center",
  },
  absolute: {
    position: "absolute",
  },
});
