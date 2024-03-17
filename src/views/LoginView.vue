<script>
import router from "@/router";
import { useAuthStore } from "../stores/auth";
export default {
    // Setup the authentication store local instance
    setup() {
        const authStore = useAuthStore();
        return { authStore };
    },
    data() {
        return {
            // Stores the username typed in the input field
            username: "",
            // Stores the password typed in the input field
            password: "",
            // Used for showing/hiding wrong password message
            showWrongPasswordMsg: false,
        };
    },
    methods: {
        // Handles login functionality, calls login function in the auth store with the username and password from the form
        async login() {
            // Wait for the auth store to login and a session to be established
            await this.authStore
                .login(this.username, this.password)
                .then(() => {
                    // After we successfully posted the login request to the server and it was accepted
                    // Kick the user back to the homepage indicating we sucessfully logged in
                    router.push("/");
                })
                .catch(() => {
                    // If something goes wrong with login show wrong password message
                    this.showWrongPasswordMsg = true;
                });
        },
    },
};
</script>

<template>
    <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form class="space-y-6" @submit.prevent="login">
                <div>
                    <div
                        v-if="showWrongPasswordMsg"
                        class="flex w-full justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-bold leading-6 text-white shadow-sm"
                    >
                        <h1 v-if="showWrongPasswordMsg">Wrong Password try again!</h1>
                    </div>
                    <div class="mt-2">
                        <label
                            for="username"
                            class="block text-sm font-medium leading-6 text-gray-900"
                            >Username</label
                        >
                        <input
                            id="username"
                            v-model="username"
                            placeholder="Username"
                            required
                            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                    </div>
                </div>
                <div>
                    <div class="mt-2">
                        <label
                            for="password"
                            class="block text-sm font-medium leading-6 text-gray-900"
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
                </div>
                <div>
                    <button
                        type="submit"
                        class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Sign In
                    </button>
                </div>
            </form>
            <p class="mt-10 text-center text-sm text-gray-500">
                Don't have an account?
                <RouterLink
                    to="/register"
                    class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
                    >Register</RouterLink
                >
            </p>
        </div>
    </div>
</template>
