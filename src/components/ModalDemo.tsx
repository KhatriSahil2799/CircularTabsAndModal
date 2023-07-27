import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import React, { useRef } from "react";
import SwipeableModal from "./SwipeableModal";
import Button from "./Button";

const ModalDemo = () => {
  const { width, height } = useWindowDimensions();
  const leftModalRef = useRef();
  const rightModalRef = useRef();
  const topModalRef = useRef();
  const bottomModalRef = useRef();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button
        style={styles.button}
        title="Show Left Modal"
        onPress={() => leftModalRef?.current?.show?.()}
      />

      <Button
        style={styles.button}
        title="Show Right Modal"
        onPress={() => rightModalRef?.current?.show?.()}
      />

      <Button
        style={styles.button}
        title="Show Top Modal"
        onPress={() => topModalRef?.current?.show?.()}
      />

      <Button
        style={styles.button}
        title="Show Bottom Modal"
        onPress={() => bottomModalRef?.current?.show?.()}
      />
      <SwipeableModal
        direction="LEFT"
        snapPoint={(width * 2) / 3}
        ref={leftModalRef}
      >
        <View
          style={[
            styles.leftModalChildrenContainer,
            {
              width: (width * 2) / 3,
              height,
            },
          ]}
        >
          <Text style={styles.modalText}>
            Try Swiping left to close this modal or use Backdrop
          </Text>
          <Text style={styles.modalText}>{`<------------------`}</Text>
        </View>
      </SwipeableModal>

      <SwipeableModal
        direction="RIGHT"
        snapPoint={(width * 2) / 3}
        ref={rightModalRef}
      >
        <View
          style={[
            styles.rightModalChildrenContainer,
            {
              width: (width * 2) / 3,
              height,
            },
          ]}
        >
          <Text style={styles.modalText}>
            Try Swiping Right to close this modal or use Backdrop
          </Text>
          <Text style={styles.modalText}>{`------------------> `}</Text>
        </View>
      </SwipeableModal>

      <SwipeableModal
        direction="TOP"
        snapPoint={(height * 1) / 3}
        ref={topModalRef}
      >
        <View
          style={[
            styles.topModalChildrenContainer,
            {
              width: width,
              height: (height * 1) / 3,
            },
          ]}
        >
          <Text style={styles.modalText}>
            Try Swiping Up to close this modal or use Backdrop
          </Text>
          <Text style={styles.verticalArrow}>{`↑`}</Text>
        </View>
      </SwipeableModal>

      <SwipeableModal
        direction="BOTTOM"
        snapPoint={(height * 1) / 3}
        ref={bottomModalRef}
      >
        <View
          style={[
            styles.bottomModalChildrenContainer,
            {
              width: width,
              height: (height * 1) / 3,
            },
          ]}
        >
          <Text style={styles.modalText}>
            Try Swiping Down to close this modal or use Backdrop
          </Text>
          <Text style={styles.verticalArrow}>{`↓`}</Text>
        </View>
      </SwipeableModal>
    </View>
  );
};

export default ModalDemo;

const styles = StyleSheet.create({
  button: { padding: 5, width: "60%" },
  modalText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  verticalArrow: {
    color: "white",
    fontSize: 50,
    textAlign: "center",
  },
  leftModalChildrenContainer: {
    backgroundColor: "#12242F",
    borderTopEndRadius: 25,
    borderBottomEndRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },

  rightModalChildrenContainer: {
    backgroundColor: "#12242F",
    borderTopStartRadius: 25,
    borderBottomStartRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  topModalChildrenContainer: {
    backgroundColor: "#12242F",
    borderBottomEndRadius: 25,
    borderBottomStartRadius: 25,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingVertical: 30,
  },
  bottomModalChildrenContainer: {
    backgroundColor: "#12242F",
    borderTopEndRadius: 25,
    borderTopStartRadius: 25,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingVertical: 30,
  },
});
