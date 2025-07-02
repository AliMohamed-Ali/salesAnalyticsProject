import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import OAuth from "@/components/OAuth";
import { icons, images } from "@/constants";
import {
  getAuth,
  signInWithEmailAndPassword,
} from "@react-native-firebase/auth";
import { Link, router } from "expo-router";
import { useCallback, useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";
const SignIn = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const onSignInPress = useCallback(async () => {
    try {
      await signInWithEmailAndPassword(getAuth(), form.email, form.password);
      router.push("/(root)/(tabs)/home");
      setError("");
    } catch (err: any) {
      setError(err.message);
    }
  }, [form]);

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        <View className="relative w-full h-[250px]">
          <Image source={images.signUpImage} className="z-0 w-full h-[250px]" />
          <Text className="text-2xl text-white font-JakartaSemiBold absolute bottom-5 left-5">
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
          {error && <Text className="text-red-500 mt-2 text-sm">{error}</Text>}
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
  );
};

export default SignIn;
