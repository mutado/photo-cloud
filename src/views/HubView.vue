<template>
  <div id="Hub">
    <Header />
    <Sidebar />
    <router-view />
  </div>
</template>

<script>
import Header from "@/components/Header.vue";
import Sidebar from "@/components/Sidebar.vue";

export default {
  name: "HubView",
  components: {
    Header, Sidebar
  },
};
</script>
