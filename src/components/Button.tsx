import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import React from "react";

interface ButtonProps {
  title: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

const Button = ({ title, onPress, style }: ButtonProps) => {
  return (
    <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  container: {
    padding: 2,
    margin: 5,
    borderRadius: 4,
    paddingHorizontal: 10,
    backgroundColor: "rgba(0,0,255,0.5)",
  },
  title: { fontSize: 16, color: "white", textAlign: "center" },
});
