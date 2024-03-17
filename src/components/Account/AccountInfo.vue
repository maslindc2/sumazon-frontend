<script>
/**
 * This component is for displaying and editing the user's information
 */
import router from "@/router";
import { validEmailAddress } from "@/util/EmailAddressValidator";
export default {
    props: {
        authStore: Object,
    },
    data() {
        return {
            isEditProfile: false,
            username: "",
            full_name: "",
            email: "",
            address: "",
            phone_number: "",
            password: "",
            confirmPassword: "",
            showPasswordError: false,
            showPhoneNumberError: false,
            showUserOrEmailExistsError: false,
            showEmailError: false,
        };
    },
    methods: {
        // Shows and hides the edit profile form
        showHideEditProfileForm() {
            this.isEditProfile = this.isEditProfile ? false : true;
            // This is here to hide these errors if the user changes their mind and hits cancel to close the edit form
            this.showPasswordError = false;
            this.showPhoneNumberError = false;
            this.showUserOrEmailExistsError = false;
        },
        // Updating changes on user store located in stores/auth.js
        // We do this to ensure that our state is properly updated and does not contain out dated information
        async submitProfileChanges() {
            // If the updated password is the same as confirm password we submit changes
            // NOTE: All fields do not have to be populated, if you only want to change username change the username and leave the rest blank
            if (this.password === this.confirmPassword) {
                // If the email field is defined and validEmailAddress returns that the email is not valid
                // (yes this condition is ugly but it works and this is just a academic project)
                if (
                    this.email !== "" &&
                    this.email !== undefined &&
                    !validEmailAddress(this.email)
                ) {
                    // Display the email error
                    this.showEmailError = true;
                } else {
                    await this.authStore
                        .editProfile(
                            this.username,
                            this.full_name,
                            this.email,
                            this.address,
                            this.phone_number,
                            this.password
                        )
                        .then(() => {
                            router.go();
                        })
                        .catch((error) => {
                            // If we got a syntax error (because I throw one when) the user did not format their phone number correctly
                            if (error instanceof SyntaxError) {
                                this.showPhoneNumberError = true;
                            } else if (error.response.status === 403) {
                                // Email or username already exists error occurs when exactly that and the server returns 403
                                this.showUserOrEmailExistsError = true;
                            } else {
                                // Dump the error to the console if something else happens
                                console.error(error);
                            }
                        });
                }
            } else {
                // Show the mismatched password error
                this.showPasswordError = true;
            }
        },
        // When logout button is pressed this clears the auth store and kicks user to homepage
        async logout() {
            this.authStore.logout();
            router.push("/");
        },
    },
};
</script>
<template>
    <div class="flex-col justify-center">
        <h1 class="mb-5 text-xl font-bold">Hello {{ authStore.user.username }}!</h1>
        <div
            v-if="showPasswordError"
            class="flex w-full justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-bold leading-6 text-white shadow-sm"
        >
            <h1 v-if="showPasswordError">Passwords Must Match!</h1>
        </div>
        <div
            v-if="showUserOrEmailExistsError"
            class="mb-4 flex w-full justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-bold leading-6 text-white shadow-sm"
        >
            <h1 v-if="showUserOrEmailExistsError">Username or Email Address Already Exists!</h1>
        </div>
        <div
            v-if="showPhoneNumberError"
            class="mb-4 flex w-full justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-bold leading-6 text-white shadow-sm"
        >
            <h1 v-if="showPhoneNumberError">Incorrect Phone Number</h1>
        </div>
        <div
            v-if="showEmailError"
            class="mb-4 flex w-full justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-bold leading-6 text-white shadow-sm"
        >
            <h1 v-if="showEmailError">Incorrect Email Address!</h1>
        </div>
        <div class="mb-4">
            <p>User Name: {{ authStore.user.username }}</p>
            <p>Full Name: {{ authStore.user.full_name }}</p>
            <p>Email Address: {{ authStore.user.email }}</p>
            <p>Street Address: {{ authStore.user.address }}</p>
            <p>Phone Number: {{ authStore.user.phone_number }}</p>
        </div>
        <button
            class="mb-4 w-24 rounded-md bg-blue-500 py-1.5 font-medium text-blue-50 hover:bg-blue-400"
            @click="showHideEditProfileForm"
            v-if="!isEditProfile"
        >
            Edit
        </button>
        <div v-if="isEditProfile">
            <form class="space-y-3" @submit.prevent="submitProfileChanges">
                <div class="mt-2">
                    <label for="username" class="block text-sm font-medium leading-6 text-gray-900"
                        >Username</label
                    >
                    <input
                        class="block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        type="text"
                        placeholder="User Name"
                        v-model="username"
                    />
                </div>
                <div class="mt-2">
                    <label for="name" class="block text-sm font-medium leading-6 text-gray-900"
                        >Full Name</label
                    >
                    <input
                        class="block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        type="text"
                        id="name"
                        placeholder="Full Name"
                        v-model="full_name"
                    />
                </div>
                <div class="mt-2">
                    <label for="email" class="block text-sm font-medium leading-6 text-gray-900"
                        >Email Address</label
                    >
                    <input
                        class="block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        id="email"
                        type="email"
                        placeholder="email@provider.com"
                        v-model="email"
                    />
                </div>
                <div class="mt-2">
                    <label
                        for="fullAddress"
                        class="block text-sm font-medium leading-6 text-gray-900"
                        >Full Address</label
                    >
                    <input
                        class="block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        type="text"
                        id="fullAddress"
                        placeholder="Full Address"
                        v-model="address"
                    />
                </div>
                <div class="mt-2">
                    <label for="phone" class="block text-sm font-medium leading-6 text-gray-900"
                        >Phone Number</label
                    >
                    <input
                        class="block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        type="tel"
                        id="phone"
                        placeholder="(xxx)-xxx-xxxx"
                        v-model="phone_number"
                    />
                </div>
                <div class="mt-2">
                    <label for="password" class="block text-sm font-medium leading-6 text-gray-900"
                        >Password</label
                    >
                    <input
                        class="block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        type="password"
                        id="password"
                        placeholder="**********"
                        v-model="password"
                    />
                </div>
                <div class="mt-2">
                    <label
                        for="ConfirmPassword"
                        class="block text-sm font-medium leading-6 text-gray-900"
                        >Confirm Password</label
                    >
                    <input
                        class="block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        type="password"
                        id="ConfirmPassword"
                        placeholder="**********"
                        v-model="confirmPassword"
                    />
                </div>
                <button
                    class="mb-4 w-32 rounded-md bg-blue-500 py-1.5 font-medium text-blue-50 hover:bg-blue-400"
                    type="submit"
                >
                    Update Profile
                </button>
            </form>
            <button
                class="mb-4 mt-4 w-24 rounded-md bg-gray-500 py-1.5 font-medium text-blue-50 hover:bg-gray-600"
                @click="showHideEditProfileForm"
                v-if="isEditProfile"
            >
                Cancel
            </button>
        </div>
        <div>
            <!--Below is the button for logout only displayed if the user is logged in-->
            <button
                class="w-24 rounded-md py-1.5 font-medium text-black hover:bg-gray-600 hover:text-white"
                hover:text-white
                @click="logout"
            >
                Logout
            </button>
        </div>
    </div>
</template>
