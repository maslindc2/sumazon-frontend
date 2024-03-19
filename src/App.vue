<script setup>
import { RouterView } from "vue-router";
import NavBar from "@/components/Home/NavBar.vue";
import { onMounted } from "vue";
</script>

<template>
    <header>
        <div class="wrapper">
            <NavBar />
        </div>
    </header>
    <RouterView />
</template>
