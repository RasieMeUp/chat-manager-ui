<template>
  <a-modal
    title="分配归属"
    :width="400"
    :visible="visible"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin
      :spinning="confirmLoading"
      style="max-height: 450px; overflow-y: auto"
    >
      <a-tree
        @select="treeSelectEvent"
        :treeData="structTreeData"
        :show-line="true"
        ref="treeStruct"
      />
    </a-spin>
  </a-modal>
</template>
<script>
import { treeStruct } from "@/api/system/struct";
import { struct } from "@/api/system/user";
export default {
  data() {
    return {
      visible: false,
      confirmLoading: false,
      isHandle: false,
      queryParam: {
        userIds: [],
        structId: "",
      },
      structTreeData: [],
    };
  },
  created() {},
  methods: {
    assignMenu(record) {
      this.queryParam.userIds = record;
      this.visible = true;
      treeStruct().then((response) => {
        if (response.res.children) {
          this.structTreeData = response.res.children;
        }
      });
    },
    treeSelectEvent(selectedKeys, e) {
      if (e.node.dataRef.attributes && e.node.dataRef.id == "0") {
        this.queryParam.structId = e.node.dataRef.attributes.topParentId;
      } else {
        this.queryParam.structId = e.node.dataRef.id;
      }
    },
    handleSubmit() {
      if (!this.queryParam.structId) {
        this.$message.error("请选择机构归属");
        return;
      }
      this.confirmLoading = true;
      if (this.queryParam.userIds.length == 0) {
        this.$message.error("请选择村民");
        return;
      }
      this.saveStruct();
    },
    saveStruct() {
      this.confirmLoading = true;
      struct(this.queryParam).then((response) => {
        if (response.code === 0) {
          this.$message.info(response.message);
          this.$emit("ok");
          this.handleCancel();
        } else {
          this.$message.error(response.message);
        }
        this.confirmLoading = false;
      });
    },
    handleCancel() {
      this.visible = false;
      this.confirmLoading = false;
      this.structTreeData = [];
    },
  },
};
</script>
