<template>
  <div id="app">
    <LoginForm @login-success="handleLoginSuccess" />
    <Popup
      v-if="showPopup"
      :secretKey="secretKey"
      :qrcodeUrl="qrcodeUrl"
      :visible="showPopup"
      @close-popup="showPopup = false"
    />
  </div>
</template>

<script>
import LoginForm from './components/LoginForm.vue';
import Popup from './components/Popup.vue';

export default {
  components: {
    LoginForm,
    Popup
  },
  data() {
    return {
      showPopup: false,
      secretKey: '',
      qrcodeUrl: ''
    };
  },
  methods: {
    handleLoginSuccess(data) {
      this.secretKey = data.secretKey;
      this.qrcodeUrl = data.qrcodeUrl;
      this.showPopup = true;
    }
  }
};
</script>