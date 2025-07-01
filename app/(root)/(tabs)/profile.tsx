import CustomButton from "@/components/CustomButton";
import { useAuth } from "@/contexts/AuthContext";
import firestore from "@react-native-firebase/firestore";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Profile = () => {
  const { user, signOut } = useAuth();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (user) {
          const doc = await firestore().collection("users").doc(user.uid).get();
          if (doc.exists()) {
            setUserName(doc.data()?.name || "");
          }
        }
      } catch (error) {
        setUserName("");
      }
    };
    fetchUser();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut();
      router.replace("/(auth)/sign-in");
    } catch (error) {
      Alert.alert("Error", "Failed to logout. Please try again.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 p-5 items-center">
        <Text className="text-2xl font-bold mb-8 text-gray-800">
          Your Profile
        </Text>
        <View className="items-center mb-6">
          <View className="w-30 h-30 rounded-full bg-gray-100 justify-center items-center border-3 border-gray-200">
            <Text className="text-4xl text-gray-400 font-bold">
              {userName ? userName[0].toUpperCase() : "?"}
            </Text>
          </View>
          <Text className="text-lg font-semibold mt-4 text-gray-700">
            {userName || "User"}
          </Text>
          {user && (
            <Text className="text-sm text-gray-500 mt-2">{user.email}</Text>
          )}
        </View>
        <CustomButton
          title="Logout"
          onPress={handleLogout}
          bgVariant="danger"
          textVariant="default"
          className="w-[200px]"
        />
      </View>
    </SafeAreaView>
  );
};

export default Profile;
