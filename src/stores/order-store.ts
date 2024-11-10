// src/stores/order-store.ts
import { defineStore } from 'pinia';
import axios from 'axios';
import { Order, OrderItem } from 'src/interfaces/basic';
import { API_BE } from './constanta';

export const useOrderStore = defineStore('orderStore', {
  state: () => ({
    orders: [] as Order[],
  }),
  getters: {
    getOrders(): Order[] {
      return this.orders;
    },
  },
  actions: {
    async fetchOrders() {
      try {
        const response = await axios.get(`${API_BE}/orders`);
        this.orders = response.data;
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      }
    },
    async fetchItemsByOrderId(orderId: number): Promise<OrderItem[] | null> {
      try {
        const response = await axios.get(`${API_BE}/orders/${orderId}/items`);
        return response.data;
      } catch (error) {
        console.error(`Failed to fetch items for order ${orderId}:`, error);
        return null;
      }
    },

    async fetchOrderById(orderId: number) {
      try {
        const response = await axios.get(`${API_BE}/orders/${orderId}`);
        return response.data;
      } catch (error) {
        console.error(`Failed to fetch order with ID ${orderId}:`, error);
      }
    },

    async saveOrder(order: Order) {
      try {
        const response = await axios.post(`${API_BE}/orders`, order);
        order.id = response.data.id;
        this.orders.push(order);
      } catch (error) {
        console.error('Failed to save order:', error);
      }
    },

    async updateOrder(order: Order) {
      if (!order.id) throw new Error('Order must have an ID to update');

      try {
        await axios.put(`${API_BE}/orders/${order.id}`, order);
        const index = this.orders.findIndex((o) => o.id === order.id);
        if (index !== -1) this.orders[index] = order;
      } catch (error) {
        console.error('Failed to update order:', error);
      }
    },

    async deleteOrder(orderId: number) {
      try {
        await axios.delete(`${API_BE}/orders/${orderId}`);
        this.orders = this.orders.filter((order) => order.id !== orderId);
      } catch (error) {
        console.error('Failed to delete order:', error);
      }
    },
  },
});
