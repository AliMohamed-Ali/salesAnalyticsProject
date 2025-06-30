import { Ride } from "@/types/type";
import { Image, Text, View } from "react-native";

const RideCard = ({
  ride: {
    driver,
    ride_time,
    destination_address,
    origin_address,
    created_at,
    payment_status,
  },
}: {
  ride: Ride;
}) => {
  return (
    <View className="flex flex-row items-center justify-center bg-white rounded-lg shadow-sm shadow-neutral-300 mb-3">
        <View className="flex flex-row items-center justify-between p-3">
            <View className="flex flex-row items-center justify-between">
                <Image source={{
uri: `https://maps.geoapify.com/v1/staticmap?style=osm-bright-smooth&width=600&height=400&center=lonlat`
                }}
                />
                </View>
        </View>
      <Text className="text-3xl">{driver.first_name}</Text>
    </View>
  );
};
export default RideCard;
