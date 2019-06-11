<template>
    <b-container>
        <h4 class="mt-5">Home</h4>
        <p>Web interface to manage Kafka Connect configurations</p>
        <p>Connector configurations get persisted to a local database with unique ids to preserve history, bust cache, and return appropriate connector status regardless of kafka's state</p>
    </b-container>
</template>

<script>
// @ is an alias to /src

export default {
    name: "home"
};
</script>
