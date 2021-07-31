<template>
  <button class="btn" @click="$emit('myClick')">
    {{ label }}
  </button>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      required: true,
    },
  },
};
</script>
