import { Order, OrderFormData } from "@/types/order";
import firestore from "@react-native-firebase/firestore";

export class FirebaseService {
  // Orders Collection
  static getOrdersRef() {
    return firestore().collection("Orders");
  }

  static async addOrder(orderData: OrderFormData): Promise<void> {
    try {
      await this.getOrdersRef().add({
        ...orderData,
        timestamp: firestore.FieldValue.serverTimestamp(),
      });
    } catch (error) {
      console.error("Error adding order:", error);
      throw error;
    }
  }

  static async updateOrder(
    orderId: string,
    orderData: OrderFormData
  ): Promise<void> {
    try {
      await this.getOrdersRef().doc(orderId).update(orderData);
    } catch (error) {
      console.error("Error updating order:", error);
      throw error;
    }
  }

  static async deleteOrder(orderId: string): Promise<void> {
    try {
      await this.getOrdersRef().doc(orderId).delete();
    } catch (error) {
      console.error("Error deleting order:", error);
      throw error;
    }
  }

  static subscribeToOrders(callback: (orders: Order[]) => void) {
    return this.getOrdersRef()
      .orderBy("timestamp", "desc")
      .onSnapshot(
        (querySnapshot) => {
          const orders: Order[] = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            orders.push({
              id: doc.id,
              productName: data.productName,
              quantity: data.quantity,
              price: data.price,
              timestamp: data.timestamp,
            });
          });
          callback(orders);
        },
        (error) => {
          console.error("Error listening to orders:", error);
        }
      );
  }

  // Analytics Collection (for caching calculated analytics)
  static getAnalyticsRef() {
    return firestore().collection("Analytics");
  }

  static async updateAnalytics(analyticsData: any): Promise<void> {
    try {
      await this.getAnalyticsRef()
        .doc("current")
        .set(analyticsData, { merge: true });
    } catch (error) {
      console.error("Error updating analytics:", error);
      throw error;
    }
  }

  static subscribeToAnalytics(callback: (analytics: any) => void) {
    return this.getAnalyticsRef()
      .doc("current")
      .onSnapshot(
        (doc) => {
          if (doc.exists()) {
            callback(doc.data());
          }
        },
        (error) => {
          console.error("Error listening to analytics:", error);
        }
      );
  }
}
