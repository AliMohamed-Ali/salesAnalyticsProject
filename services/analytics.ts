import { AnalyticsData, Order, ProductAnalytics } from "@/types/order";

export class AnalyticsService {
  static calculateAnalytics(orders: Order[]): AnalyticsData {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Total Revenue
    const totalRevenue = orders.reduce(
      (sum, order) => sum + Number(order.price),
      0
    );

    // Orders in the last hour
    const ordersLastHour = orders.filter((order) => {
      const orderDate = order.timestamp?.seconds
        ? new Date(order.timestamp.seconds * 1000)
        : null;
      return orderDate && orderDate >= oneHourAgo;
    }).length;

    // Top-selling products
    const productCounts: Record<string, number> = {};
    orders.forEach((order) => {
      if (order.productName in productCounts) {
        productCounts[order.productName] += 1;
      } else {
        productCounts[order.productName] = 1;
      }
    });
    const topProducts = Object.entries(productCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    // Revenue by day for the last 7 days
    const days: string[] = [];
    const revenueByDay: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      days.push(key);
      revenueByDay[key] = 0;
    }
    orders.forEach((order) => {
      const orderDate = order.timestamp?.seconds
        ? new Date(order.timestamp.seconds * 1000)
        : null;
      if (orderDate) {
        const key = orderDate.toISOString().slice(0, 10);
        if (key in revenueByDay) {
          revenueByDay[key] += Number(order.price);
        }
      }
    });

    // Recommendation Engine
    const productsToPromote = this.getProductsToPromote(orders, sevenDaysAgo);
    const topRevenueProducts = this.getTopRevenueProducts(orders);

    return {
      totalRevenue,
      ordersLastHour,
      topProducts,
      revenueByDay,
      productsToPromote,
      topRevenueProducts,
    };
  }

  private static getProductsToPromote(
    orders: Order[],
    sevenDaysAgo: Date
  ): string[] {
    // Count sales in the last 7 days
    const salesLast7Days: Record<string, number> = {};
    orders.forEach((order) => {
      const orderDate = order.timestamp?.seconds
        ? new Date(order.timestamp.seconds * 1000)
        : null;
      if (orderDate && orderDate >= sevenDaysAgo) {
        if (order.productName in salesLast7Days) {
          salesLast7Days[order.productName] += 1;
        } else {
          salesLast7Days[order.productName] = 1;
        }
      }
    });

    // Return products with fewer than 5 sales in the last 7 days
    return Object.entries(salesLast7Days)
      .filter(([_, count]) => count < 5)
      .map(([name]) => name);
  }

  private static getTopRevenueProducts(orders: Order[]): [string, number][] {
    const revenueByProduct: Record<string, number> = {};
    orders.forEach((order) => {
      if (order.productName in revenueByProduct) {
        revenueByProduct[order.productName] += Number(order.price);
      } else {
        revenueByProduct[order.productName] = Number(order.price);
      }
    });

    return Object.entries(revenueByProduct)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
  }

  static getProductAnalytics(orders: Order[]): ProductAnalytics[] {
    const productMap: Record<string, ProductAnalytics> = {};

    orders.forEach((order) => {
      const orderDate = order.timestamp?.seconds
        ? new Date(order.timestamp.seconds * 1000)
        : null;

      if (!productMap[order.productName]) {
        productMap[order.productName] = {
          name: order.productName,
          salesCount: 0,
          totalRevenue: 0,
          lastSold: orderDate,
        };
      }

      productMap[order.productName].salesCount += 1;
      productMap[order.productName].totalRevenue += Number(order.price);

      if (
        orderDate &&
        (!productMap[order.productName].lastSold ||
          orderDate > productMap[order.productName].lastSold!)
      ) {
        productMap[order.productName].lastSold = orderDate;
      }
    });

    return Object.values(productMap).sort(
      (a, b) => b.totalRevenue - a.totalRevenue
    );
  }

  static getRecommendations(orders: Order[]): {
    productsToPromote: string[];
    topRevenueProducts: [string, number][];
    underperformingProducts: string[];
  } {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Products to promote (low sales in last 7 days)
    const productsToPromote = this.getProductsToPromote(orders, sevenDaysAgo);

    // Top revenue products
    const topRevenueProducts = this.getTopRevenueProducts(orders);

    // Underperforming products (no sales in last 30 days)
    const salesLast30Days: Record<string, number> = {};
    orders.forEach((order) => {
      const orderDate = order.timestamp?.seconds
        ? new Date(order.timestamp.seconds * 1000)
        : null;
      if (orderDate && orderDate >= thirtyDaysAgo) {
        if (order.productName in salesLast30Days) {
          salesLast30Days[order.productName] += 1;
        } else {
          salesLast30Days[order.productName] = 1;
        }
      }
    });

    // Get all unique products
    const allProducts = new Set(orders.map((order) => order.productName));
    const underperformingProducts = Array.from(allProducts).filter(
      (product) => !(product in salesLast30Days)
    );

    return {
      productsToPromote,
      topRevenueProducts,
      underperformingProducts,
    };
  }
}
