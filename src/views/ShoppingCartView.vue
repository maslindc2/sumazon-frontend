<script>
import router from "@/router";

// Import the authentication store for getting authentication status
import { useAuthStore } from "@/stores/auth";

// Import the shopping cart store for performing shopping cart actions
import { useShoppingCartStore } from "@/stores/shoppingCart";
// Import the image store for displaying product images in the shopping cart
import { useImageStore } from "@/stores/images";
// Import computed for getting images when the imageStore is defined
import { computed } from "vue";
// import function for finding images in the product images cache
import { findImageInProductImages } from "@/util/FindProductImage";
// Import routerlink used for creating links for each product in the cart
import { RouterLink } from "vue-router";

export default {
    setup() {
        // Define the local instance of ShoppingCart Store
        const shoppingCart = useShoppingCartStore();
        // Define the local instance of the ImageStore
        const imageStore = useImageStore();
        // Return the local instance of authStore
        return {
            shoppingCart,
            productImages: computed(() => imageStore.getImages),
        };
    },
    // Define the inital values for all the variables we use
    data() {
        return {
            subtotal: 0,
            totalQuantity: 0,
            showThankYouMessage: false,
            showAuthenticateUserMessge: false,
            showFailedToPurchaseItemsMessage: false,
            showNoItemsInCart: false,
        };
    },
    // When the page is mounted i.e. Vue is rendering this page
    mounted() {
        // Update the total quantity using the shopping cart store
        this.updateSubTotalAndQuantity();
    },
    methods: {
        // Responsible for submitting the customers order to the server
        async checkout() {
            // Define the local instance of authStore
            const authStore = useAuthStore();

            // Check first if the user is authenticated, if they are then we can submit the order
            if (authStore.isAuthenticated) {
                // Check that the total quantity does not equal 0 to prevent users from checking out with an empty cart
                if (this.totalQuantity !== 0) {
                    // Call the purchase items function in the shopping cart store with the subtotal passed to it
                    // wait for the isSuccessfulPurchase promise, this is a boolean we use to show either a thank you message or item unavailable
                    await this.shoppingCart
                        .purchaseItems(this.subtotal)
                        .then(() => {
                            // Reset the subtotal
                            this.subtotal = 0;
                            // Reset total quantity
                            this.totalQuantity = 0;
                            // Show thank you message
                            this.showThankYouMessage = true;
                        })
                        .catch(() => {
                            // Failed to purchase items, show the failed to purchase items messages
                            // This handles the case when someone purchases the last item
                            this.showFailedToPurchaseItemsMessage = true;
                        });
                } else {
                    // Show no items in cart error
                    this.showNoItemsInCart = true;
                }
                // If the user is not authenticated display the authentication required message
            } else {
                this.showAuthenticateUserMessge = true;
            }
        },
        // Removes an item from the shopping cart store and updates the sub total and quantity to reflect this
        removeFromCart(productID) {
            this.shoppingCart.removeProductFromCart(productID);
            this.updateSubTotalAndQuantity();
        },
        // Updates the subtotal and total quantity
        updateSubTotalAndQuantity() {
            let subtotal = 0;
            let totalQuantity = 0;
            const itemsInCart = this.shoppingCart.getShoppingCart;

            Object.keys(itemsInCart).forEach((key) => {
                // Add the result of multiplying the item price by the quantity purchased for each product in the cart
                subtotal += itemsInCart[key].price * itemsInCart[key].quantity_purchased;
                // Update the total quantity for each product in the cart
                totalQuantity += itemsInCart[key].quantity_purchased;
            });
            // Rounds the sub total amount to avoid very-very-long cents
            this.subtotal = Math.ceil(subtotal * 100) / 100;
            this.totalQuantity = totalQuantity;
        },
        // Redirects the current user to the home page
        continueShoppingRedirect() {
            router.push("/");
        },
        // Finds the image for the associated product in our image store
        // Uses the utility function findImageInProductImages located in util
        findImage(productID) {
            return findImageInProductImages(productID, this.productImages);
        },
    },
    components: { RouterLink },
};
</script>
<template>
    <div class="h-screen bg-gray-100 pt-20">
        <h1 class="mb-10 text-center text-2xl font-bold">Shopping Cart</h1>
        <div class="m-10 md:mx-auto md:w-full md:max-w-md">
            <div v-if="showThankYouMessage" class="flex w-full justify-center text-xl font-bold">
                <h1 class="text-center">Thank you for your purchase!</h1>
            </div>
            <div
                v-if="showAuthenticateUserMessge"
                class="flex w-full justify-center rounded-md bg-red-600 py-2.5 text-xl font-bold leading-6 text-white shadow-sm"
            >
                <h1 class="text-center">Please login in first before making purchase!</h1>
            </div>
            <div
                v-if="showFailedToPurchaseItemsMessage"
                class="flex w-full justify-center rounded-md bg-red-600 py-2.5 text-xl font-bold text-white shadow-sm"
            >
                <h1 class="text-center">One or more items are no longer available!</h1>
            </div>
            <div
                v-if="showNoItemsInCart"
                class="flex w-full justify-center rounded-md bg-red-600 py-2.5 text-xl font-bold text-white shadow-sm"
            >
                <h1 class="text-center">No Items In Cart!</h1>
            </div>
        </div>
        <div class="mx-auto max-w-5xl justify-center px-6 md:flex md:space-x-6 xl:px-0">
            <div class="rounded-lg md:w-2/3">
                <div
                    class="mb-6 justify-between rounded-lg bg-white p-6 shadow-md sm:flex sm:justify-start"
                    v-for="(product, index) in shoppingCart.getShoppingCart"
                    :key="index"
                >
                    <img :src="findImage(product.productID)" class="w-full rounded-lg sm:w-40" />
                    <div class="sm:ml-4 sm:flex sm:w-full sm:justify-between">
                        <div class="mt-5 sm:mt-0">
                            <RouterLink
                                :to="{ name: 'product', params: { id: product.productID } }"
                            >
                                <h2 class="text-lg font-bold text-gray-900">{{ product.name }}</h2>
                            </RouterLink>
                            <p class="text-medium mt-1 text-gray-700">
                                Quantity: {{ product.quantity_purchased }}
                            </p>
                        </div>
                        <div
                            class="mt-4 flex justify-between sm:mt-0 sm:block sm:space-x-6 sm:space-y-6"
                        >
                            <div class="flex items-center space-x-4">
                                <p class="text-medium">${{ product.price }}</p>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="1.5"
                                    stroke="currentColor"
                                    class="h-5 w-5 cursor-pointer duration-150 hover:text-red-500"
                                    @click="removeFromCart(product.productID)"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="mt-6 h-full rounded-lg border bg-white p-6 shadow-md md:mt-0 md:w-1/3">
                <div class="flex justify-between">
                    <p class="text-lg font-bold">Subtotal ({{ totalQuantity }} items):</p>
                    <div class="">
                        <p class="mb-1 text-lg font-bold">${{ subtotal }}</p>
                    </div>
                </div>
                <button
                    class="mt-6 w-full rounded-md bg-blue-500 py-1.5 font-medium text-blue-50 hover:bg-blue-600"
                    @click="checkout"
                >
                    Pay Now
                </button>
                <button
                    class="mt-6 w-full py-1.5 font-medium hover:text-blue-600"
                    @click="continueShoppingRedirect"
                >
                    Continue Shopping
                </button>
            </div>
        </div>
    </div>
</template>
