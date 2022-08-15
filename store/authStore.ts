import create from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import { BASE_URL } from "../utils";

const authStore = (set: any) => ({
  userProfile: null,
  allUsers: [],
  allPosts: [],

  addUser: (user: any) => set({ userProfile: user }),

  removeUser: () => set({ userProfile: null }),

  fetchAllUsers: async () => {
    const response = await axios.get(`${BASE_URL}/api/users`);

    set({ allUsers: response.data });
  },
  fetchAllPosts: async (user: any) => {
    const { data } = await axios.get(`${BASE_URL}/api/profile/${user}`);

    set({ allPosts: data });
  },
});

const useAuthStore = create(
  persist(authStore, {
    name: "auth",
  })
);

export default useAuthStore;
