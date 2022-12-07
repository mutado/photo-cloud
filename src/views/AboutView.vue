<template>
  <div class="about">
    <h1>This is an about page</h1>
    <input
      @change="uploadImage"
      type="file"
      ref="file"
      accept="image/png, image/jpeg"
    />
    <button @click="submitImage">Submit</button>
  </div>
</template>

<script>
import { file } from "@babel/types";
import axios from "axios";
import { defineComponent } from "vue";

export default defineComponent({
  data() {
    return {
      image: null,
    };
  },
  methods: {
    uploadImage() {
      this.image = this.$refs.file.files[0];
    },
    submitImage() {
      const formData = new FormData();
      formData.append("photo", this.image);
      const headers = {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
      };
      axios
        .post("http://167.172.172.251/api/photos", formData, { headers })
        .then((res) => {
          res.data.files;
          res.status;
        });
    },
  },
});
</script>
