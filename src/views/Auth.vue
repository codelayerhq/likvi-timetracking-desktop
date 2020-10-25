<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen px-4 py-6 bg-gradient-to-b from-brand to-brand-light"
  >
    <img src="@/assets/logo-font.svg" class="mb-20" />
    <form
      v-if="!showOTP"
      action="#"
      method="POST"
      class="w-full max-w-md"
      @submit.prevent="handleLogin"
    >
      <div class="rounded-md shadow-sm">
        <div>
          <input
            v-model="email"
            :aria-label="t('auth.email')"
            name="email"
            type="email"
            required
            class="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-none appearance-none rounded-t-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5"
            :placeholder="t('auth.email')"
          />
        </div>
        <div class="-mt-px">
          <input
            v-model="password"
            :aria-label="t('auth.password')"
            name="password"
            type="password"
            required
            class="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-none appearance-none rounded-b-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5"
            :placeholder="t('auth.password')"
          />
        </div>
      </div>

      <div class="mt-6">
        <base-button type="submit" color="brand-secondary">
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
          {{ t("auth.signIn") }}
        </base-button>
      </div>
    </form>

    <form
      v-else
      action="#"
      method="POST"
      class="w-full max-w-md"
      @submit.prevent="handleLogin"
    >
      <div class="rounded-md shadow-sm">
        <div>
          <input
            v-model="otp"
            :aria-label="t('auth.otp')"
            name="otp"
            type="text"
            inputmode="numeric"
            pattern="[0-9]*"
            autocomplete="one-time-code"
            :placeholder="t('auth.otp')"
            class="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded appearance-none focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5"
            required
          />
        </div>
      </div>

      <div class="flex items-center justify-end mt-6">
        <div class="text-sm leading-5">
          <a
            href="#"
            class="font-medium transition duration-150 ease-in-out text-brand hover:text-brand-light focus:outline-none focus:underline"
            @click="handleOTPBack"
          >
            {{ t("auth.back") }}
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
          {{ t("auth.signIn") }}
        </base-button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { RootState } from "@/store";
import { ActionTypes } from "@/store/actions";
import { LoginResult } from "@/store/modules/auth";
import { POSITION, useToast } from "vue-toastification";
import { useI18n } from "vue-i18n";

export default defineComponent({
  name: "Auth",
  setup() {
    const { t } = useI18n();

    const email = ref(null);
    const password = ref(null);
    const otp = ref(null);
    const showOTP = ref(false);

    const store = useStore<RootState>();
    const router = useRouter();

    const toast = useToast();

    async function handleLogin() {
      const result: LoginResult = await store.dispatch(
        `auth/${ActionTypes.LOGIN}`,
        {
          email: email.value,
          password: password.value,
          otp: otp.value,
        }
      );

      switch (result.result) {
        case "ok":
          router.push({ name: "home" });
          break;
        case "2fa":
          showOTPForm();
          break;
        default:
          toast.error(t("auth.loginFailed"), {
            timeout: 5000,
            position: POSITION.TOP_CENTER,
          });
          break;
      }
    }

    function showOTPForm() {
      showOTP.value = true;
    }

    function reset() {
      email.value = null;
      password.value = null;
      otp.value = null;
      showOTP.value = false;
    }

    function handleOTPBack() {
      reset();
    }

    return {
      ...useI18n(),
      email,
      password,
      otp,
      showOTP,
      handleLogin,
      handleOTPBack,
    };
  },
});
</script>
