// src/stores/user.ts
import { defineStore } from 'pinia';
import { User } from 'src/interfaces/basic';
import { API_BE } from './constanta';
import axios from 'axios';
import qs from 'qs';

export const useUserStore = defineStore('user', {
  state: () => ({
    currentUser: {} as User,
  }),
  getters: {
    getUserId: (state) => state.currentUser?.id,
    getUsername: (state) => state.currentUser?.username,
    getUserRole: (state) => state.currentUser?.role,
    isAuthenticated: (state) => !!state.currentUser,
  },
  actions: {
    async login(username: string, password: string) {
      const loginUrl = `${API_BE}/users/login`;
      try {
        const data = qs.stringify({
          username: username,
          password: password,
        });

        console.log('data', data);

        const response = await axios.post(loginUrl, data, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });

        if (response.status !== 200) {
          throw new Error('Invalid username or password');
        }

        const loggedInUser = response.data;
        this.setUser(loggedInUser);
      } catch (error) {
        console.error('Failed to login:', error);
      }
    },
    setUser(user: User) {
      this.currentUser = user;
      localStorage.setItem('currentUser', JSON.stringify(user));
    },
    clearUser() {
      localStorage.removeItem('currentUser');
      this.currentUser = {} as User;
    },
    updateUserRole(role: 'user' | 'admin' | 'staff') {
      if (this.currentUser) {
        this.currentUser.role = role;
      }
    },
  },
});
