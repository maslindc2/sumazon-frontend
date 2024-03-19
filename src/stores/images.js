/**
 * This is the image store that we use for storing all product images.
 */
import axios from "axios";
import { defineStore } from "pinia";

// Here we use vueuse/core's useStorage for persisting the pinia state for images.
// This works exactly like localStorage, I couldn't get images to persist with localStorage so we are using this.
// Same goes for the user store, I tried to use useStorage but it wouldn't persist user info ¯\_(ツ)_/¯
import { useStorage } from "@vueuse/core";

// Definining the Pinia store called images
export const useImageStore = defineStore("images", {
    // Define the inital state
    state: () => ({
        // Set the key for the useStorage and the default value an empty array
        images: useStorage("images", []),
    }),
    getters: {
        // Used for getting the image array from Pinia
        getImages() {
            return this.images;
        },
    },
    actions: {
        async $init() {
            await this.fetchImages();
        },
        // Fetch Images function gets called before the HomeView is created.
        async fetchImages() {
            await axios
                .get("/api/product-images")
                .then((res) => {
                    // Once we receive the images store it to the state
                    this.$state.images = res.data;
                })
                .catch((error) => {
                    console.error(error);
                });
        },
    },
});
