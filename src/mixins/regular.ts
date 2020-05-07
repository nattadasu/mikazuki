import { Component, Vue } from 'vue-property-decorator';

@Component
export default class RegularFunctionsMixin extends Vue {
  get isMobile(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  get darkMode(): boolean {
    return this.$vuetify.theme.dark;
  }
}
