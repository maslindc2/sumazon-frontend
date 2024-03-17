<script>
/**
 * This is the account view responsible for displaying account information.
 * If the user has the role ADMIN, then it displays add product and edit inventory components.
 * Components for ADMIN role are located in components/Account/AdminComponents
 * Component for AccountInfo seen by both ADMIN and USER role's are located in components/Account
 */
import AccountInfo from "@/components/Account/AccountInfo.vue";
import AddProducts from "@/components/Account/AdminComponents/AddProducts.vue";
import EditInventory from "@/components/Account/AdminComponents/ProductInventory.vue";
import ViewOrders from "@/components/Account/ViewOrders.vue";

// Import the authentication store for getting user information
import { useAuthStore } from "@/stores/auth";
import { useImageStore } from "@/stores/images";

export default {
    setup() {
        // Define the local instance of authStore
        const authStore = useAuthStore();
        // Define the local instance of imageStore
        const imageStore = useImageStore();
        // Return the local instance of authStore
        return { authStore, imageStore };
    },
    components: { AccountInfo, AddProducts, EditInventory, ViewOrders },
};
</script>
<template>
    <div class="h-screen bg-gray-100 pt-5">
        <div class="m-6 grid grid-cols-1 sm:grid-cols-2 sm:gap-x-10 lg:grid-cols-2 lg:gap-x-5">
            <div class="rounded-lg bg-white p-6 shadow-md sm:flex sm:justify-start">
                <!--Here we are rendering the account info component, also responsible for editing profile info
                    We pass it the authStore for the component to fetch and edit user info-->
                <AccountInfo :authStore="authStore" />
            </div>
            <div
                class="justify-between rounded-lg bg-white p-6 shadow-md sm:flex sm:justify-start"
                v-if="authStore.user.role === 'admin'"
            >
                <!--Below is the edit inventory component only displayed if the user is an admin-->
                <EditInventory />
            </div>
            <div
                class="mt-6 justify-between rounded-lg bg-white p-6 shadow-md sm:flex sm:justify-start"
                v-if="authStore.user.role === 'admin'"
            >
                <!--Below is the add products component only displayed if the user is an admin-->
                <AddProducts :imageStore="imageStore" v-if="authStore.user.role === 'admin'" />
            </div>
            <div
                class="mt-6 justify-between rounded-lg bg-white p-6 shadow-md sm:flex sm:justify-start"
            >
                <!--Below is the show orders component, this component renders differently depending on user role-->
                <ViewOrders />
            </div>
        </div>
    </div>
</template>
