<template>
  <div v-if="visible" class="popup">
    <div class="popup-content">
      <h2>Secret Key: {{ secretKey }}</h2>
      <img :src="qrcodeUrl" alt="QR Code" />
      <button @click="closePopup">Close</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    secretKey: {
      type: String,
      required: true
    },
    qrcodeUrl: {
      type: String,
      required: true
    },
    visible: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    closePopup() {
      this.$emit('close-popup');
    }
  }
};
</script>

<style scoped>
.popup {
  position: fixed;
  z-index: 1000;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  background-color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  padding: 20px;
  border-radius: 10px;
}

.popup-content {
  text-align: center;
}
</style>