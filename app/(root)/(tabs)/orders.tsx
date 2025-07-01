import CustomButton from "@/components/CustomButton";
import LoadingSpinner from "@/components/LoadingSpinner";
import AddEditOrdersModal from "@/components/orders/AddEditeOrdersModal";
import { FirebaseService } from "@/services/firebase";
import { Order, OrderFormData } from "@/types/order";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Page() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editOrderId, setEditOrderId] = useState<string | null>(null);
  const [editOrderData, setEditOrderData] = useState<{
    productName: string;
    quantity: string;
    price: string;
  } | null>(null);

  useEffect(() => {
    // Subscribe to real-time orders
    const unsubscribe = FirebaseService.subscribeToOrders((orderList) => {
      setOrders(orderList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = (id: string) => {
    FirebaseService.deleteOrder(id);
  };

  const handleAddOrder = (order: OrderFormData) => {
    FirebaseService.addOrder(order);
  };

  const handleEditOrder = (order: OrderFormData) => {
    if (editOrderId) {
      FirebaseService.updateOrder(editOrderId, order);
    }
  };

  const openAddModal = () => {
    setModalMode("add");
    setEditOrderId(null);
    setEditOrderData(null);
    setModalVisible(true);
  };

  const openEditModal = (order: Order) => {
    setModalMode("edit");
    setEditOrderId(order.id);
    setEditOrderData({
      productName: order.productName,
      quantity: order.quantity,
      price: order.price,
    });
    setModalVisible(true);
  };

  const renderOrder = ({ item }: { item: Order }) => {
    const date = item.timestamp?.seconds
      ? new Date(item.timestamp.seconds * 1000)
      : null;
    return (
      <View className="bg-white rounded-lg shadow-sm shadow-neutral-300 mb-3 p-4 flex-row justify-between items-center">
        <View className="flex-col gap-2 flex-2">
          <Text className="text-lg font-bold">{item.productName}</Text>
          <Text className="text-md font-semibold">
            Quantity: {item.quantity}
          </Text>
          <Text className="text-md font-semibold">Price: {item.price}</Text>
          <Text className="text-md text-gray-500">
            {date ? date.toLocaleString() : ""}
          </Text>
        </View>
        <View className="flex-col gap-2">
          <CustomButton
            IconLeft={() => <AntDesign name="edit" size={18} color="black" />}
            onPress={() => openEditModal(item)}
            className="w-11 h-11 rounded-full bg-neutral-200"
          />
          <CustomButton
            onPress={() => handleDelete(item.id)}
            IconLeft={() => <AntDesign name="delete" size={18} color="white" />}
            className="w-11 h-11 rounded-full bg-red-500"
          />
        </View>
      </View>
    );
  };

  if (loading) {
    return <LoadingSpinner message="Loading orders..." />;
  }

  return (
    <SafeAreaView className="bg-general-500 flex-1 p-4">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-2xl font-bold">Orders</Text>
        <CustomButton
          onPress={openAddModal}
          IconLeft={() => <AntDesign name="plus" size={18} color="white" />}
          className="w-11 h-11 rounded-full bg-blue-500"
        />
      </View>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={renderOrder}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={
          <Text className="text-center text-gray-500 text-2xl">
            No orders found.
          </Text>
        }
      />
      <AddEditOrdersModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={modalMode === "add" ? handleAddOrder : handleEditOrder}
        initialOrder={modalMode === "edit" ? editOrderData : null}
        mode={modalMode}
      />
    </SafeAreaView>
  );
}
