import CustomButton from "@/components/CustomButton";
import AddEditOrdersModal from "@/components/orders/AddEditeOrdersModal";
import AntDesign from "@expo/vector-icons/AntDesign";
import firestore from "@react-native-firebase/firestore";
import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Define the order type inline
interface Order {
  id: string;
  productName: string;
  quantity: string;
  price: string;
  timestamp: { seconds: number; nanoseconds: number };
}

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

  const handleDelete = (id: string) => {
    firestore().collection("Orders").doc(id).delete();
  };

  const handleAddOrder = (order: {
    productName: string;
    quantity: string;
    price: string;
  }) => {
    firestore()
      .collection("Orders")
      .add({
        ...order,
        timestamp: firestore.FieldValue.serverTimestamp(),
      });
  };

  const handleEditOrder = (order: {
    productName: string;
    quantity: string;
    price: string;
  }) => {
    if (editOrderId) {
      firestore().collection("Orders").doc(editOrderId).update(order);
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
      {loading ? (
        <Text>Loading...</Text>
      ) : (
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
      )}
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
