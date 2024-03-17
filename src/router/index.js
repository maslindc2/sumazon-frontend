/**
 * Just like React, Vue is be default single page but we can use vue-router to add routes
 * which promotes scalability and is a bit easier for development.
 */
import { createRouter, createWebHistory } from "vue-router";
// Create our router instance
const router = createRouter({
    // Create web history so we can easily go backwards and forwards
    history: createWebHistory(import.meta.env.BASE_URL),
    // Define the possible routes for the user
    routes: [
        // Used for the homepage
        {
            path: "/",
            name: "home",
            component: () => import("../views/HomeView.vue"),
        },
        // Used for the login page
        {
            path: "/login",
            name: "login",
            component: () => import("../views/LoginView.vue"),
        },
        // Used for the register page
        {
            path: "/register",
            name: "register",
            component: () => import("../views/RegisterView.vue"),
        },
        // Used for the account page
        {
            path: "/account",
            name: "account",
            component: () => import("../views/AccountView.vue"),
        },
        // Used for the individual product pages
        {
            path: "/product/:id",
            name: "product",
            component: () => import("../views/ProductView.vue"),
        },
        //Used for the shopping cart page
        {
            path: "/shopping-cart",
            name: "shoppingCart",
            component: () => import("../views/ShoppingCartView.vue"),
        },
    ],
});

export default router;
