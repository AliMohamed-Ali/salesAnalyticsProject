import CustomButton from "@/components/CustomButton";
import firestore from "@react-native-firebase/firestore";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Page() {
  const addOrder = () => {
    firestore()
      .collection("orders")
      .add({
        productName: "Product 1",
        quantity: 1,
        price: 100,
      })
      .then((res) => {
        console.log("res", res);
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const getOrders = () => {
    firestore()
      .collection("orders")
      .get()
      .then((res) => {
        console.log(
          "res",
          res.docs.map((doc) => doc.data().price)
        );
      })
      .catch((err) => {
        console.log("err", err);
      })
      .finally(() => {
        console.log("finally");
      });
  };

  return (
    <SafeAreaView className="bg-general-500 flex-1 items-center justify-center">
      <Text>home</Text>
      <CustomButton title="Add Order" onPress={addOrder} />
      <CustomButton title="Get Orders" onPress={getOrders} className="mt-4" />
    </SafeAreaView>
  );
}
