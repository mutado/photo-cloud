<template>
  <header>
    <div class="logo">
      <img src="@/assets/logo@1x.svg" alt="logo" />
      <h1>PhotoCloud</h1>
    </div>
    <div class="buttons">
      <div class="render">
        <v-button>
          <i
            v-if="aspectRatio"
            @click="aspectRatio = false"
            class="bi bi-light bi-arrows-angle-contract"
          ></i>
          <i
            v-else
            @click="aspectRatio = true"
            class="bi bi-light bi-arrows-angle-expand"
          ></i>
        </v-button>
        <v-range v-model="zoom" :min="3" :max="9" :step="0.1" />
      </div>
      <div class="sidebar-toggle">
        <v-button @click="sidebar = !sidebar">
          <i class="bi bi-light bi-layout-sidebar"></i>
        </v-button>
      </div>
      <div class="headerChild">
        <v-button :to="'/about'">
          <i class="bi bi-light bi-cloud-upload"></i>
        </v-button>
        <v-button>
          <i class="bi bi-light bi-folder-plus"></i>
        </v-button>
        <v-button>
          <i class="bi bi-light bi-heart"></i>
        </v-button>
        <v-button>
          <i class="bi bi-light bi-box-arrow-up"></i>
        </v-button>
        <v-button :to="'/delete'">
          <i class="bi bi-light bi-trash3"></i>
        </v-button>
      </div>
    </div>
  </header>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import VRange from '@/components/VRange.vue'
import VButton from '@/components/VButton.vue'
import Photo from '@/models/Photo'

export default defineComponent({
  name: 'AppHeader',
  components: {
    VRange,
    VButton
  },
  computed: {
    zoom: {
      get() {
        return this.$store.state.entities.photos.zoom
      },
      set(value) {
        let r = Math.round(value)
        if (r != this.zoom)
          Photo.commit((state) => {
            state.zoom = value
          })
      }
    },
    sidebar: {
      get() {
        return this.$store.state.entities.photos.sidebar
      },
      set(value) {
        Photo.commit((state) => {
          state.sidebar = value
        })
      }
    },
    aspectRatio: {
      get() {
        return this.$store.state.entities.photos.center_image
      },
      set(value) {
        Photo.commit((state) => {
          state.center_image = value
        })
      }
    }
  }
})
</script>
<style scoped>
header {
  display: grid;
  grid-template-columns: 227px 4fr;
  overflow: hidden;
}
.logo {
  background-color: rgba(21, 21, 21, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 7px 24px;
}
.sidebar-toggle {
  display: none;
}
.logo > img {
  height: 37px;
}
.logo > h1 {
  font-size: 26px;
  font-weight: 500;
  font-family: Arial, Helvetica, sans-serif;
  color: #fff;
  margin: 0;
  margin-left: 5px;
  display: inline-block;
  vertical-align: middle;
}
.buttons {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: rgba(98, 98, 98, 0.9);
  padding: 7px 24px;
}
.buttons .render {
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}
.headerChild {
  display: flex;
  align-items: center;
  gap: 10px;
}
@media screen and (max-width: 768px) {
  header {
    grid-template-columns: 1fr;
  }
  .logo {
    padding: 7px 10px;
  }
  .render {
    display: none !important;
  }
  .buttons {
    padding: 7px 10px;
  }
  .sidebar-toggle {
    display: block;
  }
}
</style>
