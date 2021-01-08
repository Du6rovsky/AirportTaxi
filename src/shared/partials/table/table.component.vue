<template lang="pug">
  v-data-table(
    dense
    :headers="headers_"
    :items="rows_"
    :items-per-page="per_page_"
    class="elevation-1")
    template(v-slot:item="{ item, expand, isExpanded, index }")
      tr(v-if="!rows_.length" align="center")
        td(align="center" :colspan="headers_.length") No data
      tr(v-bind:key="index" v-if="rows_.length > 0")
        td(v-for="(col, cfg_index) in headers_" v-bind:key="cfg_index" :align="col.align")
          div(v-if="!col.type") {{ item[col.value] }}
          div(v-if="col.type === 'container'")
            slot(v-bind="{item: item, index, col}")
</template>

<script lang="ts">
import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
import HeaderEntity from "@/core/entities/Header.entity";

const per_page_const = 10;

@Component({
  name: "TableComponent"
})
export default class TableComponent extends Vue {
  @Prop() rows: [] | any;
  @Prop() headers: HeaderEntity[] | any;
  @Prop() per_page: number | any;

  public rows_: any[] = [];
  public headers_: HeaderEntity[] = [];
  public per_page_: number = per_page_const;

  @Watch('rows', {immediate: true, deep: true})
  rows_changed(val: any[]) {
    this.rows_ = [...val];
  }

  @Watch('headers', {immediate: true, deep: true})
  headers_changed(val: HeaderEntity[]) {
    this.headers_ = [...val];
  }

  @Watch('per_page', {immediate: true, deep: true})
  per_page_changed(val: number) {
    this.per_page_ = val;
  }
}
</script>

<style lang="scss">
</style>
