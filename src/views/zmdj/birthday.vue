<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="6" :sm="24">
            <a-form-item label="村民名称">
              <a-input v-model="queryParam.dto.realName" placeholder="" />
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="24">
            <span
              class="table-page-search-submitButtons"
              :style="
                (advanced && { float: 'right', overflow: 'hidden' }) || {}
              "
            >
              <a-button type="primary" @click="$refs.table.refresh(true)"
                >查询</a-button
              >
              <a-button style="margin-left: 8px" @click="resetSearchForm()"
                >重置</a-button
              >
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
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
import { partyBless } from "@/api/system/org";
import { STable } from "@/components";
export default {
  name: "TableList",
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
      advanced: false,
      queryParam: {
        dto: {},
      },
      columns: [
        {
          title: "村民名称",
          dataIndex: "realName",
        },
        {
          title: "发送时间",
          dataIndex: "gmtCreate",
          customRender: (text) => {
            if (text) return moment(text).format("YYYY-MM-DD HH:mm:ss");
          },
        },
        {
          title: "入党时间",
          dataIndex: "addPartyDate",
          customRender: (text) => {
            if (text) return moment(text).format("YYYY-MM-DD");
          },
        },
      ],
      loadData: (parameter) => {
        return partyBless(Object.assign(parameter, this.queryParam)).then(
          (response) => {
            return response.res;
          }
        );
      },
    };
  },
  created() {
  },
  methods: {
    handleOk() {
      this.$refs.table.refresh();
      this.drawer01.visible = false;
    },
    searchForm() {
      this.$refs.table.refresh(true);
    },
    resetSearchForm() {
      this.queryParam = {
        dto: {},
      };
      this.handleOk();
    },
  },
  watch: {},
};
</script>
