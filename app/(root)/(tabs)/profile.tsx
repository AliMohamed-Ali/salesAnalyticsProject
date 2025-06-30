import CustomButton from "@/components/CustomButton";
import { icons } from "@/constants";
import { getAuth, signOut } from "@react-native-firebase/auth";
import { router } from "expo-router";
import React from "react";
import { Alert, Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Profile = () => {
  const handleLogout = async () => {
    try {
      await signOut(getAuth());
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
        <View className="items-center mb-12">
          <View className="w-30 h-30 rounded-full bg-gray-100 justify-center items-center border-3 border-gray-200">
            <Image
              source={icons.person}
              className="w-20 h-20"
              style={{ tintColor: "#666" }}
            />
          </View>
        </View>
        <CustomButton
          title="Logout"
          onPress={handleLogout}
          bgVariant="danger"
          textVariant="default"
          className="w-[200px]"
          IconLeft={() => (
            <Image
              source={icons.out}
              className="w-5 h-5 mr-2"
              style={{ tintColor: "#fff" }}
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default Profile;
