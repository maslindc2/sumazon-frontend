<script>
/**
 * This is the add products component that is only displayed when the user has the role ADMIN.
 */
import router from "@/router";
import axios from "axios";
export default {
    // Here we recieve the image store from the account view this will be used later
    props: {
        imageStore: Object,
    },
    data() {
        return {
            // Uploaded images from the file upload input is stored here
            image: null,
            // Name of the product is stored here
            name: "",
            // Price of the product is stored here
            price: "",
            // Category of the product is stored here
            category: "",
            // Description of the product is stored here
            description: "",
            // Quantity of the product is stored here
            quantity: "",
            // Duplicate Product error is displayed when the admin tries to add a product with the same name into the inventory
            isDuplicateProduct: false,
            // Quantity less than 1 error is displayed when the admin tries to add a product with quantity of 0
            isQuantityLessThan1: false,
            //New price not numeric
            showNewPriceError: false,
            // Show/hide the product form when the admin either clicks on add product, cancel or submit
            showAddProductForm: false,
            // Displays a message when the product is being uploaded
            isUploadingProduct: false,
            // Displays an error message saying the price the shop owner tried to set is invalid
            showPriceError: false,
        };
    },
    methods: {
        async addProduct() {
            // This regex filters out any garbage that the shop owner puts in for the new price input
            // and updates the value so it's stored as a decimal.
            this.price = this.price.replace(/[^0-9.]/g, "");
            // If the cleaned up price is a decimal then we are safe to continue
            if (!isNaN(parseFloat(this.price))) {
                // First check the quantity and see if it's less than or equal to 0
                // Displays error when shop owner tries to create a product with 0 inventory
                if (this.quantity <= 0) {
                    this.isQuantityLessThan1 = true;
                } else {
                    // Hide the product form and the less than error since we have all the necessary information
                    // Normally we don't need to do this but since it can take a bit to upload a product it's best to clear any error messages
                    this.showAddProductForm = false;
                    this.isQuantityLessThan1 = false;
                    // Show the uploading product message
                    this.isUploadingProduct = true;
                    // Post the product to the server with the name, price, category, description and quantity
                    await axios
                        .post("/api/add-product", {
                            name: this.name,
                            price: this.price,
                            category: this.category,
                            description: this.description,
                            quantity: this.quantity,
                        })
                        .then(async (res) => {
                            // Hide the duplicate product error since we successfully added to the product to the db
                            this.isDuplicateProduct = false;
                            // Get the product id from the server's add product route.
                            // We will use this as a way to associate the product image with the product we just created
                            const productID = res.data.product_id;

                            // Create FormData in order to add an image to the image schema for this product
                            const formData = new FormData();
                            // Add the productID, we will need this for fetching the image for the associated product
                            formData.append("productID", JSON.stringify(productID));
                            // Add the image that was selected
                            formData.append("image", this.image);
                            // Upload the image to the database
                            // Annoyingly these operations cannot be in parallel because Mongoose does not allow it
                            // Since above this we uploaded product info, we now upload the product image.
                            await axios
                                .post("/api/add-images", formData)
                                .then(async () => {
                                    // Hide the uploading product message now that we sucessfully posted the image for the product
                                    this.isUploadingProduct = false;
                                    // Tell the image store to update so our client has a fresh image cache
                                    await this.imageStore.fetchImages();
                                    // Refresh the page as we have finished adding the product
                                    router.go();
                                })
                                .catch((error) => {
                                    console.error(error);
                                });
                        })
                        .catch((error) => {
                            // If the server sends 409 then the product already exists in the DB
                            if (error.response.status === 409) {
                                this.isUploadingProduct = false;
                                this.isDuplicateProduct = true;
                            } else {
                                console.error(error.response.status);
                            }
                        });
                }
            } else {
                this.showPriceError = true;
            }
        },
        // Show/Hide the add product form's visibility
        changeAddProductFormVisibility() {
            this.showAddProductForm = this.showAddProductForm ? false : true;
        },
        // Storest the uploaded image to the image variable
        uploadFile(event) {
            this.image = event.target.files[0];
        },
    },
};
</script>
<template>
    <div class="flex-col justify-center">
        <h1 class="mb-3 text-xl font-bold">Add Product to Store Inventory</h1>
        <div>
            <div
                v-if="showPriceError"
                class="mb-3 flex w-full justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-bold leading-6 text-white shadow-sm"
            >
                <h1 v-if="showPriceError">Price is invalid! Example: 11.99 or $11.99</h1>
            </div>
            <div
                v-if="isDuplicateProduct"
                class="mb-3 flex w-full justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-bold leading-6 text-white shadow-sm"
            >
                <h1 v-if="isDuplicateProduct">Product Already Exists in the inventory</h1>
            </div>
            <div
                v-if="isQuantityLessThan1"
                class="mb-3 flex w-full justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-bold leading-6 text-white shadow-sm"
            >
                <h1 v-if="isQuantityLessThan1">Product Quantity must be at least 1!</h1>
            </div>
            <div
                v-if="isUploadingProduct"
                class="mb-3 flex w-full justify-center rounded-md bg-blue-500 px-3 py-1.5 text-sm font-bold leading-6 text-white shadow-sm"
            >
                <h1 v-if="isUploadingProduct">Currently Uploading Product, Please wait!</h1>
            </div>
            <button
                class="w-32 rounded-md bg-blue-500 py-1.5 font-medium text-blue-50 hover:bg-blue-400"
                @click="changeAddProductFormVisibility"
                v-if="!showAddProductForm"
            >
                Add Product
            </button>
            <div v-if="showAddProductForm">
                <form class="space-y-3" @submit.prevent="addProduct">
                    <div class="mt-2">
                        <input
                            class="block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            type="text"
                            placeholder="Product Name"
                            v-model="name"
                            required
                        />
                    </div>
                    <div class="mt-2">
                        <input
                            class="block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            type="text"
                            placeholder="Product Price in USD"
                            v-model="price"
                            required
                        />
                    </div>
                    <div class="mt-2">
                        <input
                            class="block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            type="text"
                            placeholder="Product Category"
                            v-model="category"
                            required
                        />
                    </div>
                    <div class="mt-2">
                        <textarea
                            class="block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            type="text"
                            placeholder="Product Description"
                            v-model="description"
                            required
                        />
                    </div>
                    <div class="mt-2">
                        <input
                            class="block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            type="text"
                            placeholder="Item Quantity"
                            v-model="quantity"
                            required
                        />
                    </div>
                    <div class="mt-2">
                        <input type="file" @change="uploadFile" accept="image/*" required />
                    </div>
                    <button
                        class="w-24 rounded-md bg-blue-500 py-1.5 font-medium text-blue-50 hover:bg-gray-600"
                    >
                        Submit
                    </button>
                </form>
                <button
                    class="mt-4 w-24 rounded-md bg-gray-500 py-1.5 font-medium text-blue-50 hover:bg-gray-600"
                    @click="changeAddProductFormVisibility"
                    v-if="showAddProductForm"
                >
                    Cancel
                </button>
            </div>
        </div>
    </div>
</template>
