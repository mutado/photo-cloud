<template>
  <div>
    <button @click="(imageAdded = true, inputMessageText = '')">add image</button>
    <div v-show="imageAdded">
      <h5>Give the link to the image</h5>
      <input id="imgLinkInput"/><br/>
      <button @click="(imageAdded = false)">close</button>
      <button @click="save">save</button>
    </div>
    <p id="inputMessage">{{ inputMessageText }}</p>
    <a v-for="(img, index) in imgs" :href="'/photos/' + index"><img :src="img"/></a>
  </div>  
</template>
<script>
export default {
  data() {
    return {
      imgs: [],
      imageAdded: false,
      inputMessageText: ''
    }
  },
  methods: {
    save() {
      if (this.isImage(imgLinkInput.value)) {
        this.imgs.push(imgLinkInput.value);
        this.imageAdded = false;
        imgLinkInput.value = '';
        this.inputMessageText = "Photo was added successfuly."
      }
      else {
        this.imageAdded = false;
        imgLinkInput.value = '';
        this.inputMessageText = "Error: link is not reffering to the image."
      }
    },
    isImage(url) {
      return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
    },
  }
}
</script>
