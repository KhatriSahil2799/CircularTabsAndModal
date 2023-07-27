import React from "react";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const ModalHeader = ({ title }) => {
  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
        <Ionicons name="md-arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    height: 60,
    backgroundColor: "#f5f5f5",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    top: 35,
  },
  backButton: {
    marginHorizontal: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ModalHeader;
