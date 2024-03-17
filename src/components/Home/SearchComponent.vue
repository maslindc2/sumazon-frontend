<script>
export default {
    props: {
        productInventory: Array,
    },
    data() {
        return {
            searchQuery: "",
        };
    },
    computed: {
        // Takes input from the search box and filters the items in the product inventory array
        // using the current input.
        filteredProducts() {
            if (!this.searchQuery) return [];
            return this.productInventory.filter((product) =>
                product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
            );
        },
    },
};
</script>
<template>
    <div>
        <div class="flex flex-col items-center">
            <div class="m-5">
                <form action="">
                    <input
                        class="rounded-lg border-slate-400 text-center hover:border-black"
                        type="text"
                        v-model="searchQuery"
                        placeholder="Search Products"
                    />
                </form>
            </div>
            <div class="mt-2">
                <div v-for="(product, index) in filteredProducts" :key="index">
                    <!--Hide the product if the item quantity is 0-->
                    <div v-if="product.item_quantity > 0">
                        <RouterLink :to="{ name: 'product', params: { id: product._id } }">
                            <p class="rounded-md px-2 py-2 hover:bg-gray-300">{{ product.name }}</p>
                        </RouterLink>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
