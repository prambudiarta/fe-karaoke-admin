// src/stores/deviceStore.js

import { defineStore } from 'pinia';
import axios from 'axios';
import { Printer, Room } from 'src/interfaces/basic';
import { API_BE } from './constanta';

export const useDeviceStore = defineStore('deviceStore', {
  state: () => ({
    rooms: [] as Room[],
    printers: [] as Printer[],
  }),
  getters: {
    // Additional computed properties can be added here
  },
  actions: {
    // Fetch all rooms from the backend
    async fetchRooms() {
      try {
        const response = await axios.get(`${API_BE}/rooms`);
        this.rooms = response.data;
      } catch (error) {
        console.error('Failed to fetch rooms:', error);
      }
    },

    // Fetch room by ID
    async fetchRoomById(id: number) {
      try {
        const response = await axios.get(`${API_BE}/rooms/${id}`);
        return response.data;
      } catch (error) {
        console.error(`Failed to fetch room with ID ${id}:`, error);
      }
    },

    // Save a new room to the backend
    async saveRoom(room: Room) {
      try {
        const response = await axios.post(`${API_BE}/rooms`, room);
        room.id = response.data.id;
        this.rooms.push(room);
      } catch (error) {
        console.error('Failed to save room:', error);
      }
    },

    // Update an existing room
    async updateRoom(room: Room) {
      if (!room.id) throw new Error('Room must have an ID to update');

      try {
        await axios.put(`${API_BE}/rooms/${room.id}`, room);
        const index = this.rooms.findIndex((r) => r.id === room.id);
        if (index !== -1) this.rooms[index] = room;
      } catch (error) {
        console.error('Failed to update room:', error);
      }
    },

    // Delete a room by ID
    async deleteRoom(id: number) {
      try {
        await axios.delete(`${API_BE}/rooms/${id}`);
        this.rooms = this.rooms.filter((room) => room.id !== id);
      } catch (error) {
        console.error('Failed to delete room:', error);
      }
    },

    // Fetch all printers from the backend
    async fetchPrinters() {
      try {
        const response = await axios.get(`${API_BE}/printers`);
        this.printers = response.data;
      } catch (error) {
        console.error('Failed to fetch printers:', error);
      }
    },

    // Fetch printer by ID
    async fetchPrinterById(id: number) {
      try {
        const response = await axios.get(`${API_BE}/printers/${id}`);
        return response.data;
      } catch (error) {
        console.error(`Failed to fetch printer with ID ${id}:`, error);
      }
    },

    // Save a new printer to the backend
    async savePrinter(printer: Printer) {
      try {
        console.log(printer);
        const response = await axios.post(`${API_BE}/printers`, printer);
        printer.id = response.data.id;
        this.printers.push(printer);
      } catch (error) {
        console.error('Failed to save printer:', error);
      }
    },

    // Update an existing printer
    async updatePrinter(printer: Printer) {
      if (!printer.id) throw new Error('Printer must have an ID to update');

      try {
        await axios.put(`${API_BE}/printers/${printer.id}`, printer);
        const index = this.printers.findIndex((p) => p.id === printer.id);
        if (index !== -1) this.printers[index] = printer;
      } catch (error) {
        console.error('Failed to update printer:', error);
      }
    },

    // Delete a printer by ID
    async deletePrinter(id: number) {
      try {
        await axios.delete(`${API_BE}/printers/${id}`);
        this.printers = this.printers.filter((printer) => printer.id !== id);
      } catch (error) {
        console.error('Failed to delete printer:', error);
      }
    },
  },
});
