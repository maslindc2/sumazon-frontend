<script>
/**
 * This page is used for an indiviudal product page.
 * At the bottom of the page is the related products section.
 */
import router from "@/router";
import { computed } from "vue";
import { useShoppingCartStore } from "@/stores/shoppingCart";
import { useImageStore } from "@/stores/images";
import { findImageInProductImages } from "@/util/FindProductImage";

export default {
    props: {
        product: Object,
    },
    // Define the local instance of the image store
    setup() {
        const shoppingCart = useShoppingCartStore();
        const imageStore = useImageStore();
        return {
            // Get the current state of the shopping cart once it's defined
            shoppingCart: computed(() => shoppingCart.getShoppingCart),
            // Get the current state of the product images once it's defined
            productImages: computed(() => imageStore.getImages),
        };
    },
    data() {
        return {
            // Used for selecting the amount to buy
            // Always going to be at least 1.  If it hits zero the client hides the product
            productQuantity: 1,
            productImage: "",
            showAddedToCartMessage: false,
            showProductNotFoundMessage: false,
        };
    },
    mounted() {
        this.findImageInProductImages(this.$route.params.id);
        if (this.product.name === undefined) {
            this.showProductNotFoundMessage = true;
        }
    },
    methods: {
        addToCart() {
            if (this.productQuantity !== 0) {
                // Define the local instance of the shopping cart store
                const shoppingCart = useShoppingCartStore();
                // Create the product info object used for the shopping cart later
                const productInfo = {
                    name: this.product.name,
                    productID: this.$route.params.id,
                    price: this.product.price,
                    quantity_purchased: this.productQuantity,
                };
                // Add the product to the cart
                shoppingCart.addProductToCart(productInfo);
                // Go to the shopping cart page as we just added an item
                router.push("/shopping-cart");
            }
        },
        // Finds the product image for the associated product id
        findImageInProductImages(productID) {
            this.productImage = findImageInProductImages(productID, this.productImages);
        },
    },
    watch: {
        "$route.params.id"(productID) {
            this.findImageInProductImages(productID, this.productImages);
        },
    },
};
</script>
<template>
    <div>
        <div class="pt-6">
            <div class="mx-auto mt-6 max-w-lg sm:p-6">
                <div class="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg lg:block">
                    <img
                        :src="productImage"
                        alt=""
                        class="lg:w-75 h-full w-full object-contain lg:h-full"
                    />
                </div>
            </div>
            <div class="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6">
                <div class="mt-6 lg:row-span-3 lg:mt-0">
                    <h1 class="text-2xl font-bold tracking-tight text-gray-900">
                        {{ product.name }}
                    </h1>
                    <p class="text-xl tracking-tight text-gray-900">${{ product.price }}</p>
                    <h2 class="text-sm font-medium text-gray-900">Quantity</h2>
                    <select v-model="productQuantity" class="rounded-md">
                        <option
                            v-for="i in product.quantity"
                            :key="i"
                            :selected="i === '1' ? true : false"
                            :value="i"
                        >
                            {{ i }}
                        </option>
                    </select>
                    <button
                        @click="addToCart"
                        class="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Add To Cart
                    </button>
                </div>
                <div
                    class="py-10 lg:col-span-2 lg:col-start-1 lg:border-gray-200 lg:pb-16 lg:pr-8 lg:pt-6"
                >
                    <div>
                        <h3 class="sm:text-1l text-2xl font-bold tracking-tight text-gray-900">
                            Description
                        </h3>
                        <div>
                            <p class="text-base text-gray-900">{{ product.description }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
