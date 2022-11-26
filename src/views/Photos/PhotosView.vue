<template>
  <button @click="add">add</button>
  <p>{{ text }}</p>
</template>
<script>
export default {
  data() {
    return {
      text: 'Hello World'
    }
  },
  methods: {
    add() {
      this.text +=
        'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Officiis quas harum nulla corrupti, sunt earum enim neque voluptatibus praesentium, beatae libero dolorem perspiciatis consequatur doloremque accusantium ullam deserunt laborum optio!'
    }
  }
}
</script>
