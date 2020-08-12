<template>
  <div class="flex items-center justify-center min-h-screen px-4 py-6">
    <form
      action="#"
      method="POST"
      class="w-full max-w-md"
      @submit.prevent="handleLogin"
    >
      <div class="rounded-md shadow-sm">
        <div>
          <input
            v-model="email"
            aria-label="Email address"
            name="email"
            type="email"
            required
            class="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-none appearance-none rounded-t-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5"
            placeholder="Email address"
          />
        </div>
        <div class="-mt-px">
          <input
            v-model="password"
            aria-label="Password"
            name="password"
            type="password"
            required
            class="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-none appearance-none rounded-b-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5"
            placeholder="Password"
          />
        </div>
      </div>

      <div class="flex items-center justify-end mt-6">
        <div class="text-sm leading-5">
          <a
            href="#"
            class="font-medium transition duration-150 ease-in-out text-brand hover:text-brand-light focus:outline-none focus:underline"
          >
            Forgot your password?
          </a>
        </div>
      </div>

      <div class="mt-6">
        <base-button type="submit">
          <span class="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg
              class="w-5 h-5 text-white transition duration-150 ease-in-out"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clip-rule="evenodd"
              />
            </svg>
          </span>
          Sign in
        </base-button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "Auth",
  setup() {
    const email = ref(null);
    const password = ref(null);

    const store = useStore();
    const router = useRouter();

    async function handleLogin() {
      await store.dispatch("auth/login", {
        email: email.value,
        password: password.value,
      });

      router.push({ name: "home" });
    }

    return {
      email,
      password,
      handleLogin,
    };
  },
});
</script>
