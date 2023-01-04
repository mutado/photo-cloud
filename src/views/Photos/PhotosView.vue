<template>
  <teleport to="#toolbar">
    <zoom-control aspect-ratio />
    <div class="headerChild">
      <v-button @click="choosePhotos">
        <i class="bi bi-light bi-cloud-upload"></i>
      </v-button>
      <v-button :disabled="!selected.length">
        <i class="bi bi-light bi-folder-plus"></i>
      </v-button>
      <v-button :disabled="!selected.length">
        <i class="bi bi-light bi-heart"></i>
      </v-button>
      <v-button :disabled="!selected.length">
        <i class="bi bi-light bi-box-arrow-up"></i>
      </v-button>
      <v-button @click="deletePhotos" :disabled="!selected.length">
        <i class="bi bi-light bi-trash3"></i>
      </v-button>
    </div>
  </teleport>
  <div class="wrapper" ref="container">
    <items-grid>
      <photo-thumbnail
        v-for="photo in photos.slice().reverse()"
        :photo_id="photo.id"
        :key="photo.id"
        v-selectable:[photo.id]="{
          getItems: getPhotoIds,
          setSelection: setSelection,
          getSelection: getSelection,
        }"
        :class="{ selected: selected.includes(photo.id) }"
        @dblclick="openPhoto(photo.id)"
      />
    </items-grid>
    <photo-stats ref="stats" />
    <input
    @input="submitPhotos"
    id="fileUpload"
    type="file"
    ref="fileUpload"
    accept="image/png, image/jpeg"
    hidden
  />
  </div>
</template>
<script lang="ts">
import PhotoThumbnail from "@/components/PhotoThumbnail.vue";
import VButton from "@/components/VButton.vue";
import Photo from "@/models/Photo";
import PhotoStats from "@/components/PhotoStats.vue";
import ZoomControl from "@/components/ZoomControl.vue";
import ItemsGrid from "@/components/ItemsGrid.vue";
import VSelectable from "@/components/VSelectable.vue";
import { defineComponent } from "vue";
import router from "@/router";
import axios from "axios";

export default defineComponent({
  components: {
    PhotoThumbnail,
    PhotoStats,
    ZoomControl,
    VButton,
    ItemsGrid,
    VSelectable,
  },
  data() {
    return {
      imgs: [],
      imageAdded: false,
      inputMessageText: "",
      loadingHandler: null as any,
      selected: [] as string[],
    };
  },
  mounted() {
    this.loadMore().then(() => {
      this.scrollToBottom();
    });
    this.scrollToBottom();
  },
  methods: {
    setSelection(selected: string[]) {
      this.selected = selected;
    },
    getSelection() {
      return this.selected;
    },
    getPhotoIds() {
      return this.photos?.map((photo: any) => photo.id);
    },
    loadMore() {
      return (this.loadingHandler = Photo.index(this.photoPage).then(() => {
        this.loadingHandler = null;
      }));
    },
    scrollToBottom() {
      this.$refs.container.parentElement.scrollTop =
        this.$refs.container.parentElement.scrollHeight;
    },
    openPhoto(id: string) {
      router.push("/photos/" + id);
    },
    choosePhotos() {
      document.getElementById("fileUpload")!.click();
    },
    submitPhotos() {
      Photo.upload(this.$refs.fileUpload.files[0])
      this.$refs.fileUpload.value = null
    },
    deletePhotos() {
      if (confirm("Are you sure you want to delete selected photos?")) {
        this.getSelection().forEach((photo: string) => {
          axios
            .delete("http://167.172.172.251/api/photos/" + photo)
            .then(() => {
              location.reload();
            });
        });
      }
    },
  },
  watch: {
    scrollTop(val) {
      console.log("scrolltop", val);
      if (val < 100 && this.loadingHandler == null) {
        console.log(this.photoPage);

        console.log("loading more");
        this.loadMore();
      }
    },
  },
  computed: {
    photos: () => Photo.query().orderBy("created_at", "desc").get(),
    zoom() {
      return Math.floor(this.$store.state.entities.photos.zoom);
    },
    photoPage() {
      return this.$store.state.entities.photos.page;
    },
    photoCount() {
      return this.$store.state.entities.photos.count;
    },
    scrollTop() {
      return this.$store.state.entities.photos.scrollTop;
    },
  },
});
</script>
<style scoped>
.grid {
  padding: 20px;
  display: grid;
  gap: 10px;
  transition: 0.5s ease-out;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
}
@media screen and (max-width: 768px) {
  .grid {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)) !important;
  }
}
.wrapper {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}
photo-stats {
  margin-top: auto;
}
</style>
