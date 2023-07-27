import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useMemo, useRef, useState } from "react";
import CircularTabs from "./CircularTabs";

const DATA = [
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

const Card = ({ text, bgColor, removeTab, index, data }) => {
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
      <TouchableOpacity
        style={{
          backgroundColor: "rgba(0,0,255,0.5)",
          padding: 2,
          paddingHorizontal: 10,
          margin: 5,
          borderRadius: 4,
        }}
        onPress={() => removeTab(data, index)}
      >
        <Text style={{ fontSize: 16, color: "white", textAlign: "center" }}>
          Remove Tab
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const memoizedData = () => {
  return DATA.map((item) => {
    return { ...item, bgColor: useGenerateRandomColor() };
  });
};

const CircularTabsDemo = () => {
  const [data, setData] = useState(memoizedData);

  const circularTabRef = useRef();

  const addTab = (data: Array<any>) => {
    const lastItemIndex = data?.length - 1;
    console.log(
      "🚀 ~ file: CircularTabsDemo.tsx:61 ~ addTab ~ lastItemIndex:",
      lastItemIndex
    );
    data.push({
      title: `Screen ${lastItemIndex + 1}`,
      bgColor: useGenerateRandomColor(),
    });

    // setTimeout(() => {
    circularTabRef.current?.scrollToIndex(lastItemIndex + 1);
  };

  const removeTab = (data: Array<any>, index: number) => {
    data.splice(index, 1);

    // console.log(
    //   "🚀 ~ file: CircularTabsDemo.tsx:61 ~ addTab ~ lastItemIndex:",
    //   lastItemIndex
    // );
    // data.push({
    //   title: `Screen ${lastItemIndex + 1}`,
    //   bgColor: useGenerateRandomColor(),
    // });

    const newLastItemIndex = data?.length - 1;

    circularTabRef.current?.scrollToIndex(
      index - 1 === newLastItemIndex ? newLastItemIndex : index
    );
  };

  return (
    <>
      <TouchableOpacity
        style={{
          backgroundColor: "rgba(0,0,255,0.5)",
          padding: 2,
          paddingHorizontal: 10,
          margin: 5,
          borderRadius: 4,
        }}
        onPress={() => addTab(data)}
      >
        <Text
          style={{ fontSize: 16, color: "white", textAlign: "center" }}
        >{`Add New Tab`}</Text>
      </TouchableOpacity>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {data?.map((item, index) => {
          return (
            <TouchableOpacity
              style={{
                backgroundColor: "rgba(0,0,255,0.5)",
                padding: 2,
                paddingHorizontal: 10,
                margin: 5,
                borderRadius: 4,
              }}
              onPress={() => {
                circularTabRef.current?.scrollToIndex(index);
              }}
            >
              <Text
                style={{ fontSize: 16, color: "white" }}
              >{`Tab ${index}`}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <CircularTabs
        //   <{
        //   title: string;
        //   bgColor: string;
        // }>
        ref={circularTabRef}
        data={data}
        animation={true}
        //   itemDimention={{}}
        renderer={(item, index) => {
          return (
            <Card
              data={data}
              index={index}
              text={item?.title}
              bgColor={item.bgColor}
              removeTab={removeTab}
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
