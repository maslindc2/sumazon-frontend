import { createApp, watch } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";
import { useImageStore } from "./stores/images";
import router from "./router";
import "./index.css";
import { useShoppingCartStore } from "./stores/shoppingCart";

// Create a pinia instance used for state management
const pinia = createPinia();
// call Vue's create app
const app = createApp(App);
// Use Vue Route for handling multiple pages
app.use(router);
// Use Pinia State management
app.use(pinia);

const imageStore = useImageStore();
imageStore.fetchImages();
// Define the shopping cart store used for storing items in the cart
const shoppingCart = useShoppingCartStore();
// Restore the shopping cart if there is an instance in localstorage
shoppingCart.restoreCartState();

watch(
    pinia.state,
    (state) => {
        /**
         * State.user is a proxy object, if we want to access username we have to do state.user.user.username
         * which is quite ugly. Use JSON.stringify to strip to the proxy part and store it as a JSON string.
         * When we want to access this info later we use JSON.parse to get the object.
         */
        localStorage.setItem("user", JSON.stringify(state.user));
    },
    {
        deep: true,
    }
);

app.mount("#app");
