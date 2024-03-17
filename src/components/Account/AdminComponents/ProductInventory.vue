<script>
/**
 * This page is used for editing product information for the products in the inventory
 */
import axios from "axios";
import EditProduct from "./EditProduct.vue";
export default {
    data() {
        return {
            productInventory: [],
        };
    },
    // Fetch product information before the component is rendered
    async beforeMount() {
        await axios.get("/api/inventory").then((response) => {
            this.productInventory = response.data;
        });
    },
    components: { EditProduct },
};
</script>
<template>
    <div>
        <h1 class="mb-3 text-xl font-bold">Product Inventory</h1>
        <div>
            <div v-for="(product, index) in productInventory" :key="index">
                <!--Displays the product information for each product in the store inventory-->
                <details>
                    <summary class="text-lg">{{ product.name }}</summary>
                    <div class="mb-3 rounded-md border-2 border-solid border-black p-2">
                        <EditProduct
                            :id="product._id"
                            :name="product.name"
                            :price="product.price"
                            :category="product.category"
                            :description="product.description"
                            :quantity="product.item_quantity"
                        />
                    </div>
                </details>
            </div>
        </div>
    </div>
</template>
