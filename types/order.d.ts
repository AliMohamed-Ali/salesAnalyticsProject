export interface Order {
  id: string;
  productName: string;
  quantity: string;
  price: string;
  timestamp: {
    seconds: number;
    nanoseconds: number;
  };
}

export interface OrderFormData {
  productName: string;
  quantity: string;
  price: string;
}

export interface AnalyticsData {
  totalRevenue: number;
  ordersLastHour: number;
  topProducts: [string, number][];
  revenueByDay: Record<string, number>;
  productsToPromote: string[];
  topRevenueProducts: [string, number][];
}

export interface ProductAnalytics {
  name: string;
  salesCount: number;
  totalRevenue: number;
  lastSold?: Date | null;
}
