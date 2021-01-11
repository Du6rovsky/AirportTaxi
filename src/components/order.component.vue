<template lang="pug">
  v-container#orders
    v-row(justify="center")
      v-col.col(cols="12" sm="12" md="10")
        v-card.elevation-12
          v-toolbar(color="primary" dark flat height="45" dense)
            img.mr-3.shrink.hidden-sm-and-down(:src="require('../assets/logo.png')" height="40")
            v-toolbar-title
              span Taxi order
            .flex-grow-1
          v-card-text
            v-form(ref="orderFormRef"
              v-model="formIsValid"
              lazy-validation
              @submit.prevent)

              v-row(justify="center")
                v-col.col(cols="12" sm="12" md="6")
                  v-text-field(
                    label="Full name"
                    name="login"
                    prepend-icon="fa-address-card"
                    type="text"
                    id="name"
                    minlength="3"
                    maxlength="25"
                    :rules="requiredRules"
                    v-model="form.name"
                    @keydown.enter="elementFocus('phone')"
                    required)

                v-col.col(cols="12" sm="12" md="6")
                  v-text-field(
                    type="text"
                    prepend-icon="fa-mobile-alt"
                    :rules="phoneRules"
                    v-mask="[...phoneMask]"
                    minlength="19"
                    id="phone"
                    label="Phone"
                    name="phone"
                    v-model="form.phone"
                    required)

              v-row(justify="center")
                v-col.col(cols="12" sm="12" md="6")
                  v-menu(
                    ref="datePickerIsOpen"
                    v-model="datePickerIsOpen"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y)
                    template(v-slot:activator="{ on, attrs }")
                      v-text-field(
                        v-model="form.date"
                        label="Date"
                        prepend-icon="fa-calendar"
                        readonly
                        :rules="requiredRules"
                        v-bind="attrs"
                        v-on="on")
                    v-date-picker(
                      v-model="form.date"
                      @input="datePickerIsOpen = false"
                      no-title )
                v-col.col(cols="12" sm="12" md="6")
                  v-select(
                    prepend-icon="fa-plane-arrival"
                    v-model="form.airport"
                    :items="airports"
                    :rules="requiredRules"
                    label="Airport"
                    @change="airportChanged($event)"
                    required)

              v-row(justify="center")
                v-col.col(cols="12" sm="12" md="6")
                  v-text-field(
                    id="flightNumber"
                    prepend-icon="fa-plane"
                    v-model="form.flightNumber"
                    label="Flight number"
                    minlength="4"
                    maxlength="4"
                    :rules="flightNumberRules"
                    @keypress="numberPattern($event)"
                    required)
                v-col.col(cols="12" sm="12" md="6")
                  v-select(
                    v-if="terminalsIsShow"
                    prepend-icon="fa-hotel"
                    v-model="form.terminal"
                    :items="terminals"
                    label="Terminal"
                    required)
          v-card-actions
            v-btn(color="error"
              depressed
              small
              @click="resetForm()") Reset
            v-spacer
            v-btn(color="success"
              depressed
              small
              @click="submitForm()")  Go

        table-component.mt-5(
          v-bind:headers="headers"
          v-bind:rows="orders")
          template(v-slot="row")
            v-btn(small
            color="error"
              @click="openConfirmModal(row)")
              v-icon fa-trash-alt

        confirm-modal-component(
          v-if="show_modal"
          :show_dialog="show_modal"
          :dialog_text="confirm_text"
          @close="closeDialog()"
          @agree="agreeDialog($event)")
    v-snackbar(v-model="snackBarIsShow")
      span Order is successfully created! Achievement received - link to
      a.ml-1.mr-5(href="https://www.unbiased.co.uk/" target="_blank") Unbiased
      v-btn(color="error" text @click="closeSnackbar()") Close
</template>

<script lang="ts">

import {Component, Vue} from 'vue-property-decorator';
import OrderEntity from "@/core/entities/Order.entity";
import TableComponent from "@/shared/partials/table/table.component.vue";
import {orderService} from "@/services/order.service";
import HeaderEntity from "@/core/entities/Header.entity";
import ConfirmTextEntity from "@/core/entities/ConfirmText.entity";
import ConfirmModalComponent from "@/shared/partials/modals/confirm-modal.component.vue";

