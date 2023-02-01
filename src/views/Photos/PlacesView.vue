<template>
  <teleport to="#toolbar">
    <zoom-control />
  </teleport>
  <h2>Countries</h2>
  <items-grid>
    <album-thumbnail
      v-for="place in places.countries"
      :name="place.country"
      ref="items"
      @dbclick="openPlace(place)"
    />
  </items-grid>
  <h2>Cities</h2>
  <items-grid>
    <album-thumbnail
      v-for="place in places.cities"
      :name="place.city"
      ref="items"
      @dbclick="openPlace(place)"
    />
  </items-grid>
</template>
<script lang="ts">
import Folder from '@/models/Folder'
import AlbumThumbnail from '@/components/AlbumThumbnail.vue'
import ZoomControl from '@/components/ZoomControl.vue'
import VButton from '@/components/VButton.vue'
import VSelectable from '@/components/VSelectable.vue'
import ItemsGrid from '@/components/ItemsGrid.vue'
import { defineComponent } from 'vue'
import axios from 'axios'

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
    axios.get(process.env.VUE_APP_BASE_URL + '/api/places').then((response) => {
      this.places = response.data
      console.log(this.places)
    })
  },
  data() {
    return {
      selected: [] as string[],
      places: [] as any[]
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
      this.getSelection().forEach((album) => {
        Folder.destroy(album)
      })
    },
    openPlace(place: any) {
      this.$router.push({ name: 'place', params: { id: place.id } })
    }
  }
})
</script>

<style>
.headerChild {
  display: flex;
  flex-direction: row;
}
.popperContainer {
  padding-top: 2%;
}
.popperButtons {
  padding: 2%;
}
.popperButton {
  width: 48%;
  margin: 1%;
  padding: 1.5%;
  border-radius: 10px;
  border: 0px;
}
#yes {
  background-color: #171717;
  color: #eeeeee;
}
#cancel {
  background-color: #171717;
  color: #eeeeee;
}
h2 {
  padding-left: 20px;
  border-bottom: 1px solid;
}
</style>
