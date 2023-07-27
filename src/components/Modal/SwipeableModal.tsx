import { Dimensions, Pressable, StyleSheet, ViewStyle } from "react-native";
import React, {
  ReactNode,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import Animated, {
  SharedValue,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  Gesture,
  GestureDetector,
  GestureUpdateEvent,
  PanGestureHandlerEventPayload,
} from "react-native-gesture-handler";

const { width, height } = Dimensions.get("screen");

const LEFT = "LEFT";
const RIGHT = "RIGHT";
const TOP = "TOP";
const BOTTOM = "BOTTOM";

type DirectionType = typeof LEFT | typeof RIGHT | typeof TOP | typeof BOTTOM;

interface SwipeableModalInterface {
  direction: DirectionType;
  snapPoint: number;
  style?: ViewStyle;
  containerStyle?: ViewStyle;
  /**
   * @description: disables the modal backdrop hiding feature
   * @default: This is true by default
   */
  enableBackdropDismiss?: boolean;
  children: ReactNode;
}

export interface SwipeableModalRefInterface {
  show: () => void;
  hide: () => void;
}

const SwipeableModal = (
  {
    style,
    children,
    direction,
    snapPoint,
    containerStyle,
    enableBackdropDismiss = true,
  }: SwipeableModalInterface,
  ref: React.Ref<unknown> | undefined
) => {
  const modalPanOffset = useSharedValue(0);
  const modalPosition = useSharedValue(
    direction === LEFT || direction === RIGHT ? width : height
  );
  const [isBackdropVisible, setIsBackdropVisible] = useState(false);

  const onUpdateGesture = useCallback(
    (e: GestureUpdateEvent<PanGestureHandlerEventPayload>) => {
      "worklet";

      if (direction === LEFT) {
        modalPosition.value = interpolate(
          modalPanOffset.value - e.translationX,
          [0, width - snapPoint, width],
          [width - snapPoint, width - snapPoint, width]
        );
      }

      if (direction === RIGHT) {
        modalPosition.value = interpolate(
          modalPanOffset.value + e.translationX,
          [0, width - snapPoint, width],
          [width - snapPoint, width - snapPoint, width]
        );
      }

      if (direction === BOTTOM) {
        modalPosition.value = interpolate(
          modalPanOffset.value + e.translationY,
          [0, height - snapPoint, height],
          [height - snapPoint, height - snapPoint, height]
        );
      }

      if (direction === TOP) {
        modalPosition.value = interpolate(
          modalPanOffset.value - e.translationY,
          [0, height - snapPoint, height],
          [height - snapPoint, height - snapPoint, height]
        );
      }
    },
    [direction, modalPanOffset, modalPosition, snapPoint]
  );

  const onEndGesture = useCallback(() => {
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
  }, [direction, modalPosition, snapPoint]);

  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .onStart(() => {
          modalPanOffset.value = modalPosition.value;
        })
        .onUpdate(onUpdateGesture)
        .onEnd(onEndGesture),
    [modalPanOffset, modalPosition, onEndGesture, onUpdateGesture]
  );

  const show = useCallback(() => {
    if (direction === LEFT || direction === RIGHT) {
      modalPosition.value = withTiming(width - snapPoint, { duration: 300 });
    }

    if (direction === BOTTOM || direction === TOP) {
      modalPosition.value = withTiming(height - snapPoint, { duration: 300 });
    }
    setIsBackdropVisible(true);
  }, [direction, modalPosition, snapPoint]);

  const hide = useCallback(() => {
    setIsBackdropVisible(false);
    if (direction === LEFT || direction === RIGHT) {
      modalPosition.value = withTiming(width, { duration: 300 });
    }

    if (direction === BOTTOM || direction === TOP) {
      modalPosition.value = withTiming(height, { duration: 300 });
    }
  }, [direction, modalPosition]);

  useImperativeHandle(
    ref,
    () => ({
      show,
      hide,
    }),
    [show, hide]
  );

  const getModalDirectionAnimatedStyle = useCallback(
    (_direction: DirectionType, _modalPosition: SharedValue<number>) => {
      "worklet";

      if (_direction === LEFT) {
        return {
          right: _modalPosition.value,
          bottom: 0,
        };
      }
      if (_direction === RIGHT) {
        return {
          left: _modalPosition.value,
          bottom: 0,
        };
      }
      if (_direction === TOP) {
        return {
          bottom: _modalPosition.value,
          left: 0,
        };
      }
      if (_direction === BOTTOM) {
        return {
          top: _modalPosition.value,
          left: 0,
        };
      }
    },
    []
  );

  const modalStyle = useAnimatedStyle(() =>
    getModalDirectionAnimatedStyle(direction, modalPosition)
  );

  return (
    <>
      {enableBackdropDismiss && isBackdropVisible && (
        <Pressable style={[styles.container, containerStyle]} onPress={hide} />
      )}

      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.absolute, style, modalStyle]}>
          {children}
        </Animated.View>
      </GestureDetector>
    </>
  );
};

export default forwardRef<SwipeableModalRefInterface, SwipeableModalInterface>(
  SwipeableModal
);

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
  },
  absolute: {
    position: "absolute",
  },
});
