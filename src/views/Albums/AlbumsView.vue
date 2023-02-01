<template>
  <teleport to="#toolbar">
    <zoom-control />
    <div class="headerChild">
      <v-button @click="create">
        <i class="bi bi-light bi-folder-plus"></i>
      </v-button>
      <v-button :disabled="selected.length == 0" @click="deleteAlbums">
        <i class="bi bi-light bi-trash3"></i>
      </v-button>
    </div>
  </teleport>
  <div class="wrapper">
    <items-grid>
      <album-thumbnail
        @dblclick="openAlbum(folder)"
        v-for="folder in folders"
        :id="folder.id"
        :folder_id="folder.id"
        ref="items"
        v-selectable:[folder.id]="{
          getItems: getFolderIds,
          setSelection: setSelection,
          getSelection: getSelection,
          isEnabled: () => true
        }"
        :class="{ selected: selected.includes(folder.id) }"
      />
    </items-grid>
  </div>
</template>
<script lang="ts">
import Folder from '@/models/Folder'
import AlbumThumbnail from '@/components/AlbumThumbnail.vue'
import ZoomControl from '@/components/ZoomControl.vue'
import VButton from '@/components/VButton.vue'
import VSelectable from '@/components/VSelectable.vue'
import ItemsGrid from '@/components/ItemsGrid.vue'
import ConfirmDialog from '@/components/Modals/ConfirmDialog.vue'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AlbumsView',
  components: {
    AlbumThumbnail,
    ZoomControl,
    VButton,
    VSelectable,
    ItemsGrid
  },
  mounted() {
    Folder.index()
  },
  data() {
    return {
      selected: [] as string[]
    }
  },
  computed: {
    folders() {
      return Folder.all()
    },
    zoom() {
      return Math.trunc(this.$store.state.entities.photos.zoom)
    }
  },
  methods: {
    openAlbum(folder: Folder) {
      console.log('open')

      this.$router.push({ name: 'album', params: { id: folder.id } })
    },
    getFolderIds() {
      return this.folders.map((folder) => folder.id)
    },
    setSelection(ids: string[]) {
      this.selected = ids
    },
    getSelection() {
      return this.selected
    },
    create() {
      Folder.insert({ data: { name: 'New Folder' } })
      this.$nextTick(() => {
        this.$refs.items[this.$refs.items.length - 1].rename()
      })
    },
    deleteAlbums() {
      this.$modal
        .show(ConfirmDialog, {
          props: {
            title: `Are you sure you want to delete album${
              this.selected.length > 1 ? 's' : ''
            } permanently?`,
            message: 'This action cannot be undone.',
            confirmText: 'Delete',
            dismissText: 'Cancel',
            ctaButton: 'success'
          }
        })
        .then((value) => {
          if (value) {
            this.getSelection().forEach((album) => {
              Folder.destroy(album)
            })
            this.setSelection([])
          }
        })
    }
  }
})
</script>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  overflow-y: auto;
  z-index: 2;
}
photo-stats {
  margin-top: auto;
}

.headerChild {
  display: flex;
  flex-direction: row;
}

.popDeleteContainer {
  padding-top: 2%;
}
.popDeleteButtons {
  padding: 2%;
}
.popDeleteButton {
  width: 48%;
  margin: 1%;
  padding: 1.5%;
  border-radius: 10px;
  border: 0px;
}
#popDeleteYes {
  background-color: #171717;
  color: #eeeeee;
}
#popDeleteCancel {
  background-color: #171717;
  color: #eeeeee;
}

.popFoldersMessage {
  padding-top: 2%;
}
.popFolders {
  border: #171717 solid 1px;
  border-radius: 5px;
  height: 30vh;
}

.overlay {
  opacity: 1;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1;
  height: 100%;
  width: 100%;
  overflow: hidden;
  background-color: rgba(21, 21, 21, 1);
}

.overlay .navigate {
  position: absolute;
  height: calc(100% - 100px);
  top: 0;
  margin: 0;
  transition: opacity 150ms ease;
  opacity: 0;
  display: flex;
  align-items: center;
  z-index: 999;
  padding: 0 10px;
}

.overlay .navigate:hover {
  opacity: 1;
}

.overlay .navigate-left {
  left: 0;
}
.overlay .navigate-right {
  right: 0;
}

.overlay .navigate button {
  padding: 6px 8px;
  border-radius: 3px;
  margin: 0 10px;
}
.overlay .navigate:hover button {
  background-color: rgba(21, 21, 21, 0.8);
}

.photo-navigator {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  transform: translateY(0);
  height: 100px;
  background-color: rgba(98, 98, 98, 1);
}

.photo-navigator > i {
  position: fixed;
  display: block;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
}

.photos-list {
  display: flex;
  overflow: auto;
  height: 100%;
  padding: 10px 0;
}

.photos-list::-webkit-scrollbar {
  height: 3px;
}
.photos-container {
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: flex-end;
  padding: 0 calc(50% - 25px);
  gap: 5px;
}
.photos-container > div {
  height: 90%;
  width: 50px;
}

.photos-container > div > img {
  height: 100%;
  width: 100%;
  object-fit: cover;
}

.slide-navigator-enter-active img,
.slide-navigator-leave-active img {
  filter: blur(2px);
}
</style>
