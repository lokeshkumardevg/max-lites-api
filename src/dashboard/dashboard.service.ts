import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/interface/user.interface';
import { Order } from '../order/order.schema/order.schema';
import { Product } from './schema/dashboard.schema';
import CustomResponse from 'src/common/providers/custom-response.service';
import CustomError from 'src/common/providers/customer-error.service';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    @InjectModel('Order') private orderModel: Model<Order>,
    @InjectModel('Product') private productModel: Model<Product>,
  ) {}

  async getDashboardStats() {
    try {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      // 🔹 TOTAL PRODUCTS
      const totalProducts = await this.productModel.countDocuments();

      // 🔹 LOW STOCK ALERTS (stock < 10)
      const lowStockAlerts = await this.productModel.countDocuments({
        stock: { $lt: 10 },
      });

      // 🔹 TOTAL CUSTOMERS
      const totalCustomers = await this.userModel.countDocuments();

      // 🔹 TOTAL ORDERS
      const totalOrders = await this.orderModel.countDocuments();

      // 🔹 ORDER STATUS COUNTS
      const pendingOrders = await this.orderModel.countDocuments({ status: 'pending' });
      const processingOrders = await this.orderModel.countDocuments({ status: 'processing' });
      const completedOrders = await this.orderModel.countDocuments({ status: 'delivered' });

      // 🔹 TODAY'S SALES
      const todayOrders = await this.orderModel.find({
        createdAt: { $gte: startOfDay, $lte: endOfDay },
      });

      const todaysSales = todayOrders.reduce(
        (sum, order) => sum + (order.totalAmount || 0),
        0,
      );

      // 🔹 RECENT ORDERS (last 4 orders)
      const recentOrders = await this.orderModel
        .find()
        .sort({ createdAt: -1 })
        .limit(4)
        .select('orderNumber totalAmount status createdAt');

      // 🔹 FINAL RESPONSE
      const dashboardData = {
        totalProducts,
        totalOrders,
        todaysSales,
        lowStockAlerts,
        pendingOrders,
        processingOrders,
        completedOrders,
        totalCustomers,
        recentOrders,
      };

      return new CustomResponse(200, 'Dashboard stats loaded successfully', dashboardData);
    } catch (error) {
      throw new CustomError(500, error.message || 'Failed to load dashboard stats');
    }
  }
}
