import firestore from "@react-native-firebase/firestore";
import React, { useEffect, useState } from "react";
import { SafeAreaView, Text, View } from "react-native";

interface Order {
  id: string;
  productName: string;
  quantity: string;
  price: string;
  timestamp: { seconds: number; nanoseconds: number };
}

export default function HomeAnalytics() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Real-time listener for orders
    const unsubscribe = firestore()
      .collection("Orders")
      .orderBy("timestamp", "desc")
      .onSnapshot(
        (querySnapshot) => {
          const orderList: Order[] = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            orderList.push({
              id: doc.id,
              productName: data.productName,
              quantity: data.quantity,
              price: data.price,
              timestamp: data.timestamp,
            });
          });
          setOrders(orderList);
          setLoading(false);
        },
        (error) => {
          setLoading(false);
        }
      );
    return () => unsubscribe();
  }, []);

  // --- Analytics Calculations ---
  const totalRevenue = orders.reduce(
    (sum, order) => sum + Number(order.price),
    0
  );

  const productCounts: Record<string, number> = {};
  orders.forEach((order) => {
    if (order.productName in productCounts) {
      productCounts[order.productName] += 1;
    } else {
      productCounts[order.productName] = 1;
    }
  });
  const topProducts = Object.entries(productCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  // Orders in the last hour
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  const ordersLastHour = orders.filter((order) => {
    const orderDate = order.timestamp?.seconds
      ? new Date(order.timestamp.seconds * 1000)
      : null;
    return orderDate && orderDate >= oneHourAgo;
  }).length;

  // Revenue by day for the last 7 days
  const days: string[] = [];
  const revenueByDay: Record<string, number> = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    days.push(key);
    revenueByDay[key] = 0;
  }
  orders.forEach((order) => {
    const orderDate = order.timestamp?.seconds
      ? new Date(order.timestamp.seconds * 1000)
      : null;
    if (orderDate) {
      const key = orderDate.toISOString().slice(0, 10);
      if (key in revenueByDay) {
        revenueByDay[key] += Number(order.price);
      }
    }
  });


  // --- Recommendation Engine ---
  // 1. Products with fewer than 5 sales in the last 7 days
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(now.getDate() - 7);

  // Count sales in the last 7 days
  const salesLast7Days: Record<string, number> = {};
  orders.forEach((order) => {
    const orderDate = order.timestamp?.seconds
      ? new Date(order.timestamp.seconds * 1000)
      : null;
    if (orderDate && orderDate >= sevenDaysAgo) {
      if (order.productName in salesLast7Days) {
        salesLast7Days[order.productName] += 1;
      } else {
        salesLast7Days[order.productName] = 1;
      }
    }
  });
  const productsToPromote = Object.entries(salesLast7Days)
    .filter(([_, count]) => count < 5)
    .map(([name]) => name);

  // 2. Products contributing the highest revenue
  const revenueByProduct: Record<string, number> = {};
  orders.forEach((order) => {
    if (order.productName in revenueByProduct) {
      revenueByProduct[order.productName] += Number(order.price);
    } else {
      revenueByProduct[order.productName] = Number(order.price);
    }
  });
  const topRevenueProducts = Object.entries(revenueByProduct)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return (
    <SafeAreaView className="bg-general-500 flex-1 p-4">
      <Text className="text-2xl font-bold mb-4 mt-4">Dashboard</Text>
      <View className="bg-white rounded-lg shadow p-4 mb-6">
        <Text className="text-xl font-bold mb-2">Analytics</Text>
        {loading ? (
          <Text>Loading...</Text>
        ) : (
          <>
            <Text className="text-lg mb-1">
              Total Revenue:{" "}
              <Text className="font-bold text-primary-500">
                ${totalRevenue.toFixed(2)}
              </Text>
            </Text>
            <Text className="text-lg mb-1">
              Orders in the Last Hour:{" "}
              <Text className="font-bold text-primary-500">
                {ordersLastHour}
              </Text>
            </Text>
            <Text className="text-lg mb-1">Top-Selling Products:</Text>
            {topProducts.length === 0 ? (
              <Text className="text-gray-500">No products yet.</Text>
            ) : (
              topProducts.map(([name, count], idx) => (
                <Text key={name} className="ml-2 text-md">
                  {idx + 1}. {name}{" "}
                  <Text className="text-gray-500">({count} sold)</Text>
                </Text>
              ))
            )}
            <Text className="text-lg font-bold mt-4 mb-2">
              Revenue (Last 7 Days)
            </Text>

            <Text className="text-lg font-bold mt-4 mb-2">
              Recommendation Engine
            </Text>
            <Text className="text-md font-semibold mb-1">
              Products to Promote (fewer than 5 sales in last 7 days):
            </Text>
            {productsToPromote.length === 0 ? (
              <Text className="text-gray-500 mb-2">
                No underperforming products found.
              </Text>
            ) : (
              productsToPromote.map((name) => (
                <Text key={name} className="ml-2 text-md text-yellow-700">
                  - {name}
                </Text>
              ))
            )}
            <Text className="text-md font-semibold mt-3 mb-1">
              Top Revenue Products:
            </Text>
            {topRevenueProducts.length === 0 ? (
              <Text className="text-gray-500">No products found.</Text>
            ) : (
              topRevenueProducts.map(([name, revenue], idx) => (
                <Text key={name} className="ml-2 text-md text-green-700">
                  {idx + 1}. {name} (${revenue.toFixed(2)})
                </Text>
              ))
            )}
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
