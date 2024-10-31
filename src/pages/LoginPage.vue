<template>
  <q-layout view="hHh lpR fFf" class="bg-login">
    <q-page-container>
      <q-page class="flex flex-center">
        <q-card class="login-card" raised>
          <q-card-section>
            <div class="text-h5 text-center q-mb-md">Karaoke PoS System</div>

            <q-input
              filled
              v-model="user.username"
              label="Username"
              type="username"
              dense
              class="q-mb-md"
              placeholder="Enter your username"
            />

            <q-input
              filled
              v-model="user.password"
              label="Password"
              type="password"
              dense
              class="q-mb-md"
              placeholder="Enter your password"
              @keyup.enter="login"
            />

            <q-btn
              label="Login"
              color="primary"
              @click="login"
              class="full-width"
              size="lg"
            />
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import { useUserStore } from 'src/stores/user-store';

export default {
  setup() {
    const router = useRouter();
    const user = ref({
      username: '',
      password: '',
    });

    const userStore = useUserStore();

    const login = async () => {
      try {
        Swal.fire({
          title: 'Processing...',
          text: 'Please wait.',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        await userStore.login(user.value.username, user.value.password);

        const userRole = await userStore.getUserRole;

        // Redirect based on role
        // if (userRole === 'admin') {

        if (userRole) {
          Swal.close();
          router.push('/admin');
        }
        // } else {
        //   Swal.close();
        //   router.push('/staff');
        // }

        Swal.close();
      } catch (error) {
        Swal.close();
        console.error('Error logging in: ', error);

        let errorMessage = 'Login failed. Please try again.';

        Swal.fire('Error', errorMessage, 'error');
        // Handle login errors (e.g., show a notification)
      }
    };

    return {
      user,
      login,
    };
  },
};
</script>

<style>
.bg-login {
  background-image: url('https://wallpapers.com/images/hd/karaoke-background-td0p34xmna8wjn61.jpg');
  background-size: cover;
  background-position: center;
}

.login-card {
  max-width: 400px;
  width: 90%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

@media (max-width: 600px) {
  .login-card {
    max-width: 350px;
  }
}
</style>
