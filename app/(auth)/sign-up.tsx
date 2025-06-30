import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import OAuth from "@/components/OAuth";
import { icons, images } from "@/constants";
import {
  createUserWithEmailAndPassword,
  getAuth,
} from "@react-native-firebase/auth";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";
import { ReactNativeModal } from "react-native-modal";

const SignUp = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [verification, setVerification] = useState({
    state: "default",
    error: "",
    code: "",
  });
  const onSignUpPress = async () => {
    try {
      await createUserWithEmailAndPassword(
        getAuth(),
        form.email,
        form.password
      );
      setVerification({
        ...verification,
        state: "success",
        error: "",
      });
    } catch (err: any) {
      if (err.code === "auth/email-already-in-use") {
        setVerification({
          ...verification,
          state: "failed",
          error: "That email address is already in use!",
        });
      }

      if (err.code === "auth/invalid-email") {
        setVerification({
          ...verification,
          state: "failed",
          error: "That email address is invalid!",
        });
      }
      if (err.code === "auth/weak-password") {
        setVerification({
          ...verification,
          state: "failed",
          error: "That password is too weak!",
        });
      }
      if (err.code === "auth/invalid-credential") {
        setVerification({
          ...verification,
          state: "failed",
          error: "Invalid credentials!",
        });
      }
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        <View className="relative w-full h-[250px]">
          <Image source={images.signUpCar} className="z-0 w-full h-[250px]" />
          <Text className="text-2xl text-black font-JakartaSemiBold absolute bottom-5 left-5">
            Create Your Account{" "}
          </Text>
        </View>
        <View className="p-5">
          <InputField
            label="Name"
            placeholder="Enter your name"
            value={form.name}
            onChangeText={(value) => setForm({ ...form, name: value })}
            icon={icons.person}
          />
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
          {verification.error && (
            <Text className="text-red-500 mt-2 text-sm">
              {verification.error}
            </Text>
          )}
          <CustomButton
            title="Sign Up"
            onPress={onSignUpPress}
            className="mt-6"
          />
          <OAuth />
          <Link
            href="/sign-in"
            className="text-lg text-center mt-10 text-general-200"
          >
            <Text>Already Have an account? </Text>
            <Text className="text-primary-500">Log In</Text>
          </Link>
        </View>
        <ReactNativeModal isVisible={verification.state === "success"}>
          <View className="bg-white py-9 px-7 rounded-2xl min-h-[300px]">
            <Image
              source={images.check}
              className="w-[110px] h-[110px] mx-auto my-5"
            />
            <Text className="text-3xl font-JakartaBold text-center">
              Verified
            </Text>
            <Text className="text-base text-gray-400 font-Jakarta text-center">
              You have successfully verified your account.
            </Text>
            <CustomButton
              title="Browser Home"
              onPress={() => {
                setVerification({
                  ...verification,
                  state: "default",
                  error: "",
                });
                router.push("/(root)/(tabs)/home");
              }}
              className="mt-5"
            />
          </View>
        </ReactNativeModal>
      </View>
    </ScrollView>
  );
};

export default SignUp;
