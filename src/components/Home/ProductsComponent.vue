<script>
/**
 * This component is used for each individual product on the homepage.
 * This displays the Name, Image, and price of the product on the homepage.
 */
import { useImageStore } from "@/stores/images";
import { findImageInProductImages } from "../../util/FindProductImage";
export default {
    props: {
        productInventory: Array,
    },
    data() {
        return {
            // Store the product images here
            productImages: [],
        };
    },
    // Before the page is loaded
    async beforeMount() {
        // Define the local instance of image store
        const imageStore = useImageStore();
        // get the images from the image store
        this.productImages = imageStore.getImages;
    },
    methods: {
        // This function is used to find a product's image in our image cache. Uses the utility FindProductImage in src/util
        findImage(productID) {
            return findImageInProductImages(productID, this.productImages);
        },
    },
    computed: {
        filteredInventory() {
            // Here we are filtering out the productInventory with products that have an inventory quantity of 0
            return this.productInventory.filter((product) => product.item_quantity !== 0);
        },
    },
};
</script>
<template>
    <div>
        <div class="mx-auto px-4 lg:max-w-7xl lg:px-8">
            <div
                class="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8"
            >
                <div
                    v-for="(product, index) in filteredInventory"
                    :key="index"
                    class="group relative rounded-lg bg-white p-6 shadow-md"
                >
                    <div>
                        <div
                            class="lg:h-75 aspect-h-1 aspect-w-1 flex w-full justify-center overflow-hidden rounded-md lg:aspect-none group-hover:opacity-75"
                        >
                            <img
                                :src="findImage(product._id)"
                                alt=""
                                class="lg:w-75 h-full w-full object-contain lg:h-full"
                            />
                        </div>
                        <div class="mt-4 flex justify-between">
                            <div>
                                <h3 class="text-m text-gray-700">
                                    <RouterLink
                                        :to="{ name: 'product', params: { id: product._id } }"
                                    >
                                        <span aria-hidden="true" class="absolute inset-0" />
                                        {{ product.name }}
                                    </RouterLink>
                                </h3>
                            </div>
                            <p class="text-m font-semibold text-gray-900">${{ product.price }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
