<template>
  <div class="account-settings-info-view">
    <a-row :gutter="24">
      <a-col :md="3">
        <div
          style="
            border: 1px dashed #e8e8e8;
            position: relative;
            overflow-y: auto;
            height: 400px;
          "
        >
          <a-tree
            @select="treeSelectEvent"
            :treeData="orgTreeData"
            :show-line="true"
            ref="treeStruct"
          />
          <a-icon
            type="sync"
            style="position: absolute; top: 0.7rem; right: 0.75rem"
            @click="clearStructTree"
          />
        </div>
      </a-col>
      <a-col :md="21">
        <s-table
          ref="table"
          size="default"
          rowKey="orgId"
          :columns="columns"
          :data="loadData"
          :current="queryParam.pageNo"
        >
          <span slot="bracelet" slot-scope="text, record,index" :key="index">
            <template>
              <a-button v-if="record.bracelet" type="primary" @click="handleSwitchChange(record)" size="small">开启</a-button>
              <a-button v-else type="danger" @click="handleSwitchChange(record)" size="small">关闭</a-button>
            </template>
          </span>
        </s-table>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import moment from "moment";
import { page as pageConfig, update } from "@/api/system/orgConfig";
import { STable } from "@/components";
import { page as pageOrg } from "@/api/system/org";
import clone from "lodash.clone";
export default {
  name: "TableList",
  components: {
    STable
  },
  props: {
    statusFilter: {
      type: Function,
      default: undefined
    }
  },
  data() {
    return {
      mdl: {},
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {
        dto: {}
      },
      // 表头
      columns: [
        {
          title: "乡镇/街道",
          dataIndex: "town"
        },
        {
          title: "村/社区",
          dataIndex: "orgName"
        },
        {
          title: "手环功能",
          align: "center",
          scopedSlots: { customRender: "bracelet" }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return pageConfig(Object.assign(parameter, this.queryParam)).then(
          response => {
            return response.res;
          }
        );
      },
      optionAlertShow: false,
      orgTreeData: [],
      total: {
        actived: 0,
        improted: 0
      }
    };
  },
  created() {
    this.treeStruct();
  },
  filters: {},
  methods: {
    treeStruct() {
      pageOrg({ enable2: false }).then(response => {
        if (response.res.children.length > 0) {
          this.orgTreeData = response.res.children;
        } else {
          this.orgTreeData = [response.res];
        }
      });
    },
    treeSelectEvent(selectedKeys, e) {
      this.queryParam.dto.level = e.node.dataRef.attributes.level;
      if (e.node.dataRef.attributes && e.node.dataRef.id == "0") {
        this.queryParam.dto.orgId = e.node.dataRef.attributes.topParentId;
      } else {
        this.queryParam.dto.orgId = e.node.dataRef.id;
      }
      this.$refs.table.refresh();
    },
    clearStructTree() {
      this.queryParam.dto.orgId = null;
      this.$refs.table.refresh();
    },
    handleSwitchChange(record) {
      // record.bracelet = !record.bracelet;
      let data = {
        id: record.id,
        bracelet: !record.bracelet
      };
      update(data).then(response => {
        if (response.code === 0) {
          this.$message.info(response.message);
          this.$refs.table.refresh();
        } else {
          this.$message.error(response.message);
        }
      });
    },
    searchForm() {
      this.$refs.table.refresh(true);
    },
  }
};
</script>
