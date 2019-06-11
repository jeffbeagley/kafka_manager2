
<template>
    <div id="app">
        <nav-bar></nav-bar>
        <b-container>
            <div v-if="api_error">
                <b-alert variant="danger" show>There was an issue connecting to the API</b-alert>
            </div>
        </b-container>

        <transition name="fade" mode="out-in">
            <router-view v-if="!api_error"></router-view>
        </transition>
    </div>
</template>

<script>
import NavBar from "./components/navbar";
import { setInterval } from "timers";
import axios from "axios";

export default {
    name: "app",
    components: {
        NavBar
    },
    data() {
        return {
            api_error: true
        };
    },
    methods: {
        async checkStatus() {
            try {
                let s = await axios.get("http://localhost:3000/status");

                if (s.status !== 200) {
                    this.api_error = true;

                    return false;
                }

                if (s.data.status != "up") {
                    this.api_error = true;

                    return false;
                }

                this.api_error = false;

                return true;
            } catch (err) {
                this.api_error = true;

                return false;
            }
        }
    },
    mounted() {
        let self = this;

        self.checkStatus();

        setInterval(async function() {
            self.checkStatus();
        }, 5000);
    }
};
</script>

<style>
.router-link-active {
    color: red;
}

.fade-enter {
    opacity: 0;
}

.fade-enter-active {
    transition: opacity 0.05s ease;
}

.fade-leave-active {
    transition: opacity 0.05s ease;
    opacity: 0;
}
</style>