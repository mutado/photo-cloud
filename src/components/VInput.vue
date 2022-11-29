<template>
  <div>
    <label :for="id">{{ label }}</label>
    <input
      :id="id"
      :type="type"
      :placeholder="placeholder"
      :value="modelValue"
      :required="required"
      @input="updateValue"
    />
    <small v-if="error != ''">{{ error }}</small>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { v4 as uuidv4 } from 'uuid'
export default defineComponent({
  name: 'VInput',
  emits: ['update:modelValue'],
  props: {
    required: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      required: true
    },
    modelValue: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'text'
    },
    placeholder: {
      type: String,
      default: ''
    },
    error: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      id: uuidv4()
    }
  },
  methods: {
    updateValue(e: Event) {
      this.$emit('update:modelValue', (e.target as HTMLInputElement).value)
    }
  }
})
</script>
