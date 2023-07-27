import { Dimensions, StyleSheet, Text, View } from "react-native";
import React, { useMemo } from "react";
import CircularTabs from "./CircularTabs";

const data = [
  { title: "Screen 0" },
  { title: "Screen 1" },
  { title: "Screen 2" },
  { title: "Screen 3" },
  { title: "Screen 4" },
  { title: "Screen 5" },
  { title: "Screen 6" },
  { title: "Screen 7" },
  { title: "Screen 8" },
  { title: "Screen 9" },
];

const useGenerateRandomColor = () =>
  `#${Math.random().toString(16).substr(-6)}`;

const { width } = Dimensions.get("window");

const Card = ({ text, bgColor }) => {
  return (
    <View
      style={{
        // width: 200,
        width,

        height: 500,
        flex: 1,
        backgroundColor: bgColor,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 25, color: "white" }}>{text}</Text>
    </View>
  );
};

const CircularTabsDemo = () => {
  const memoizedData = useMemo(() => {
    return data.map((item) => {
      return { ...item, bgColor: useGenerateRandomColor() };
    });
  }, [data]);

  return (
    <>
      <CircularTabs<{
        title: string;
        bgColor: string;
      }>
        data={memoizedData}
        animation={true}
        //   itemDimention={{}}
        renderer={(item, index) => {
          return (
            <Card
              text={item?.title}
              bgColor={item.bgColor}
              // key="cardA"
            />
          );
        }}
      />
    </>
  );
};

export default CircularTabsDemo;

const styles = StyleSheet.create({});
