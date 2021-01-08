<template lang="pug">
  v-dialog(v-model="show_dialog_" max-width="500" @click:outside="closeModal()" @keydown.esc="closeModal()")
    v-card
      v-card-title {{ dialog_text.title }}
      v-card-text(v-html="dialog_text.text")
      v-card-actions
        v-btn(
          text
          @click="agree(false)") Cancel
        v-spacer
        v-btn(
          color="error"
          text
          @click="agree(true)") Continue
</template>

<script lang="ts">
import Vue from 'vue';
import {Component, Prop, Watch} from 'vue-property-decorator';
import ConfirmTextEntity from '@/core/entities/ConfirmText.entity';

@Component({
  name: 'ConfirmModalComponent'
})
export default class ConfirmModalComponent extends Vue {
  @Prop() show_dialog: boolean | any;
  @Prop() dialog_text: ConfirmTextEntity | any;

  public show_dialog_: boolean = false;

  @Watch('show_dialog', {immediate: true})
  show_flag_changed(val: boolean, oldVal: boolean) {
    this.show_dialog_ = val;
  }

  public closeModal() {
    this.show_dialog_ = false;
    this.$emit('close', this.show_dialog_);
  }

  public agree(flag: boolean) {
    this.$emit('agree', flag);
    this.closeModal();
  }
}
</script>
