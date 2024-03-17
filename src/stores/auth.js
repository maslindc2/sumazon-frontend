/**
 * This store is used for storing the client's authentication and account information.
 * When the user signs in the user store gets defined and is stored in localstorage.
 * Later we use the store later for the various admin components.
 *
 * Login, Register, Logout, and Edit Profile actions are handled here as we need to update the user store
 * with any changes that have been made.
 */
// Using pinia statemanagement, Vuex is good but overkill for this project
import { defineStore } from "pinia";
// Importing axios for sending/retrieving info from the server
import axios from "axios";

// Import the phone number validator and phone number
import { validPhoneNumber, formatPhoneNumber } from "@/util/PhoneNumberUtil";

// Define the user store
export const useAuthStore = defineStore("user", {
    state: () => {
        // If the user store is defined
        if (localStorage.getItem("user")) {
            // Return the current user information from a JSON string to an Object
            return JSON.parse(localStorage.getItem("user"));
        } else {
            // If localstorage doesn't contain user information then the default state is null
            return {
                user: null,
            };
        }
    },
    // Returns if true the user is currently authenticated a.k.a defined
    getters: {
        isAuthenticated: (state) => !!state?.user,
    },
    // These actions are for authentication it's easier to handle this here and update the user store
    // than doing these operations in the relative components.
    actions: {
        // Login handles making login requests to the server
        async login(username, password) {
            await axios
                .post("/api/login", {
                    username: username,
                    password: password,
                })
                .then((response) => {
                    this.$state.user = response.data;
                    return response.status;
                })
                .catch((error) => {
                    throw error;
                });
        },
        // Register creates an account using all of the fields from views/RegisterView.vue
        async register(username, full_name, email, address, phone_number, password) {
            await axios
                .post("/api/register", {
                    username: username,
                    full_name: full_name,
                    email: email,
                    address: address,
                    phone_number: phone_number,
                    password: password,
                })
                .then((response) => {
                    this.$state.user = response.data;
                    return response.status;
                })
                .catch((error) => {
                    if (error.response.status === 403) {
                        throw error;
                    } else {
                        console.error(error);
                        throw error;
                    }
                });
        },
        // Logout makes a logout request to server where the express session is cleared on the server
        // and the user store is set to null
        async logout() {
            await axios
                .post("/api/logout")
                .then(() => {
                    this.$state.user = null;
                    localStorage.clear();
                })
                .catch((error) => {
                    console.error(error);
                });
        },
        // Posts edits to the user account
        async editProfile(username, full_name, email, address, phone_number, password) {
            // User Information object containing alll of the values from the form on AccountInfo
            const userInformation = {
                username: username,
                full_name: full_name,
                email: email,
                address: address,
                phone_number: phone_number,
                password: password,
            };

            // If the userChanges.phone_number is defined then the user is wanting to edit their phone number
            if (userInformation.phone_number !== "" && userInformation.phone_number !== undefined) {
                if (validPhoneNumber(userInformation.phone_number)) {
                    userInformation.phone_number = formatPhoneNumber(userInformation.phone_number);
                } else {
                    throw new SyntaxError();
                }
            }

            // This object will contain the changes that the user has made.
            const userChanges = {};

            // Since some of the fields might be empty we iterate through the userInformation object
            // and only add the fields that are defined
            Object.keys(userInformation).forEach((key) => {
                if (userInformation[key] !== "" && userInformation[key] !== undefined) {
                    userChanges[key] = userInformation[key].trim();
                }
            });

            // Send the profile changes to the server.
            await axios
                .post("/api/edit-profile", userChanges)
                .then(() => {
                    Object.keys(userChanges).forEach((key) => {
                        this.$state.user[key] = userChanges[key];
                    });
                })
                .catch((error) => {
                    if (error.response.status === 403) {
                        throw error;
                    } else {
                        console.error(error);
                        throw error;
                    }
                });
        },
    },
});
