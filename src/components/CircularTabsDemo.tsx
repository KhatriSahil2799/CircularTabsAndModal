import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useRef, useState } from "react";
import CircularTabs, { CircularTabsRefInterface } from "./CircularTabs";

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

const Card = ({ circularTabRef, data, index }) => {
  return (
    <View
      style={{
        width,

        height: 500,
        flex: 1,
        backgroundColor: data?.bgColor,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 25, color: "white" }}>{data?.title}</Text>
      <TouchableOpacity
        style={{
          backgroundColor: "rgba(0,0,255,0.5)",
          padding: 2,
          paddingHorizontal: 10,
          margin: 5,
          borderRadius: 4,
        }}
        onPress={() => circularTabRef.current?.removeTab(index)}
      >
        <Text style={{ fontSize: 16, color: "white", textAlign: "center" }}>
          Remove Tab
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const DATA_WITH_COLOR = DATA.map((item) => {
  return { ...item, bgColor: useGenerateRandomColor() };
});

const CircularTabsDemo = () => {
  const [data, setData] = useState(DATA_WITH_COLOR);
  const [tabButtons, setTabButtons] = useState(
    DATA_WITH_COLOR?.map((_, index) => {
      return index;
    })
  );
  const circularTabRef = useRef<CircularTabsRefInterface>(null);

  const addTab = () => {
    const lastItemIndex = data?.length - 1;
    circularTabRef.current?.addTab({
      title: `Screen ${lastItemIndex + 1}`,
      bgColor: useGenerateRandomColor(),
    });
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
        onPress={addTab}
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
        {tabButtons?.map((itemIndex) => {
          return (
            <TouchableOpacity
              style={{
                backgroundColor: "rgba(0,0,255,0.5)",
                padding: 2,
                paddingHorizontal: 10,
                margin: 5,
                borderRadius: 4,
              }}
              key={`Tab ${itemIndex}`}
              onPress={() => {
                circularTabRef.current?.scrollToIndex(itemIndex);
              }}
            >
              <Text
                style={{ fontSize: 16, color: "white" }}
              >{`Tab ${itemIndex}`}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <CircularTabs
        ref={circularTabRef}
        data={data}
        animation={true}
        onAddTab={(index) => {
          setTabButtons((prev) => [...prev, index]);
        }}
        onRemoveTab={(index, success) => {
          if (success) {
            setTabButtons((prev) => {
              prev.splice(index, 1);
              return [...prev];
            });
          }
        }}
        renderer={(item, index) => {
          return (
            <Card
              index={index}
              data={item}
              circularTabRef={circularTabRef}
              key={item?.title + index}
            />
          );
        }}
      />
    </>
  );
};

export default CircularTabsDemo;

const styles = StyleSheet.create({});