@Component({
  name: "OrderComponent",
  components: {
    TableComponent,
    ConfirmModalComponent
  }
})
export default class OrderComponent extends Vue {
  public formIsValid: boolean = true;
  public datePickerIsOpen: boolean = false;
  public terminalsIsShow: boolean = false;
  public snackBarIsShow: boolean = false;
  public show_modal: boolean = false;
  public remove_item: any = null;
  public confirm_text: ConfirmTextEntity = new ConfirmTextEntity();
  public date: string = new Date().toISOString().substr(0, 10);
  public phoneMask: string = "+44 (###) ###-##-##";
  public form: OrderEntity = new OrderEntity();
  public orders: OrderEntity[] = [];
  public headers: HeaderEntity[] = [];
  public airports: string[] = ["Heathrow", "Gatwick"];
  public terminals: string[] = ["1", "2", "3", "4", "not sure"]
  public phoneRules = [
    (v: string) => {
      let text = '';
      if (!v) {
        text = "Required field";
      } else if (v.length < 19) {
        text = "Length less than necessary";
      }
      return text || true;
    }
  ];
  public flightNumberRules = [
    (v: string) => {
      let text = '';
      if (!v) {
        text = "Required field";
      } else if (v.length < 4) {
        text = "Length less than necessary";
      }
      return text || true;
    }
  ];
  public requiredRules = [
    (v: string) => !!v || "Required field"
  ];
  public selectRules = [
    (v: string) => {
      let text = '';
      if (v.length === 0) {
        text = "Required field"
      }
      return text || true;
    }
  ];

  created() {
    this.prepareTableCfg();
    const orders_cached = localStorage.getItem('orders');
    if (orders_cached) {
      this.orders = [...JSON.parse(orders_cached)];
    }
  }

  public elementFocus(field: string) {
    const el = document.getElementById(field);
    if (el) {
      el.focus();
    }
  }

  public numberPattern(event: KeyboardEvent) {
    const regex: RegExp = /^[0-9]*$/;
    const key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (!regex.test(key)) {
      event.preventDefault();
      return false;
    }
  }

  public resetForm() {
    // eslint-disable-next-line
    const form: any = this.$refs.orderFormRef;
    form.reset();
    form.resetValidation();
  }

  public submitForm() {
    // eslint-disable-next-line
    const form: any = this.$refs.orderFormRef;
    if (form.validate()) {
      orderService.createOrder(this.form).then((res: any) => {
        this.resetForm();
        this.snackBarIsShow = true;
        if (res && res.data) {
          this.orders.push(res.data);
          localStorage.setItem('orders', JSON.stringify(this.orders));
        }
      });
    }
  }

  public airportChanged(value: string) {
    if (value === "Heathrow") {
      this.form.terminal = "not sure";
      this.terminalsIsShow = true;
    } else {
      this.form.terminal = '';
      this.terminalsIsShow = false;
    }
  }

  public openConfirmModal(data: { item: OrderEntity, index: number, col: HeaderEntity }) {
    this.remove_item = data;
    this.confirm_text.title = 'Order cancel';
    this.confirm_text.text = `Are you sure you want to cancel order with ID ${data.item.id}?`;
    this.show_modal = true;
  }

  public agreeDialog(flag: boolean) {
    if (flag) {
      this.removeOrder()
    }
  }

  public closeDialog() {
    this.show_modal = false;
    this.remove_item = null;
    this.confirm_text = new ConfirmTextEntity();
  }

  public closeSnackbar() {
    this.snackBarIsShow = false;
  }

  public removeOrder() {
    this.orders.splice(this.remove_item.index, 1);
    localStorage.setItem('orders', JSON.stringify(this.orders));
  }

  public prepareTableCfg() {
    const idCol = new HeaderEntity('Order ID', 'start', true, 'id');
    const nameCol = new HeaderEntity('Name', 'start', true, 'name');
    const phoneCol = new HeaderEntity('Phone', 'start', true, 'phone');
    const dateCol = new HeaderEntity('Date', 'start', true, 'date');
    const airportCol = new HeaderEntity('Airport', 'start', true, 'airport');
    const terminalCol = new HeaderEntity('Terminal №', 'start', true, 'terminal');
    const flightNumberCol = new HeaderEntity('Flight №', 'start', true, 'flightNumber');
    const controlCol = new HeaderEntity('', 'center', false, '', 'container');

    this.headers.push(
        idCol, nameCol, phoneCol, dateCol, airportCol, terminalCol, flightNumberCol, controlCol
    )
  }
}
</script>

<style lang="scss">
</style>
