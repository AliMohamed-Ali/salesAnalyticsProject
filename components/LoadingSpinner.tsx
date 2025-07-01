import React from "react";
import { ActivityIndicator, Text, View } from "react-native";

interface LoadingSpinnerProps {
  message?: string;
  size?: "small" | "large";
  color?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = "Loading...",
  size = "large",
  color = "#3B82F6",
}) => {
  return (
    <View className="flex-1 justify-center items-center bg-gray-50">
      <ActivityIndicator size={size} color={color} />
      <Text className="text-gray-600 mt-4 text-lg">{message}</Text>
    </View>
  );
};

export default LoadingSpinner;
