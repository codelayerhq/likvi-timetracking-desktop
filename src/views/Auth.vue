<template>
  <div class="flex flex-col items-center min-h-screen px-16 py-8 bg-white">
    <div class="flex flex-col items-center">
      <img src="@/assets/logo-font.svg" />

      <p class="px-5 mt-8 text-center text-brand-secondary-dark">
        {{ t("auth.welcomeText") }}
      </p>
    </div>

    <form
      v-if="!showOTP"
      action="#"
      method="POST"
      class="w-full max-w-md mx-auto mt-12"
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

      <div class="flex items-center w-full my-8 space-x-4">
        <div class="border-b flex-grow border-gray-100"></div>
        <span class="text-xs font-bold uppercase text-gray-400">
          {{ t("common.terms.or") }}
        </span>
        <div class="border-b flex-grow border-gray-100"></div>
      </div>

      <div class="flex flex-col space-y-4">
        <button
          type="button"
          class="inline-flex items-center justify-center space-x-1 text-sm font-normal focus:outline-none border-gray-20 text-gray-60 bg-white hover:border-gray-40 border rounded-lg focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-40 px-6 py-2 w-full"
          @click="handleOAuth('google')"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            class="mr-2"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M23.52 12.2728C23.52 11.4219 23.4436 10.6037 23.3018 9.81824H12V14.4601H18.4582C18.18 15.9601 17.3345 17.231 16.0636 18.0819V21.0928H19.9418C22.2109 19.0037 23.52 15.9273 23.52 12.2728Z"
              fill="#4285F4"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M12 23.9999C15.24 23.9999 17.9564 22.9254 19.9418 21.0926L16.0636 18.0817C14.9891 18.8017 13.6145 19.2272 12 19.2272C8.87455 19.2272 6.22909 17.1163 5.28546 14.2799H1.27637V17.389C3.25091 21.3108 7.30909 23.9999 12 23.9999Z"
              fill="#34A853"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M5.28545 14.2799C5.04545 13.5599 4.90909 12.7908 4.90909 11.9999C4.90909 11.209 5.04545 10.4399 5.28545 9.71993V6.61084H1.27636C0.463636 8.23084 0 10.0636 0 11.9999C0 13.9363 0.463636 15.769 1.27636 17.389L5.28545 14.2799Z"
              fill="#FBBC05"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M12 4.77273C13.7618 4.77273 15.3436 5.37818 16.5873 6.56727L20.0291 3.12545C17.9509 1.18909 15.2345 0 12 0C7.30909 0 3.25091 2.68909 1.27637 6.61091L5.28546 9.72C6.22909 6.88364 8.87455 4.77273 12 4.77273Z"
              fill="#EA4335"
            />
          </svg>

          {{
            t("common.texts.signUpWith", { service: t("common.terms.google") })
          }}
        </button>

        <button
          type="button"
          class="inline-flex items-center justify-center space-x-1 text-sm font-normal focus:outline-none border-gray-20 text-gray-60 bg-white hover:border-gray-40 border rounded-lg focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-40 px-6 py-2 w-full"
          @click="handleOAuth('apple')"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            class="mr-2"
          >
            <path
              d="M12.7563 5.53846C13.8074 5.53846 15.125 4.8061 15.9097 3.82962C16.6203 2.94469 17.1385 1.70884 17.1385 0.472981C17.1385 0.305149 17.1237 0.137317 17.0941 0C15.9245 0.0457724 14.518 0.808645 13.6742 1.8309C13.008 2.60903 12.401 3.82963 12.401 5.08074C12.401 5.26383 12.4306 5.44692 12.4454 5.50795C12.5194 5.5232 12.6379 5.53846 12.7563 5.53846ZM9.05512 24C10.4912 24 11.1278 23.0083 12.9191 23.0083C14.7401 23.0083 15.1398 23.9695 16.7388 23.9695C18.308 23.9695 19.3592 22.4743 20.3511 21.0095C21.4614 19.3312 21.9204 17.6834 21.95 17.6071C21.8464 17.5766 18.841 16.3102 18.841 12.7552C18.841 9.67324 21.2098 8.28481 21.343 8.178C19.7737 5.85887 17.3902 5.79784 16.7388 5.79784C14.977 5.79784 13.5409 6.89638 12.6379 6.89638C11.6607 6.89638 10.3727 5.85887 8.84785 5.85887C5.94613 5.85887 3 8.33058 3 12.9994C3 15.8983 4.09555 18.965 5.44277 20.9485C6.59754 22.6268 7.60426 24 9.05512 24Z"
              fill="black"
            />
          </svg>

          {{
            t("common.texts.signUpWith", { service: t("common.terms.apple") })
          }}
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

    function handleOAuth(provider: string) {
      if (window.ipcRenderer) {
        window.ipcRenderer.send("oAuth", provider);
      }
    }

    if (window.ipcRenderer) {
      window.ipcRenderer.on("oauth.login", async (_, token: string) => {
        const user = await store.dispatch(
          `auth/${ActionTypes.LOGIN_FROM_TOKEN}`,
          token
        );
        console.log(user);
        router.push({ name: "home" });
      });
    }

    return {
      ...useI18n(),
      email,
      password,
      otp,
      showOTP,
      handleLogin,
      handleOTPBack,
      handleOAuth,
    };
  },
});
</script>
