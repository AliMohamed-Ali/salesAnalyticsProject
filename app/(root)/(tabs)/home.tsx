import DashboardCard from "@/components/DashboardCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import RecommendationCard from "@/components/RecommendationCard";
import { AnalyticsService } from "@/services/analytics";
import { FirebaseService } from "@/services/firebase";
import { AnalyticsData, Order } from "@/types/order";
import React, { useEffect, useState } from "react";
import {
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";

export default function HomeAnalytics() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Subscribe to real-time orders
    const unsubscribe = FirebaseService.subscribeToOrders((orderList) => {
      setOrders(orderList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Calculate analytics whenever orders change
    if (orders.length > 0 || !loading) {
      const calculatedAnalytics = AnalyticsService.calculateAnalytics(orders);
      setAnalytics(calculatedAnalytics);
    }
  }, [orders, loading]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // The real-time listener will automatically update the data
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const recommendations = AnalyticsService.getRecommendations(orders);

  if (loading) {
    return <LoadingSpinner message="Loading analytics..." />;
  }

  return (
    <SafeAreaView className="bg-gray-50 flex-1">
      <ScrollView
        className="flex-1 p-4 mb-20"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text className="text-3xl font-bold text-gray-800 mb-6">Dashboard</Text>

        {/* Analytics Cards */}
        <View className="mb-6">
          <Text className="text-xl font-semibold text-gray-700 mb-4">
            Key Metrics
          </Text>

          <DashboardCard
            title="Total Revenue"
            value={analytics?.totalRevenue || 0}
            subtitle="All time sales"
            icon="cash"
            color="#10B981"
          />

          <DashboardCard
            title="Orders Last Hour"
            value={analytics?.ordersLastHour || 0}
            subtitle="Recent activity"
            icon="time"
            color="#3B82F6"
          />

          <DashboardCard
            title="Total Orders"
            value={orders.length}
            subtitle="All time orders"
            icon="list"
            color="#8B5CF6"
          />
        </View>

        {/* Top Products */}
        <View className="mb-6">
          <Text className="text-xl font-semibold text-gray-700 mb-4">
            Top Selling Products
          </Text>
          {analytics?.topProducts && analytics.topProducts.length > 0 ? (
            analytics.topProducts.map(([name, count], index) => (
              <View
                key={name}
                className="bg-white rounded-xl p-4 shadow-sm shadow-neutral-300 mb-3"
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <View className="w-8 h-8 rounded-full bg-blue-100 items-center justify-center mr-3">
                      <Text className="text-blue-600 font-bold text-sm">
                        {index + 1}
                      </Text>
                    </View>
                    <Text className="text-lg font-medium text-gray-800">
                      {name}
                    </Text>
                  </View>
                  <Text className="text-gray-600 font-semibold">
                    {count} sold
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <View className="bg-white rounded-xl p-4 shadow-sm shadow-neutral-300">
              <Text className="text-gray-500 text-center">
                No products sold yet
              </Text>
            </View>
          )}
        </View>

        {/* Recommendations */}
        <View className="mb-6">
          <Text className="text-xl font-semibold text-gray-700 mb-4">
            AI Recommendations
          </Text>

          <RecommendationCard
            title="Products to Promote"
            items={recommendations.productsToPromote}
            type="promote"
            emptyMessage="All products performing well"
          />

          <RecommendationCard
            title="Top Revenue Products"
            items={recommendations.topRevenueProducts.map(
              ([name, revenue]) => `${name} ($${revenue.toFixed(2)})`
            )}
            type="top"
            emptyMessage="No revenue data available"
          />

          <RecommendationCard
            title="Underperforming Products"
            items={recommendations.underperformingProducts}
            type="underperforming"
            emptyMessage="All products have recent sales"
          />
        </View>

        {/* Revenue Chart Placeholder */}
        <View className="mb-6">
          <Text className="text-xl font-semibold text-gray-700 mb-4">
            Revenue Trend (Last 7 Days)
          </Text>
          <View className="bg-white rounded-xl p-4 shadow-sm shadow-neutral-300">
            <View className="flex-row justify-between items-center">
              {analytics?.revenueByDay &&
                Object.entries(analytics.revenueByDay).map(
                  ([date, revenue]) => (
                    <View key={date} className="items-center">
                      <Text className="text-xs text-gray-500 mb-1">
                        {new Date(date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </Text>
                      <View
                        className="w-8 rounded-t-sm"
                        style={{
                          height: Math.max(
                            20,
                            (revenue /
                              Math.max(
                                ...Object.values(analytics.revenueByDay)
                              )) *
                              60
                          ),
                          backgroundColor: revenue > 0 ? "#10B981" : "#E5E7EB",
                        }}
                      />
                      <Text className="text-xs text-gray-600 mt-1">
                        ${revenue.toFixed(0)}
                      </Text>
                    </View>
                  )
                )}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
