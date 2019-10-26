<template>
  <notifications classes="zerotwo-notifications" position="top center" />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class ZeroTwoNotifications extends Vue {}
</script>

<style lang="scss">
.zerotwo-notifications {
  padding: 10px;
  margin: 0 5px 5px;
  font-size: 15px;
  color: #ffffff;
  background: #44a4fc !important;
  border-left: 5px solid #187fe7;

  .notification-title {
    font-size: 20px;
  }

  &.warn {
    background: #ffb648 !important;
    border-left-color: #f48a06;
  }

  &.error {
    background: #e54d42 !important;
    border-left-color: #b82e24;
  }

  &.success {
    background: #68cd86 !important;
    border-left-color: #42a85f;
  }
}
</style>
