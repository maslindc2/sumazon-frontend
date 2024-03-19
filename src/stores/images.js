/**
 * This is the image store that we use for storing all product images.
 */
import axios from "axios";
import { defineStore } from "pinia";

// Definining the Pinia store called images
export const useImageStore = defineStore("images", {
    // Define the inital state
    state: () => ({
        // Set the key for the useStorage and the default value an empty array
        images: []
    }),
    getters: {
        // Used for getting the image array from Pinia
        getImages() {
            return this.images;
        },
    },
    actions: {
        saveImageState(){
            localStorage.setItem(
                "images", 
                JSON.stringify({
                    images: this.images
                })
            );
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
        async resetImageState() {
            this.images = [];
            this.saveImageState();
        }
    },
});
