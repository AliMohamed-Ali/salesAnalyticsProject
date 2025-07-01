import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

interface RecommendationCardProps {
  title: string;
  items: string[];
  type: "promote" | "top" | "underperforming";
  emptyMessage?: string;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({
  title,
  items,
  type,
  emptyMessage = "No items found",
}) => {
  const getIcon = () => {
    switch (type) {
      case "promote":
        return "trending-up";
      case "top":
        return "star";
      case "underperforming":
        return "alert-circle";
      default:
        return "information-circle";
    }
  };

  const getColor = () => {
    switch (type) {
      case "promote":
        return "#F59E0B";
      case "top":
        return "#10B981";
      case "underperforming":
        return "#EF4444";
      default:
        return "#6B7280";
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case "promote":
        return "#FEF3C7";
      case "top":
        return "#D1FAE5";
      case "underperforming":
        return "#FEE2E2";
      default:
        return "#F3F4F6";
    }
  };

  return (
    <View className="bg-white rounded-xl p-4 shadow-sm shadow-neutral-300 mb-4">
      <View className="flex-row items-center mb-3">
        <View
          className="w-8 h-8 rounded-full items-center justify-center mr-3"
          style={{ backgroundColor: getBackgroundColor() }}
        >
          <Ionicons name={getIcon() as any} size={16} color={getColor()} />
        </View>
        <Text className="text-lg font-semibold text-gray-800">{title}</Text>
      </View>

      {items.length === 0 ? (
        <Text className="text-gray-500 text-sm italic">{emptyMessage}</Text>
      ) : (
        <View>
          {items.map((item, index) => (
            <View
              key={index}
              className="flex-row items-center py-2 border-b border-gray-100 last:border-b-0"
            >
              <View
                className="w-2 h-2 rounded-full mr-3"
                style={{ backgroundColor: getColor() }}
              />
              <Text className="text-gray-700 flex-1">{item}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default RecommendationCard;
