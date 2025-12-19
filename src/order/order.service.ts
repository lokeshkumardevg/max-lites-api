import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './order.schema/order.schema';
import { CreateOrderDto } from './dto/create-order-dto';
import { UpdateOrderDto } from './dto/update-order-dto';
import CustomResponse from 'src/common/providers/custom-response.service';
import CustomError from 'src/common/providers/customer-error.service';

@Injectable()
export class OrderService {
  constructor(@InjectModel('Order') private orderModel: Model<Order>) {}

  async createOrder(dto: CreateOrderDto) {
    try {
      const orderNumber = `ORD-${Date.now()}`;
      const userLocation = [
        Number(dto.userLongitude),
        Number(dto.userLatitude),
      ];

      const newOrder = new this.orderModel({
        orderNumber,
        userId: dto.userId,
        items: dto.items || [],
        subtotal: dto.subtotal || 0,
        shipping: dto.shipping || 10,
        tax: dto.tax || 0,
        totalAmount: dto.totalAmount || 0,
        paymentMethod: dto.paymentMethod || 'COD',
        paymentStatus: 'pending',
        shippingAddress: dto.shippingAddress,
        userLocation: { type: 'Point', coordinates: userLocation },
        status: 'pending',
      });

      const savedOrder = await newOrder.save();
      return new CustomResponse(201, 'Order created successfully', savedOrder);
    } catch (error) {
      throw new CustomError(500, error.message || 'Failed to create order');
    }
  }

  async getAllOrders() {
    const orders = await this.orderModel
      .find()
      .populate('userId', 'name email')
      .select(
        'orderNumber items totalAmount paymentMethod status createdAt paymentStatus',
      )
      .sort({ createdAt: -1 })
      .lean();

    const formattedOrders = orders.map((order: any) => ({
      _id: order._id,
      orderNumber: order.orderNumber,
      itemsCount: order.items?.length || 0,
      totalAmount: order.totalAmount,
      paymentMethod: order.paymentMethod,
      status: order.status,
      paymentStatus: order.paymentStatus,
      date: order.createdAt?.toISOString().split('T')[0],
    }));

    return new CustomResponse(
      200,
      'Orders fetched successfully',
      formattedOrders,
    );
  }

  async getOrderById(id: string) {
    const order = await this.orderModel
      .findById(id)
      .populate('userId', 'name email phone');

    if (!order) throw new CustomError(404, 'Order not found');

    return new CustomResponse(
      200,
      'Order details fetched successfully',
      order,
    );
  }

  async updateOrderById(id: string, dto: UpdateOrderDto) {
    const order = await this.orderModel.findById(id);
    if (!order) throw new CustomError(404, 'Order not found');

    if (dto.items) order.items = dto.items;
    if (dto.subtotal !== undefined) order.subtotal = dto.subtotal;
    if (dto.shipping !== undefined) order.shipping = dto.shipping;
    if (dto.tax !== undefined) order.tax = dto.tax;
    if (dto.totalAmount !== undefined) order.totalAmount = dto.totalAmount;
    if (dto.paymentMethod) order.paymentMethod = dto.paymentMethod;

    if (dto.shippingAddress) {
      order.shippingAddress = {
        ...order.shippingAddress,
        ...dto.shippingAddress,
      };
    }

    if (dto.userLongitude && dto.userLatitude) {
      order.userLocation = {
        type: 'Point',
        coordinates: [
          Number(dto.userLongitude),
          Number(dto.userLatitude),
        ],
      };
    }

    await order.save();

    const updatedOrder = await this.orderModel
      .findById(id)
      .populate('userId', 'name email phone')
      .lean();

    return new CustomResponse(
      200,
      'Order updated successfully',
      updatedOrder,
    );
  }

  async updateOrderStatusOrPayment(
    id: string,
    dto: { status?: string; paymentStatus?: string; trackingNumber?: string },
  ) {
    const order = await this.orderModel.findById(id);
    if (!order) throw new CustomError(404, 'Order not found');

    if (dto.status) order.status = dto.status;
    if (dto.paymentStatus) order.paymentStatus = dto.paymentStatus;
    if (dto.trackingNumber !== undefined)
      order.trackingNumber = dto.trackingNumber;

    await order.save();
    return new CustomResponse(200, 'Order updated successfully', order);
  }

  async getPaymentStatus(id: string) {
    const order = await this.orderModel.findById(id);
    if (!order) throw new CustomError(404, 'Order not found');

    return new CustomResponse(200, 'Payment status fetched', {
      orderId: order._id,
      paymentStatus: order.paymentStatus,
    });
  }

  async deleteOrder(id: string) {
    const result = await this.orderModel.findByIdAndDelete(id);
    if (!result) throw new CustomError(404, 'Order not found');

    return new CustomResponse(200, 'Order deleted successfully');
  }
}
