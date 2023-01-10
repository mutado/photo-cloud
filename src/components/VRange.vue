<template>
  <div class="wrapper">
    <v-button @click="updateValue(Math.trunc(modelValue) - 0.5)">
      <i class="bi bi-light bi-dash" />
    </v-button>
    <input
      type="range"
      :value="modelValue"
      @input="updateValue($event?.target?.value)"
      :min="min"
      :max="max"
      :step="step"
    />
    <v-button @click="updateValue(Math.trunc(modelValue) + 1.5)">
      <i class="bi bi-light bi-plus" />
    </v-button>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import VButton from './VButton.vue'

export default defineComponent({
  name: 'VRange',
  components: {
    VButton
  },
  events: ['update:modelValue'],
  props: {
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 100
    },
    step: {
      type: Number,
      default: 1
    },
    modelValue: {
      type: Number,
      default: 0
    }
  },
  methods: {
    updateValue(value: any) {
      if (value > this.max) {
        value = this.max
      } else if (value < this.min) {
        value = this.min
      }
      this.$emit('update:modelValue', +value)
    }
  }
})
</script>
<style scoped>
.wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
}
button {
  padding: 0;
  margin: 0;
}
input {
  -webkit-appearance: none;
  background-color: #cccccc;
  outline: none;
  height: 3px;
}
input::-webkit-slider-thumb {
  -webkit-appearance: none;
  background: rgba(98, 98, 98, 1);
  border: #cccccc solid 1px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  cursor: pointer;
}
</style>
