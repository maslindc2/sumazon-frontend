<script>
/**
 * This component is used for editing and indivudal product.
 * Handles showing/hiding the edit product form and submitting changes to the server
 */
import axios from "axios";
import router from "@/router";
import { useImageStore } from "@/stores/images";
export default {
    // Props are used to pass information from parent EditInventory to display individual information about the product
    props: {
        id: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
    },
    // Below is where the information will be stored when the form is submitted
    data() {
        return {
            newName: "",
            newPrice: "",
            newCategory: "",
            newDescription: "",
            newQuantity: "",
            newImage: null,
            editCurrentProduct: false,
            isQuantityLessThan1: false,
            isDuplicateProduct: false,
            // Used for displaying a message when the product is being updated
            isUpdatingProduct: false,
            //New price not numeric
            showNewPriceError: false,
        };
    },
    methods: {
        async updateProductChanges() {
            // (If the new quantity is defined then we need to see if the new quantity is less than 0) or if it's not a whole number
            if (
                (this.newQuantity !== "" && +this.newQuantity <= 0) ||
                (this.newQuantity !== "" && !Number.isInteger(Number.parseInt(this.newQuantity)))
            ) {
                this.isQuantityLessThan1 = true;
            } else {
                // Hide the quantity less than 1 error message
                this.isQuantityLessThan1 = false;

                // This regex filters out any garbage that the shop owner puts in for the new price input
                // and updates the value so it's stored as a decimal.
                if (this.newPrice !== "" && this.newPrice !== undefined) {
                    this.newPrice = this.newPrice.replace(/[^0-9.]/g, "");
                }

                // Define a productInfo object that contains all product information variables
                // Some variables might be defined and some might not be
                const productInfo = {
                    _id: this.id,
                    name: this.newName,
                    price: this.newPrice,
                    category: this.newCategory,
                    description: this.newDescription,
                    item_quantity: this.newQuantity,
                };

                // This is the field that will contain only the defined product information
                const productChanges = {};
                // Here we find a key that is defined, if it is then we copy it to the productChanges object
                // if the key is undefined or empty then we skip it. This is because we use findByIdAndUpdate
                // were we use the full body to update the schema
                Object.keys(productInfo).forEach((key) => {
                    if (productInfo[key] !== "" && productInfo[key] !== undefined) {
                        productChanges[key] = productInfo[key].trim();
                    }
                });
                // Get the number changes added
                const lenOfProductChanges = Object.keys(productChanges).length;

                // If the number of changes is more than 1 and the newImage is defined
                if (lenOfProductChanges > 1 && this.newImage !== null) {
                    this.submitProductChangesWithNewImage(productChanges);
                } else if (lenOfProductChanges > 1 && this.newImage === null) {
                    // If changes have been made but the newImage is null only submit product changes
                    this.submitProductChangesOnly(productChanges);
                } else if (lenOfProductChanges === 1 && this.newImage !== null) {
                    // If the change that has been made was the image then submit only the image change
                    this.submitImageChangeOnly();
                } else {
                    // All fields are empty so don't submit anything
                    this.isDuplicateProduct = false;
                    this.editCurrentProduct = false;
                    this.isQuantityLessThan1 = false;
                }
            }
        },
        // If the number of changes is more than 1 and the newImage is defined
        async submitProductChangesWithNewImage(productChanges) {
            // Post the product changes and the newImage to the server
            // Show the updating product information
            this.isUpdatingProduct = true;
            // First post the product changes to the server
            await axios
                .post("/api/edit-product", productChanges)
                .then(async () => {
                    // Now that the changes have been sent next send the image to the server
                    // contains the products current id and the new product image
                    const formData = new FormData();
                    formData.append("productID", JSON.stringify(this.id));
                    formData.append("image", this.newImage);

                    // Send the new image to the server
                    await axios
                        .post("/api/edit-images", formData)
                        .then(async () => {
                            // Define the local instance of image store
                            const imageStore = useImageStore();
                            
                            // Reset the image state, then fetch images, then refresh the page.
                            await imageStore.resetImageState().then(async () => {
                                // Update the images in the image store
                                await imageStore.fetchImages().then(() => {
                                    // Refresh the page
                                    router.go();
                                });
                            });
                        })
                        .catch((error) => {
                            console.error(error);
                        });
                })
                .catch((error) => {
                    // If the product has a duplicate name with another product show the duplicate product error message
                    if (error.response.status === 409) {
                        this.isDuplicateProduct = true;
                        this.isUpdatingProduct = false;
                    } else {
                        console.error(error);
                    }
                });
        },
        // If changes have been made but the newImage is null only submit product changes
        async submitProductChangesOnly(productChanges) {
            this.isUpdatingProduct = true;
            await axios
                .post("/api/edit-product", productChanges)
                .then(async () => {
                    // Define the local instance of image store
                    const imageStore = useImageStore();
                    // Reset the image state, then fetch images, then refresh the page.
                    await imageStore.resetImageState().then(async () => {
                        // Update the images in the image store
                        await imageStore.fetchImages().then(() => {
                            // Refresh the page
                            router.go();
                        });
                    });
                })
                .catch((error) => {
                    // If the error is 409 then it's a duplicate product
                    if (error.response.status === 409) {
                        this.isDuplicateProduct = true;
                        this.isUpdatingProduct = false;
                    } else {
                        console.error(error);
                    }
                });
        },
        // If the change that has been made was the image then submit only the image change
        async submitImageChangeOnly() {
            // Show updating product message
            this.isUpdatingProduct = true;
            // Create form data for sending the image to the server
            const formData = new FormData();
            formData.append("productID", JSON.stringify(this.id));
            formData.append("image", this.newImage);
            // Post the new image to the edit-images route
            await axios
                .post("/api/edit-images", formData)
                .then(() => {
                    // Define the local instance of image store
                    const imageStore = useImageStore();
                    // Update the images in the image store
                    imageStore.fetchImages();
                    // Refresh the page
                    router.go();
                })
                .catch((error) => {
                    console.error(error);
                });
        },
        // Function handles deletion of products
        async deleteProduct() {
            // This route checks for the product id and if the delete flag is set to true
            await axios
                .post("/api/edit-product", {
                    _id: this.id,
                    deleteProduct: true,
                })
                .then(async () => {
                    // We then remove the associated image from the database using the below call
                    // We use a different field because the associated product id for the image is under the field product_id
                    // In this case _id refers to the image's actual id in the database which is something we don't want.
                    await axios
                        .post("/api/edit-images", {
                            product_id: this.id,
                            deleteProduct: true,
                        })
                        .then(() => {
                            router.go();
                        })
                        .catch((error) => {
                            console.error(error);
                        });
                })
                .catch((error) => {
                    console.error(error);
                });
        },
        // Change the edit product form visisbility
        changeUpdateProductVisibility() {
            this.editCurrentProduct = this.editCurrentProduct ? false : true;
        },
        // Used for storing the uploaded image to newImage when the user clicks on upload
        uploadFile(event) {
            this.newImage = event.target.files[0];
        },
    },
};
</script>
<template>
    <div>
        <p>Product: {{ name }}</p>
        <p>Unit Price: ${{ price }}</p>
        <p>Category: {{ category }}</p>
        <p>Description: {{ description }}</p>
        <p>Item Quantity: {{ quantity }}</p>
        <h1 class="text-red-600" v-if="isQuantityLessThan1">
            Product Quantity must be at least 1!
        </h1>
        <h1 v-if="isUpdatingProduct">Updating Product, Please Wait!</h1>
        <h1 class="text-red-600" v-if="isDuplicateProduct">
            Product already exists with that name!
        </h1>
        <button
            class="w-24 rounded-md bg-blue-500 py-1.5 font-medium text-blue-50 hover:bg-blue-300"
            @click="changeUpdateProductVisibility"
        >
            Edit Product
        </button>
        <div v-if="editCurrentProduct">
            <div
                v-if="showNewPriceError"
                class="mb-3 flex w-full justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-bold leading-6 text-white shadow-sm"
            ></div>
            <form class="space-y-3" @submit.prevent="updateProductChanges">
                <div class="mt-2">
                    <input
                        class="block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        type="text"
                        placeholder="Product Name"
                        v-model="newName"
                    />
                </div>
                <div class="mt-2">
                    <input
                        class="block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        type="text"
                        placeholder="Product Price"
                        v-model="newPrice"
                    />
                </div>
                <div class="mt-2">
                    <input
                        class="block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        type="text"
                        placeholder="Product Category"
                        v-model="newCategory"
                    />
                </div>
                <div class="mt-2">
                    <textarea
                        class="block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        type="text"
                        placeholder="Product Description"
                        v-model="newDescription"
                    />
                </div>
                <div class="mt-2">
                    <input
                        class="block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        type="text"
                        placeholder="Item Quantity"
                        v-model="newQuantity"
                    />
                </div>
                <div class="mt-2">
                    <input type="file" @change="uploadFile" accept="image/*" />
                </div>
                <button
                    class="w-32 rounded-md bg-blue-500 py-1.5 font-medium text-blue-50 hover:bg-blue-300"
                >
                    Submit Changes
                </button>
            </form>
            <button
                class="mt-4 w-24 rounded-md bg-gray-500 py-1.5 font-medium text-blue-50 hover:bg-gray-600"
                @click="changeUpdateProductVisibility"
            >
                Cancel
            </button>
            <button
                class="m-4 w-32 rounded-md bg-red-500 py-1.5 font-medium text-blue-50 hover:bg-red-300"
                @click="deleteProduct"
            >
                Delete Product
            </button>
        </div>
    </div>
</template>
