<template>
  <div>
    <form @submit.prevent="submitForm">
      <div>
        <label for="username">Username:</label>
        <input type="text" id="username" v-model="username" required />
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <div>
        <label for="totp">TOTP:</label>
        <input type="text" id="totp" v-model="totp" required />
      </div>
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: '',
      totp: ''
    };
  },
  methods: {
    async submitForm() {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: this.username,
          password: this.password,
          totp: this.totp
        })
      });

      const data = await response.json();
      if (data.success) {
        this.$emit('login-success', data);
      } else {
        alert('Login failed');
      }
    }
  }
};
</script>