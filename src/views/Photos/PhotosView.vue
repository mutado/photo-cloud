<template>
  <div>
    <button @click="add">add</button>
    <a v-for="(img, index) in imgs" :href="'/photos/' + index"><img src="../../../public/img/icons/android-chrome-192x192.png"/></a>
    <p>{{ text }}</p>
  </div>  
</template>
<script>
export default {
  data() {
    return {
      imgs: ["../../../public/img/icons/android-chrome-192x192.png","../../../public/img/icons/android-chrome-192x192.png","../../../public/img/icons/android-chrome-192x192.png"]
    }
  },
  methods: {
    add() {
      this.imgs.push('../../../public/img/icons/android-chrome-192x192.png');
    }
  }
}
</script>
