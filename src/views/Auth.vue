<template>
  <div
    class="flex flex-col items-center min-h-screen px-16 pt-20 pb-12 bg-white"
  >
    <div class="flex flex-col items-center">
      <img src="@/assets/logo-font.svg" />

      <p class="px-5 mt-12 text-center text-brand-secondary-dark">
        {{ t("auth.welcomeText") }}
      </p>
    </div>

    <form
      v-if="!showOTP"
      action="#"
      method="POST"
      class="w-full max-w-md mx-auto mt-16"
      @submit.prevent="handleLogin"
    >
      <input
        v-model="email"
        v-focus
        :aria-label="t('auth.email')"
        name="email"
        type="email"
        class="bg-gray-100 text-input"
        required
        :placeholder="t('auth.email')"
      />

      <input
        v-model="password"
        :aria-label="t('auth.password')"
        name="password"
        type="password"
        class="mt-3 bg-gray-100 text-input"
        required
        :placeholder="t('auth.password')"
      />

      <div class="flex pl-6 mt-6 space-x-2">
        <a href="https://app.likvi.de/forgot" target="_blank" class="btn-flat">
          {{ t("auth.forgotPassword") }}
        </a>
        <button type="submit" class="btn-secondary">
          {{ t("auth.signIn") }}
        </button>
      </div>
    </form>

    <form
      v-else
      action="#"
      method="POST"
      class="w-full max-w-md mx-auto mt-16"
      @submit.prevent="handleLogin"
    >
      <div class="rounded-md shadow-sm">
        <div>
          <input
            v-model="otp"
            v-focus
            :aria-label="t('auth.otp')"
            name="otp"
            type="text"
            inputmode="numeric"
            pattern="[0-9]*"
            autocomplete="one-time-code"
            :placeholder="t('auth.otp')"
            class="relative block w-full px-3 py-3 mt-3 text-gray-900 placeholder-gray-600 border border-transparent rounded-md appearance-none focus:outline-none focus:ring-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5"
            style="background-color: #f2f2f2"
            required
          />
        </div>
      </div>

      <div class="flex pl-6 mt-6 space-x-2">
        <a
          href="#"
          class="px-2 py-3 mr-4 text-sm"
          @click.prevent="handleOTPBack"
        >
          {{ t("auth.back") }}
        </a>
        <button type="submit" class="btn-secondary">
          {{ t("auth.signIn") }}
        </button>
      </div>
    </form>

    <footer class="flex flex-col items-center mt-auto">
      <img src="@/assets/padlock.svg" />
      <p class="mt-4 text-xs text-center text-gray-900">
        {{ t("auth.securityText") }}
      </p>
    </footer>
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
            position: POSITION.TOP_CENTER,
            hideProgressBar: true,
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
