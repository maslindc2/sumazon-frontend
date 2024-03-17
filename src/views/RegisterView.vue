<script>
/**
 * This is the registration page and handles most of the account creation.
 */
import router from "@/router";
import { useAuthStore } from "@/stores/auth";
import { validPhoneNumber, formatPhoneNumber } from "../util/PhoneNumberUtil";
import { validEmailAddress } from "@/util/EmailAddressValidator";
export default {
    // Create a local instance of authstore
    setup() {
        const authStore = useAuthStore();
        return { authStore };
    },
    // Defining vars and inital state for them
    data() {
        return {
            username: "",
            full_name: "",
            email: "",
            address: "",
            phone_number: "",
            password: "",
            confirmPassword: "",
            showPasswordError: false,
            showPhoneNumberError: false,
            showUserExistsError: false,
            showEmailError: false,
        };
    },
    methods: {
        // Handles submitting the registration request to the server
        async register() {
            // If the password match then we can safely continue
            if (this.password === this.confirmPassword) {
                if (validEmailAddress(this.email)) {
                    // If the phone number is a valid format
                    if (validPhoneNumber(this.phone_number)) {
                        // Re-Format the phone number before we store it in the DB
                        // Ensures a uniform format for all of the user's phone numbers
                        this.phone_number = formatPhoneNumber(this.phone_number);

                        // run the register function in authstore
                        await this.authStore
                            .register(
                                this.username,
                                this.full_name,
                                this.email,
                                this.address,
                                this.phone_number,
                                this.password
                            )
                            .then(() => {
                                // Kick the user back to the homescreen (the server will log them in after a successful registration)
                                router.push("/");
                            })
                            .catch(() => {
                                // Display an error if the current user is attempting to reuse a username or email address
                                this.showUserExistsError = true;
                            });
                    } else {
                        // Display the invalid phone number error
                        this.showPhoneNumberError = true;
                    }
                } else {
                    this.showEmailError = true;
                }
            } else {
                // Show the mismatched password error
                this.showPasswordError = true;
            }
        },
    },
};
</script>
<template>
    <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form class="space-y-3" @submit.prevent="register">
                <div
                    v-if="showPasswordError"
                    class="flex w-full justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-bold leading-6 text-white shadow-sm"
                >
                    <h1>Passwords Must Match!</h1>
                </div>
                <div
                    v-if="showPhoneNumberError"
                    class="flex w-full justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-bold leading-6 text-white shadow-sm"
                >
                    <h1 v-if="showPhoneNumberError">Incorrect Phone Number!</h1>
                </div>
                <div
                    v-if="showUserExistsError"
                    class="flex w-full justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-bold leading-6 text-white shadow-sm"
                >
                    <h1 v-if="showUserExistsError">Username or Email Already Exists!</h1>
                </div>
                <div
                    v-if="showEmailError"
                    class="flex w-full justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-bold leading-6 text-white shadow-sm"
                >
                    <h1 v-if="showEmailError">Incorrect Email Address!</h1>
                </div>
                <div class="mt-2">
                    <label for="username" class="block text-sm font-medium leading-6 text-gray-900"
                        >Username</label
                    >
                    <input
                        id="username"
                        type="text"
                        placeholder="Username"
                        v-model="username"
                        required
                        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                </div>
                <div class="mt-2">
                    <label for="email" class="block text-sm font-medium leading-6 text-gray-900"
                        >Full Name</label
                    >
                    <input
                        id="full_name"
                        type="text"
                        placeholder="Full Name"
                        v-model="full_name"
                        required
                        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                </div>
                <div class="mt-2">
                    <label for="email" class="block text-sm font-medium leading-6 text-gray-900"
                        >Email Address</label
                    >
                    <input
                        id="email"
                        type="email"
                        placeholder="email@provider.com"
                        v-model="email"
                        required
                        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                </div>
                <div class="mt-2">
                    <label for="address" class="block text-sm font-medium leading-6 text-gray-900"
                        >Full Address</label
                    >
                    <input
                        id="address"
                        type="text"
                        placeholder="Full Address"
                        v-model="address"
                        required
                        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                </div>
                <div class="mt-2">
                    <label for="tel" class="block text-sm font-medium leading-6 text-gray-900"
                        >Phone Number</label
                    >
                    <input
                        id="tel"
                        type="tel"
                        placeholder="(xxx)-xxx-xxxx"
                        v-model="phone_number"
                        required
                        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                    <p v-if="showPhoneNumberError">Phone Number is not valid!</p>
                </div>
                <div class="mt-2">
                    <label for="password" class="block text-sm font-medium leading-6 text-gray-900"
                        >Password</label
                    >
                    <input
                        id="password"
                        type="password"
                        placeholder="**********"
                        v-model="password"
                        required
                        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                </div>
                <div class="mt-2">
                    <label
                        for="ConfirmPassword"
                        class="block text-sm font-medium leading-6 text-gray-900"
                        >Confirm Password</label
                    >
                    <input
                        id="ConfirmPassword"
                        type="password"
                        placeholder="**********"
                        v-model="confirmPassword"
                        required
                        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                </div>
                <div>
                    <button
                        type="submit"
                        class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Sign Up
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>
