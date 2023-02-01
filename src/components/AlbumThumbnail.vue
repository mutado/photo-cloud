<template>
  <div class="album">
    <picture class="skeleton" :class="{ stop: !loading }">
      <svg
        v-if="!photo || !photo.thumbnail_loaded"
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        class="bi bi-collection"
        viewBox="0 0 16 16"
      >
        <path
          d="M2.5 3.5a.5.5 0 0 1 0-1h11a.5.5 0 0 1 0 1h-11zm2-2a.5.5 0 0 1 0-1h7a.5.5 0 0 1 0 1h-7zM0 13a1.5 1.5 0 0 0 1.5 1.5h13A1.5 1.5 0 0 0 16 13V6a1.5 1.5 0 0 0-1.5-1.5h-13A1.5 1.5 0 0 0 0 6v7zm1.5.5A.5.5 0 0 1 1 13V6a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-13z"
        />
      </svg>
      <img v-else :src="photo?.thumbnail" @load="loading = false" />
    </picture>
    <div class="cut-text" v-if="!edit" @click="rename">
      {{ folder ? folder.name : name }}
    </div>
    <div class="cut-text" v-else>
      <input
        ref="nameEdit"
        type="text"
        v-model="folder.name"
        @blur="save"
        @keydown.enter="save"
      />
    </div>
    <small class="color-tertiary">{{ folder?.photos_count }}</small>
  </div>
</template>
<script lang="ts">
import Folder from '@/models/Folder'
import Photo from '@/models/Photo'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AlbumThumbnail',
  props: {
    folder_id: {
      type: String
    },
    name: {
      type: String
    }
  },
  data() {
    return {
      loading: true,
      edit: false
    }
  },
  mounted() {
    if (this.folder?.photo_references.length! > 0 && !this.photo) {
      Photo.show(this.folder?.photo_references[0].photo_id!).then(() => {
        this.photo?.thumbnail
      })
    } else {
      console.log('no photo')

      this.loading = false
    }
  },
  computed: {
    folder() {
      if (this.folder_id) {
        return Folder.query().withAllRecursive().find(this.folder_id)
      } else {
        return null
      }
    },
    photo() {
      return Photo.find(this.folder?.photo_references[0]?.photo_id ?? '')
    },
    zoom() {
      return this.$store.state.entities.photos.zoom
    }
  },
  methods: {
    rename() {
      this.edit = true
      this.$nextTick(() => {
        this.$refs.nameEdit.focus()
      })
    },
    save() {
      if (!this.folder_id) return
      this.edit = false
      if (!this.folder) return
      if (this.folder.name === '') {
        this.folder.name = 'Untitled'
      }
      if (this.folder.user_id === null)
        Folder.post({
          name: this.folder.name
        }).then((response) => {
          this.folder?.$delete()
        })
      else
        Folder.put(this.folder_id, {
          name: this.folder.name
        })
    }
  }
})
</script>
<style scoped>
.album {
  padding: 3px;
}
.skeleton {
  aspect-ratio: 1/1;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.album.selected .skeleton {
  outline: 3px solid #2679fb !important;
}
.skeleton svg {
  width: 50%;
  height: 50%;
  fill: var(--color-tertiary);
}
.skeleton img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  background-color: gray;
  border-radius: inherit;
}
.album {
  text-align: center;
  overflow: hidden;
  margin-bottom: 15px;
}
small {
  font-weight: 100;
}
.cut-text {
  margin-top: 15px;
  width: 100%;
}

input {
  height: 23px;
  width: 100%;
  text-align: center;
  background: transparent;
  color: white;
  outline: 3px solid #2679fb;
}
</style>
