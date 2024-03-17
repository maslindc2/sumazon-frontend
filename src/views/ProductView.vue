<script>
import ProductComponent from "@/components/Product/ProductComponent.vue";
import RelatedProductsComponent from "@/components/Product/RelatedProductsComponent.vue";
import axios from "axios";

export default {
    data() {
        return {
            // Used for storing information about the current product information
            product: {},
            // Used for storing the product id
            productID: null,
            // Used for storing information about the related products
            relatedProducts: [],
            // Used for displaying a product not found message
            showProductNotFoundMessage: false,
        };
    },
    // Before the page is laoded fetch the product data using url's product id
    beforeMount() {
        // Get the product id from the router
        this.productID = this.$route.params.id;
        // Fetch the product id for the current product using productID
        this.fetchProductData(this.productID);
    },
    methods: {
        fetchProductData(id) {
            // Here we make concurrent calls to the server where one call fetches the product information
            // and the other call is used for fetching information about the related products
            axios
                .all([
                    axios.post("/api/product-info", {
                        productID: id,
                    }),
                    axios.post("/api/related-products", {
                        productID: id,
                    }),
                ])
                .then(
                    axios.spread((productInfo, relatedProducts) => {
                        // Update the this.product object with the product information
                        this.product = productInfo.data;
                        // Update this.relatedProducts array with related products
                        this.relatedProducts = relatedProducts.data;
                    })
                )
                .catch(() => {
                    this.showProductNotFoundMessage = true;
                });
        },
    },
    watch: {
        "$route.params.id"(id) {
            this.fetchProductData(id);
        },
    },
    components: { ProductComponent, RelatedProductsComponent },
};
</script>
<template>
    <main class="bg-gray-100">
        <div
            v-if="showProductNotFoundMessage"
            class="mt-10 flex justify-center rounded-md bg-red-600 px-3 py-1.5 text-2xl font-bold text-white shadow-sm"
        >
            <h1 v-if="showProductNotFoundMessage">Product Does Not Exist!</h1>
        </div>
        <div v-else>
            <!--Below is the product component which renders product information-->
            <ProductComponent :product="product" />
            <!--The below is for displaying the related items to the current product-->
            <RelatedProductsComponent :product="product" :relatedProducts="relatedProducts" />
        </div>
    </main>
</template>
