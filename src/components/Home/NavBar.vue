<script>
/**
 * This page is used for the Navigation bar at the top of the website
 */
import { useAuthStore } from "@/stores/auth";
export default {
    // This is the product inventory array passed from
    props: {
        productInventory: Array,
    },
    data() {
        return {
            isPathHome: true,
            isPathLogin: false,
            isPathRegister: false,
            isPathShoppingCart: false,
            isPathAccount: false,
        };
    },
    // Define and return the authentication store for user information
    setup() {
        const authStore = useAuthStore();
        return { authStore };
    },
    methods: {
        getCurrentRoute(path) {
            /**
             * Below is probably the worst part of this project
             * This shows and hides the underline under each link in the nav bar
             * We use a watch to keep track of what the current route is on the router
             * This way if we navigate to a page using a link we can accurately update the NavBar
             * Hey at least the UI interaction looks good
             */
            if (path === "/login") {
                this.isPathLogin = true;
                this.isPathHome = false;
                this.isPathRegister = false;
                this.isPathShoppingCart = false;
                this.isPathAccount = false;
            } else if (path === "/register") {
                this.isPathRegister = true;
                this.isPathHome = false;
                this.isPathLogin = false;
                this.isPathShoppingCart = false;
                this.isPathAccount = false;
            } else if (path === "/shopping-cart") {
                this.isPathShoppingCart = true;
                this.isPathHome = false;
                this.isPathLogin = false;
                this.isPathRegister = false;
                this.isPathAccount = false;
            } else if (path === "/account") {
                this.isPathAccount = true;
                this.isPathHome = false;
                this.isPathLogin = false;
                this.isPathRegister = false;
                this.isPathShoppingCart = false;
            } else {
                this.isPathHome = true;
                this.isPathLogin = false;
                this.isPathRegister = false;
                this.isPathShoppingCart = false;
                this.isPathAccount = false;
            }
        },
    },
    watch: {
        "$route.path"(path) {
            this.getCurrentRoute(path);
        },
    },
};
</script>
<template>
    <nav class="bg-white shadow">
        <div
            class="container mx-auto flex items-center justify-center p-6 capitalize text-gray-600"
        >
            <div>
                <h1>Sumazon</h1>
            </div>

            <!--Below displays the login button if the user is not authenticated-->
            <div>
                <RouterLink
                    to="/"
                    :class="{ 'border-b-2 border-blue-500': isPathHome }"
                    class="mx-1.5 hover:text-blue-500 sm:mx-6"
                    >Home</RouterLink
                >
                <RouterLink
                    to="/login"
                    v-if="!authStore.isAuthenticated"
                    :class="{ 'border-b-2 border-blue-500': isPathLogin }"
                    class="mx-1.5 hover:text-blue-500 sm:mx-6"
                    >Login</RouterLink
                >
                <!--Below displays the register button if the user is not authenticated-->
                <RouterLink
                    to="/register"
                    v-if="!authStore.isAuthenticated"
                    :class="{ 'border-b-2 border-blue-500': isPathRegister }"
                    class="mx-1.5 hover:text-blue-500 sm:mx-6"
                    >Register</RouterLink
                >
                <!--Below displays the account button if the user IS authenticated-->
                <RouterLink
                    to="/account"
                    v-if="authStore.isAuthenticated"
                    :class="{ 'border-b-2 border-blue-500': isPathAccount }"
                    class="mx-1.5 hover:text-blue-500 sm:mx-6"
                    >Account Page</RouterLink
                >
                <RouterLink
                    to="/shopping-cart"
                    :class="{ 'border-b-2 border-blue-500': isPathShoppingCart }"
                    class="mx-1.5 hover:text-blue-500 sm:mx-6"
                    >Shopping Cart</RouterLink
                >
            </div>
        </div>
    </nav>
</template>
