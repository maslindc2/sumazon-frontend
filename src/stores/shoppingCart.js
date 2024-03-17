/**
 * This is the Shopping Cart store that we will use for storing items in the cart
 */
import axios from "axios";
import { defineStore } from "pinia";

// Store items in the cart for 12 hours
const CART_EXPIRATION = 12 * 60 * 60 * 1000;
// Here we are going to use localstorage to persist items when we refresh or leave the website
export const useShoppingCartStore = defineStore("shoppingCart", {
    state: () => ({
        shoppingCart: [],
        lastModified: null,
    }),
    getters: {
        getShoppingCart() {
            return this.shoppingCart;
        },
    },
    actions: {
        // On initialization this will call the loadCartState function to fetch items from local storage
        async $init() {
            await this.restoreCartState();
        },
        // Here we attempt to restore the shopping cart's state
        restoreCartState() {
            // Retreive the cart information from localStorage using the shoppingCart key
            const retrievedShoppingCart = JSON.parse(localStorage.getItem("shoppingCart"));
            // If the retrievedShoppingCart is defined
            if (retrievedShoppingCart !== null) {
                // Check the last modified date is within the alloted window for expiration
                if (Date.now() - retrievedShoppingCart.lastModified < CART_EXPIRATION) {
                    // Restore the shopping cart
                    this.shoppingCart = retrievedShoppingCart.shoppingCart;
                    // Update last modified with the modification time that was stored
                    this.lastModified = retrievedShoppingCart.lastModified;
                } else {
                    // If we are here, that means the cart has expired and we reset the cart to a default state
                    this.setDefaultCartState();
                }
            }
        },
        /**
         * This function is responsible for saving the cart's state to local storage.
         */
        saveCartState() {
            localStorage.setItem(
                "shoppingCart",
                JSON.stringify({
                    shoppingCart: this.shoppingCart,
                    lastModified: this.lastModified,
                })
            );
        },
        /**
         * Below function resets the shopping cart to a default state i.e. empty and saves the new state
         */
        setDefaultCartState() {
            this.shoppingCart = [];
            this.lastModified = null;
            // Save the cart state to localstorage
            this.saveCartState();
        },
        /**
         * Below is responsible for purchasing items from the store's inventory
         * @param {*} subtTotal This is the subTotal of the user's purchase.  Server uses this for keeping track of orders
         * @throws - Error when the purchase fails, usually due to someone else purchasing the last product while its in the current users cart
         */
        async purchaseItems(subtTotal) {
            // Create an order object that contains the shopping cart array and the subtotal
            const order = {
                cart: this.shoppingCart,
                total: subtTotal,
            };
            // Post the order to the server's checkout api
            await axios
                .post("/api/checkout", order)
                .then(() => {
                    // Reset the shopping cart state
                    this.setDefaultCartState();
                })
                .catch((error) => {
                    throw error;
                });
        },
        /**
         * Add product to cart function is responsible for adding a product to the shopping cart's store
         * @param {*} product - this is the product object that is generated when the user clicks on add to cart
         */
        addProductToCart(product) {
            // First check if the item exists in the shopping cart already, if there is no duplicate product the result is -1
            const duplicateItemIndex = this.shoppingCart.findIndex(
                (productInCart) => productInCart.productID === product.productID
            );
            // If the duplicateItemIndex is NOT -1 then we have a duplicate product
            if (duplicateItemIndex !== -1) {
                // Increment quantity purchased by the quantity just added to the cart
                this.shoppingCart[duplicateItemIndex].quantity_purchased +=
                    product.quantity_purchased;
            } else {
                // Otherwise add the item to the shopping cart.
                this.shoppingCart.push(product);
                // Update the last modified to now using JS Date
                this.lastModified = Date.now();
                // Save the current cart state to local storage
                this.saveCartState();
            }
        },
        /**
         * Responsible for removing a product from the cart.
         * @param {*} productID This is the product id for the product we want to remove from the cart.
         */
        removeProductFromCart(productID) {
            // Remove the current product from the cart by finding the index of the product that matches the product ID
            const productToRemoveIndex = this.shoppingCart.findIndex(
                (productInCart) => productInCart.productID === productID
            );
            // Remove the product from the cart using it's index
            this.shoppingCart.splice(productToRemoveIndex, 1);
            // Set the last modified time to now
            this.lastModified = Date.now();
            // Save the current cart state to local storage
            this.saveCartState();
        },
    },
});
