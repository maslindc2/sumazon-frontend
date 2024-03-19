<script>
/**
 * This is the Home view consists of the Website title and the products component
 */
import ProductsComponent from "@/components/Home/ProductsComponent.vue";
import SearchComponent from "@/components/Home/SearchComponent.vue";
import axios from "axios";
import { useImageStore } from "@/stores/images";
export default {
    // Products to display on the home view are stored here
    data() {
        return {
            fetchedProducts: [],
            isRateLimited: false,
        };
    },
    // Before the HomeView is created/rendered fetch the images and products from the server or cache
    async beforeCreate() {
        // Fetch the products from the server
        axios
            .get("/api/homepage-products")
            .then((res) => {
                this.fetchedProducts = res.data;
            })
            .catch((error) => {
                if (error.response.status === 429) {
                    this.isRateLimited = true;
                } else {
                    console.error(error);
                }
            });
    },
    components: { ProductsComponent, SearchComponent },
};
</script>

<template>
    <main class="bg-gray-100">
        <!--The below is the search component used for searching the products in the store's inventory-->
        <SearchComponent :productInventory="fetchedProducts" />
        <!--The below is used for displaying all items in the store's inventory-->
        <ProductsComponent :productInventory="fetchedProducts" />
        <!--Rate limit error is displayed when the client sends too many requests to the server-->
        <div
            v-if="isRateLimited"
            class="flex w-full justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-bold leading-6 text-white shadow-sm"
        >
            <h1 v-if="isRateLimited">Slow down there budy...You've been rate limited!</h1>
        </div>
    </main>
</template>
