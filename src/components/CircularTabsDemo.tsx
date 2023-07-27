import { ScrollView, StyleSheet, View } from "react-native";
import React, { useRef, useState } from "react";
import CircularTabs, {
  CircularTabsRefInterface,
} from "./CircularTabs/CircularTabs";
import Button from "./Button/Button";
import Card from "./CircularTabs/Card";

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
      {/******************  Buttons to scroll to different tabs ************/}
      <ScrollView style={{ flex: 2, marginTop: 10 }}>
        <Button title="Add New Tab" onPress={addTab} />

        <View style={styles.tabsButtonsContainer}>
          {tabButtons?.map((itemIndex) => {
            return (
              <Button
                key={`Tab ${itemIndex}`}
                title={`Tab ${itemIndex}`}
                titleStyle={{ fontSize: 16, color: "white" }}
                onPress={() => {
                  circularTabRef.current?.scrollToIndex(itemIndex);
                }}
              />
            );
          })}
        </View>
      </ScrollView>

      {/************************** Circular Tabs ***************************/}
      <View style={styles.circularTabsContainer}>
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
      </View>
    </>
  );
};

export default CircularTabsDemo;

const styles = StyleSheet.create({
  tabsButtonsContainer: {
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "center",
  },
  circularTabsContainer: {
    flex: 5,
    marginTop: 20,
  },
});
