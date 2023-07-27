import { Dimensions, StyleSheet, Text, View } from "react-native";
import React from "react";
import Button from "./Button";

const { width, height } = Dimensions.get("window");

const Card = ({ circularTabRef, data, index }) => {
  return (
    <View style={[styles.container, { backgroundColor: data?.bgColor }]}>
      <Text style={styles.container}>{data?.title}</Text>
      <Button
        title="Remove Tab"
        onPress={() => circularTabRef.current?.removeTab(index)}
      />
    </View>
  );
};

export default Card;

const styles = StyleSheet.create({
  container: {
    width,
    height: (height * 3) / 4,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 25,
    color: "white",
  },
});
