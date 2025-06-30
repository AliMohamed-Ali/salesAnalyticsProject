import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import OAuth from "@/components/OAuth";
import { icons, images } from "@/constants";
import { Link, router } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const SignIn = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const onSignInPress = useCallback(async () => {
    try {
      console.log("form", form);
      if (form.email && form.password) {
        router.push("/(root)/(tabs)/home");
      } else {
        Alert.alert("Error occured");
      }
    } catch (err: any) {
      Alert.alert("Error occured", err.errors[0].longMessage);
    }
  }, [form]);

  return (
    <SafeAreaView className="flex bg-white">
      <ScrollView className=" bg-white">
        <View className="flex-1 bg-white">
          <View className="relative w-full h-[250px]">
            <Image source={images.signUpCar} className="z-0 w-full h-[250px]" />
            <Text className="text-2xl text-black font-JakartaSemiBold absolute bottom-5 left-5">
              Welcome 👋
            </Text>
          </View>
          <View className="p-5">
            <InputField
              label="Email"
              placeholder="Enter your email"
              value={form.email}
              onChangeText={(value) => setForm({ ...form, email: value })}
              icon={icons.email}
              autoCapitalize="none"
            />
            <InputField
              label="Password"
              placeholder="Enter your password"
              value={form.password}
              secureTextEntry={true}
              onChangeText={(value) => setForm({ ...form, password: value })}
              icon={icons.lock}
            />
            <CustomButton
              title="Log In"
              onPress={onSignInPress}
              className="mt-6"
            />
            <OAuth />
            <Link
              href="/sign-up"
              className="text-lg text-center mt-10 text-general-200"
            >
              <Text>Don&apos;t have an account? </Text>
              <Text className="text-primary-500">Sign Up</Text>
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
