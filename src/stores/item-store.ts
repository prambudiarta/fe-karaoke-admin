// src/stores/itemStore.js
import { defineStore } from 'pinia';
import axios from 'axios';
import { Item, Category } from 'src/interfaces/basic';
import { API_BE } from './constanta';

export const useItemStore = defineStore('itemStore', {
  state: () => ({
    items: [] as Item[],
    categories: [] as Category[],
  }),
  actions: {
    async fetchItems() {
      try {
        const response = await axios.get(`${API_BE}/items`);
        this.items = response.data;
      } catch (error) {
        console.error('Failed to fetch items:', error);
      }
    },

    async fetchItemById(itemId: string) {
      try {
        const response = await axios.get(`${API_BE}/items/${itemId}`);
        return response.data;
      } catch (error) {
        console.error('Failed to fetch item:', error);
      }
    },

    async saveItem(item: Item, file = null) {
      try {
        const formData = new FormData();
        formData.append('name', item.name);
        formData.append('price', item.price.toString());
        formData.append('category', item.category_id.toString());

        if (file) formData.append('image', file);

        const response = await axios.post(`${API_BE}/items`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        this.items.push({ ...item, id: response.data.id });
      } catch (error) {
        console.error('Failed to save item:', error);
      }
    },

    async updateItem(item: Item, file = null) {
      try {
        const formData = new FormData();
        formData.append('name', item.name);
        formData.append('price', item.price.toString());
        formData.append('category_id', item.category_id.toString());

        if (file) formData.append('image', file);

        await axios.put(`${API_BE}/items/${item.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        const index = this.items.findIndex((i) => i.id === item.id);
        if (index !== -1) this.items[index] = item;
      } catch (error) {
        console.error('Failed to update item:', error);
      }
    },

    async deleteItem(itemId: number) {
      try {
        await axios.delete(`${API_BE}/items/${itemId}`);
        this.items = this.items.filter((item) => item.id !== itemId);
      } catch (error) {
        console.error('Failed to delete item:', error);
      }
    },

    async fetchCategories() {
      try {
        const response = await axios.get(`${API_BE}/categories`);
        this.categories = response.data;
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async saveCategory(formData: any) {
      try {
        const response = await axios.post(`${API_BE}/categories`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        this.categories.push({ ...formData, id: response.data.id });
      } catch (error) {
        console.error('Failed to save category:', error);
      }
    },

    async updateCategory(
      id: number,
      formData: any // eslint-disable-line @typescript-eslint/no-explicit-any
    ) {
      try {
        await axios.put(`${API_BE}/categories/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        const index = this.categories.findIndex((c) => c.id === id);
        if (index !== -1) {
          this.categories[index] = { ...this.categories[index], ...formData };
        }
      } catch (error) {
        console.error('Failed to update category:', error);
      }
    },

    async deleteCategory(categoryId: number) {
      try {
        await axios.delete(`${API_BE}/categories/${categoryId}`);
        this.categories = this.categories.filter(
          (category) => category.id !== categoryId
        );
      } catch (error) {
        console.error('Failed to delete category:', error);
      }
    },
  },
});
