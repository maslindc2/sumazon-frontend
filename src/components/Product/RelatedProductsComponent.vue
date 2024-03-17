<script>
import { useImageStore } from "@/stores/images";
import { computed } from "vue";
import { findImageInProductImages } from "@/util/FindProductImage";
export default {
    props: {
        product: Object,
        relatedProducts: Array,
    },
    setup() {
        const imageStore = useImageStore();
        return {
            // Once the image array is populated return the image array
            productImages: computed(() => imageStore.getImages),
        };
    },
    methods: {
        // Find the image in the product images array using the productID
        findImage(productID) {
            return findImageInProductImages(productID, this.productImages);
        },
    },
    computed: {
        // Filter the related products to only show the ones that do not have an inventory quantity of zero
        filterRelatedProducts() {
            return this.relatedProducts.filter(
                (relatedProduct) => relatedProduct.item_quantity !== 0
            );
        },
    },
};
</script>
<template>
    <div>
        <div class="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
            <h2 class="text-2xl font-bold tracking-tight text-gray-900">
                Other Products in {{ product.category }}
            </h2>
            <h3 class="text-xl tracking-tight text-gray-900" v-if="relatedProducts.length === 0">
                No Other Products in this category!
            </h3>
            <div
                class="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8"
                v-if="relatedProducts.length !== 0"
            >
                <div
                    v-for="(relatedProduct, index) in filterRelatedProducts"
                    :key="index"
                    class="group relative rounded-lg bg-white p-6 shadow-md"
                >
                    <div
                        class="lg:h-75 aspect-h-1 aspect-w-1 flex w-full justify-center overflow-hidden rounded-md lg:aspect-none group-hover:opacity-75"
                    >
                        <img
                            :src="findImage(relatedProduct._id)"
                            alt=""
                            class="lg:w-75 h-full w-full object-contain lg:h-full"
                        />
                    </div>
                    <div class="mt-4 flex justify-between">
                        <div>
                            <h3 class="text-m text-gray-700">
                                <RouterLink
                                    v-if="relatedProduct.item_quantity > 0"
                                    :to="{ name: 'product', params: { id: relatedProduct._id } }"
                                >
                                    <span aria-hidden="true" class="absolute inset-0" />
                                    {{ relatedProduct.name }}
                                </RouterLink>
                            </h3>
                        </div>
                        <p class="text-m font-semibold text-gray-900">
                            ${{ relatedProduct.price }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
