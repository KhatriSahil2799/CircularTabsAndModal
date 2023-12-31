import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import React, { useRef } from "react";
import SwipeableModal, {
  SwipeableModalRefInterface,
} from "./Modal/SwipeableModal";
import Button from "./Button/Button";
import ModalHeader from "./Modal/ModalHeader";

const ModalDemo = () => {
  const { width, height } = useWindowDimensions();

  /******** Ref for all 4 modals *******/
  const leftModalRef = useRef<SwipeableModalRefInterface>();
  const rightModalRef = useRef<SwipeableModalRefInterface>();
  const topModalRef = useRef<SwipeableModalRefInterface>();
  const bottomModalRef = useRef<SwipeableModalRefInterface>();

  return (
    <>
      <ModalHeader title={"Modal"} />
      <View style={styles.container}>
        {/*******  Buttons to show all 4 modals (Left, Right, Top and Bottom) ********/}
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

        {/***********************  Left Modal ***********************/}
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

        {/***********************  Right Modal ***********************/}
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

        {/***********************  Top Modal ***********************/}
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

        {/***********************  Bottom Modal ***********************/}
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
    </>
  );
};

export default ModalDemo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
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
