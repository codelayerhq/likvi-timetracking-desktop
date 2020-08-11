<template>
  <div class="flex items-center justify-center min-h-screen min-w-screen">
    Logged in
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters } from "vuex";

export default defineComponent({
  name: "Home",
  computed: {
    ...mapGetters("auth", ["user"]),
  },
});
</script>
