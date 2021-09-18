<template>
  <a-card :bordered="false">
    <s-table
      ref="table"
      size="default"
      rowKey="id"
      :columns="columns"
      :data="loadData"
    >
    </s-table>
  </a-card>
</template>

<script>
import moment from "moment";
import { userDetaliPage } from "@/api/system/integral";
import { STable } from "@/components";
export default {
  name: "form-list",
  components: {
    STable,
  },
  props: {
    statusFilter: {
      type: Function,
      default: undefined,
    },
  },
  data() {
    return {
      mdl: {},
      advanced: false,
      optionAlertShow: true,
      queryParam: {
        dto: {},
      },
      columns: [
        {
          title: "文明币来源",
          dataIndex: "typeName",
        },
        {
          title: "变动前文明币",
          dataIndex: "bfIntegral",
        },
        {
          title: "获得文明币",
          dataIndex: "integral",
        },
        {
          title: "时间",
          dataIndex: "gmtCreate",
          customRender: (text) => {
            if (text) return moment(text).format("YYYY-MM-DD HH:mm:ss");
          },
        },
      ],
      loadData: (parameter) => {
        return userDetaliPage(Object.assign(parameter, this.queryParam)).then(
          (response) => {
            return response.res;
          }
        );
      },
    };
  },
  created() {},
  methods: {},
};
</script>
