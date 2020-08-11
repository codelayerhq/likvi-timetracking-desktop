---
to: "src/components/<%= h.changeCase.kebab(name).toLowerCase().slice(0, 5) === 'base-' ? '_' : '' %><%= name %>.vue"
---
<template>
  <div />
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "<%= name %>",
});
</script>
