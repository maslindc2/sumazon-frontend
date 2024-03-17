<script>
/**
 * This handles the orders component where we list the various orders that have arrived on the admin dashboard
 */
import axios from "axios";
import { useAuthStore } from "@/stores/auth";

export default {
    setup() {
        // Define the local instance of authStore
        const authStore = useAuthStore();
        // Return the local instance of authStore
        return { authStore };
    },
    data() {
        // We will be storing orders from the db here
        return {
            orders: [],
        };
    },
    mounted() {
        // When the component is mounted fetch the orders from the API
        this.fetchOrdersFromDB();
    },
    methods: {
        // Fetches oders from the DB depending on user session's role the response will be different
        async fetchOrdersFromDB() {
            await axios
                .get("/api/orders")
                .then((res) => {
                    this.orders = res.data;
                })
                .catch((error) => {
                    console.error(error);
                });
        },
        // Convert the order date from ISO8601 to en-us
        convertTime(orderDate) {
            // We use the options hour and minute to only display that
            // This will display seconds and ms if we let it, from UI perspective it's quite ugly if we don't
            return new Date(orderDate).toLocaleString("en-us", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
        },
    },
};
</script>
<template>
    <div>
        <h1 class="mb-3 text-xl font-bold">Orders</h1>
        <h2 v-if="orders.length === 0">No orders yet!</h2>
        <div>
            <div v-for="(order, index) in orders" :key="index">
                <h2 v-if="authStore.user.role === 'user'">
                    Order on: {{ convertTime(order.order_date) }}
                </h2>
                <h2 class="text-xl" v-if="authStore.user.role === 'admin'">
                    Order From {{ order.customer_info.full_name }} on
                    {{ convertTime(order.order_date) }}
                </h2>
                <div class="ml-4">
                    <details>
                        <summary>Order Details</summary>
                        <div class="ml-4">
                            <details>
                                <summary>Items Purchased</summary>
                                <div
                                    class="mb-3 ml-4 rounded-md border-2 border-solid border-black p-2"
                                    v-for="(product, productIndex) in order.products_ordered"
                                    :key="productIndex"
                                >
                                    <div>
                                        <p>Product Name: {{ product.name }}</p>
                                        <p>Unit Price: ${{ product.price }}</p>
                                        <p>Quantity Purchased: {{ product.quantity_purchased }}</p>
                                    </div>
                                </div>
                            </details>
                        </div>
                        <div class="ml-4">
                            <div>
                                <details v-if="authStore.user.role === 'admin'">
                                    <summary>Customer Information</summary>
                                    <div
                                        class="mb-3 rounded-md border-2 border-solid border-black p-2"
                                    >
                                        <p>Email: {{ order.customer_info.email }}</p>
                                        <p>Address: {{ order.customer_info.address }}</p>
                                        <p>Phone Number: {{ order.customer_info.phone_number }}</p>
                                    </div>
                                </details>
                                <p class="font-bold">Order Total: ${{ order.order_total }}</p>
                            </div>
                        </div>
                    </details>
                </div>
            </div>
        </div>
    </div>
</template>
