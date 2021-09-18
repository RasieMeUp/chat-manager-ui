<template>
  <a-card :bordered="false">
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
          rowKey="id"
          :columns="columns"
          :data="loadData"
        >
          <template slot="footer" slot-scope="text, record">
            合计导入&nbsp;&nbsp;<font color="red">{{ total.improt }}</font
            >&nbsp;人&nbsp;,&nbsp;&nbsp;激活&nbsp;&nbsp;<font color="red">{{
              total.actived
            }}</font
            >&nbsp;人
          </template>
        </s-table>
      </a-col>
    </a-row>
  </a-card>
</template>
<script>
import moment from "moment";
import { activePage, sumPage } from "@/api/system/user";
import { STable } from "@/components";
import { page as pageOrg } from "@/api/system/org";
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
      mdl: {},
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {
        dto: {},
      },
      // 表头
      columns: [
        {
          title: "机构名称",
          dataIndex: "orgName",
        },
        {
          title: "已导入数量",
          dataIndex: "improt",
        },
        {
          title: "激活数量",
          dataIndex: "actived",
        },
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        return activePage(Object.assign(parameter, this.queryParam)).then(
          (response) => {
            return response.res;
          }
        );
      },
      optionAlertShow: false,
      orgTreeData: [],
      total: {
        actived: 0,
        improt: 0,
      },
    };
  },
  created() {
    this.treeStruct();
  },
  methods: {
    resetSearchForm() {
      this.queryParam = {
        dto: {},
      };
      this.handleOk();
    },
    treeStruct() {
      pageOrg({})
        .then((response) => {
          if (response.res.children.length > 0) {
            this.orgTreeData = response.res.children;
          } else {
            this.orgTreeData = [response.res];
          }
        })
        .then(() => {
          this.sumActive();
        });
    },
    sumActive() {
      sumPage().then((sum) => {
        if (sum.code == 0 && sum.res) {
          this.total.improt = sum.res.improt;
          this.total.actived = sum.res.actived;
        }
      });
    },
    treeSelectEvent(selectedKeys, e) {
      if (e.node.dataRef.attributes && e.node.dataRef.id == "0") {
        this.queryParam.dto.orgId = e.node.dataRef.attributes.topParentId;
      } else {
        this.queryParam.dto.orgId = e.node.dataRef.id;
      }
      this.$refs.table.refresh();
    },
    searchForm() {
      this.$refs.table.refresh(true);
    },
    clearStructTree() {
      this.queryParam.dto.orgId = null;
      this.$refs.table.refresh();
      this.sumActive();
    },
  },
};
</script>
