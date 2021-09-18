<template>
  <a-card :bordered="false">
    <template>
      <div class="table-operator">
        <a-button
          type="primary"
          icon="plus"
          v-has="{perm:'menu:save'}"
          @click="handleAdd(null)"
        >新建菜单</a-button>
      </div>
    </template>

    <div class="table-page-search-wrapper">
      <a-table :columns="columns" :dataSource="data">

      </a-table>
      <form-handle ref="formHandle" @ok="handleOk"  v-on:searchForm="searchForm"/>
    </div>
  </a-card>
</template>

<script>
import { page, delByPk } from '@/api/system/menu'
import formHandle from './handle'

const columns = [
  {
    title: '版本号',
    dataIndex: 'name',
    key: 'name',
     width: '16%'
  },
  {
    title: '更新内容',
    dataIndex: 'attributes.perms',
    key: 'perms',
    width: '50%'
  },
 {
    title: '是否强制',
    dataIndex: 'attributes.perms',
    key: 'perms',
  },
]

const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(
      `selectedRowKeys: ${selectedRowKeys}`,
      'selectedRows: ',
      selectedRows
    )
  },
  onSelect: (record, selected, selectedRows) => {
    console.log(record, selected, selectedRows)
  },
  onSelectAll: (selected, selectedRows, changeRows) => {
    console.log(selected, selectedRows, changeRows)
  }
}
export default {
  data() {
    return {
      data: [],
      columns,
      rowSelection
    }
  },
  components: {
    formHandle
  },
  created() {
    this.loadData()
  },
  methods: {
    loadData() {
      return page({}).then(response => {
        this.data = response.res.children
      })
    },
    handleAdd(record) {
      this.$refs.formHandle.add(record)
    },
    handleEdit(record) {
      this.$refs.formHandle.edit(record)
    },
    handleDelete(record) {
      const that = this
      this.$confirm({
        title: '操作提醒',
        content: '确定要删除吗?',
        onOk() {
          delByPk({ id: record.id })
            .then(response => {
              if (response.code === 0) { that.$message.info('操作成功!') } else { that.$message.error(response.message) }
              that.handleOk()
            })
            .catch(response => {
              that.$message.warn(response.data.msg)
            })
        },
        onCancel() {}
      })
    },
    handleOk() {
      this.loadData()
    }
  }
}
</script>
