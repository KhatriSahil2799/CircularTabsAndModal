import { Dimensions, FlatList, StyleSheet, Text, View } from "react-native";
import React, { memo, useMemo, useState } from "react";
import CircularTabs from "./CircularTabs2";
import InfiniteLoopingFlatList from "./InfiniteLoopingFlatList";
import { Picker } from "@react-native-picker/picker";

const data = [
  {
    title: "Screen 1",
    // bgColor: "red"
  },
  {
    title: "Screen 2",
    // bgColor: "pink"
  },
  {
    title: "Screen 3",
    // bgColor: "gray"
  },
  { title: "Screen 4" },
  { title: "Screen 5" },
  { title: "Screen 6" },
  { title: "Screen 7" },
  { title: "Screen 8" },
  { title: "Screen 9" },
  { title: "Screen 10" },
];

const useGenerateRandomColor = () =>
  `#${Math.random().toString(16).substr(-6)}`;

const { width } = Dimensions.get("window");

const Card = ({ text, bgColor }) => {
  console.log("🚀 ~ file: CircularTabsDemo.tsx:31 ~ { text, bgColor }:", {
    text,
    bgColor,
  });
  return (
    <View
      style={{
        // width: 200,
        width,

        height: 500,
        flex: 1,
        backgroundColor: bgColor,
      }}
    >
      <Text>{text}</Text>
    </View>
  );
};

const CircularTabsDemo = () => {
  const memoizedData = useMemo(() => {
    return data.map((item) => {
      return { ...item, bgColor: useGenerateRandomColor() };
    });
  }, [data]);
  console.log(
    "🚀 ~ file: CircularTabsDemo.tsx:40 ~ memoizedData ~ memoizedData:",
    memoizedData
  );
  const [selectedLanguage, setSelectedLanguage] = useState();

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
          console.log(
            "🚀 ~ file: CircularTabsDemo.tsx:69 ~ Renderer={memo ~ item, index:",
            item,
            index
          );
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
