// src/stores/itemStore.js
import { defineStore } from 'pinia';
import axios from 'axios';
import { Item, Category } from 'src/interfaces/basic';

export const useItemStore = defineStore('itemStore', {
  state: () => ({
    items: [] as Item[],
    categories: [] as Category[],
  }),
  actions: {
    async fetchItems() {
      try {
        const response = await axios.get('/items');
        this.items = response.data;
      } catch (error) {
        console.error('Failed to fetch items:', error);
      }
    },

    async fetchItemById(itemId: string) {
      try {
        const response = await axios.get(`/items/${itemId}`);
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

        const response = await axios.post('/items', formData, {
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

        await axios.put(`/items/${item.id}`, formData, {
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
        await axios.delete(`/items/${itemId}`);
        this.items = this.items.filter((item) => item.id !== itemId);
      } catch (error) {
        console.error('Failed to delete item:', error);
      }
    },

    async fetchCategories() {
      try {
        const response = await axios.get('/categories');
        this.categories = response.data;
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    },

    async saveCategory(category: Category) {
      try {
        const response = await axios.post('/categories', category);
        this.categories.push({ ...category, id: response.data.id });
      } catch (error) {
        console.error('Failed to save category:', error);
      }
    },

    async deleteCategory(categoryId: number) {
      try {
        await axios.delete(`/categories/${categoryId}`);
        this.categories = this.categories.filter(
          (category) => category.id !== categoryId
        );
      } catch (error) {
        console.error('Failed to delete category:', error);
      }
    },

    async updateCategory(category: Category) {
      try {
        await axios.put(`/categories/${category.id}`, category);
        const index = this.categories.findIndex((c) => c.id === category.id);
        if (index !== -1) this.categories[index] = category;
      } catch (error) {
        console.error('Failed to update category:', error);
      }
    },
  },
});
