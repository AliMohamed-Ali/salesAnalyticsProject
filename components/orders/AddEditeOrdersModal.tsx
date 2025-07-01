import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import React, { useEffect, useState } from "react";
import { Modal, Text, View } from "react-native";

interface AddEditOrdersModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (order: {
    productName: string;
    quantity: string;
    price: string;
  }) => void;
  initialOrder?: {
    productName: string;
    quantity: string;
    price: string;
  } | null;
  mode?: "add" | "edit";
}

const AddEditOrdersModal = ({
  visible,
  onClose,
  onSubmit,
  initialOrder = null,
  mode = "add",
}: AddEditOrdersModalProps) => {
  const [form, setForm] = useState({
    productName: "",
    quantity: "",
    price: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialOrder) {
      setForm(initialOrder);
    } else {
      setForm({ productName: "", quantity: "", price: "" });
    }
  }, [initialOrder, visible]);

  const handleSubmit = () => {
    if (!form.productName || !form.quantity || !form.price) {
      setError("All fields are required.");
      return;
    }
    if (isNaN(Number(form.quantity)) || isNaN(Number(form.price))) {
      setError("Quantity and Price must be numbers.");
      return;
    }
    setError("");
    onSubmit(form);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 justify-center items-center bg-black/40">
        <View className="bg-white p-6 rounded-xl w-11/12 max-w-md">
          <Text className="text-xl font-bold mb-4">
            {mode === "add" ? "Add Order" : "Edit Order"}
          </Text>
          {error ? <Text className="text-red-500 mb-2">{error}</Text> : null}
          <InputField
            label="Product Name"
            placeholder="Product Name"
            value={form.productName}
            onChangeText={(value) => setForm({ ...form, productName: value })}
          />
          <InputField
            label="Quantity"
            placeholder="Quantity"
            keyboardType="numeric"
            value={form.quantity}
            onChangeText={(value) => setForm({ ...form, quantity: value })}
          />
          <InputField
            label="Price"
            placeholder="Price"
            keyboardType="numeric"
            value={form.price}
            onChangeText={(value) => setForm({ ...form, price: value })}
          />
          <View className="gap-3">
            <CustomButton
              title={mode === "add" ? "Add" : "Save"}
              onPress={handleSubmit}
            />
            <CustomButton
              title="Cancel"
              onPress={onClose}
              bgVariant="outline"
              textVariant="primary"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddEditOrdersModal;
