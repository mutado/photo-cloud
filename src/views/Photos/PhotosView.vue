<template>
  <div id="photosView">
    <button @click="addImage">add image</button>
    <div v-show="imageAdded">
      <h5>Give the link to the image</h5>
      <input id="imgLinkInput" /><br />
      <button @click="close">close</button>
      <button @click="save">save</button>
    </div>
    <p id="inputMessage">{{ inputMessageText }}</p>
    <a v-for="(img, index) in imgs" :href="'/photos/' + index">
      <img :src="img" />
    </a>
  </div>
</template>
<script lang="ts">
import Photo from '@/models/Photo'
import { defineComponent } from 'vue'

export default defineComponent({
  data() {
    return {
      imgs: [],
      imageAdded: false,
      inputMessageText: "",
    };
  },
  mounted() {
    Photo.index()
  },
  computed: {
    photos: () => Photo.all()
  },
  methods: {
    addImage() {
      this.imageAdded = true;
      this.inputMessageText = '';
    },
    save() {
      if (this.isImage(imgLinkInput.value)) {
        this.imgs.push(imgLinkInput.value);
        this.endSave(true);
      } else {
        this.endSave(false);
      }
    },
    endSave(success) {
      this.imageAdded = false;
      imgLinkInput.value = "";
      if (success) {
        this.inputMessageText = "Photo was added successfuly.";
      } else {
        this.inputMessageText = "Error: link is not reffering to the image.";
      }
    },
    close() {
      this.imageAdded = false;
    },
    isImage(url) {
      return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
    },
  },
};
</script>
<style>
#photosView {
  position: absolute;
  left: 25%;
  top: 80px;
}
</style>
