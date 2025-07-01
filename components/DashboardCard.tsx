import { Ionicons } from "@expo/vector-icons";
import React, { FC } from "react";
import { Text, View } from "react-native";

interface DashboardCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const DashboardCard: FC<DashboardCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color,
  trend,
}) => {
  return (
    <View className="bg-white rounded-xl p-4 shadow-sm shadow-neutral-300 mb-4">
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-1">
          <Text className="text-sm text-gray-600 font-medium">{title}</Text>
          <Text className="text-2xl font-bold text-gray-800 mt-1">
            {typeof value === "number" &&
            title.toLowerCase().includes("revenue")
              ? `$${value.toFixed(2)}`
              : value}
          </Text>
          {subtitle && (
            <Text className="text-xs text-gray-500 mt-1">{subtitle}</Text>
          )}
        </View>
        <View
          className="w-12 h-12 rounded-full items-center justify-center"
          style={{ backgroundColor: `${color}20` }}
        >
          <Ionicons name={icon} size={24} color={color} />
        </View>
      </View>

      {trend && (
        <View className="flex-row items-center mt-2">
          <Ionicons
            name={trend.isPositive ? "trending-up" : "trending-down"}
            size={16}
            color={trend.isPositive ? "#10B981" : "#EF4444"}
          />
          <Text
            className={`text-xs font-medium ml-1 ${
              trend.isPositive ? "text-green-600" : "text-red-600"
            }`}
          >
            {trend.isPositive ? "+" : ""}
            {trend.value}%
          </Text>
        </View>
      )}
    </View>
  );
};

export default DashboardCard;
