<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
                   <a-col :md="6" :sm="24">
                      <a-form-item label="标题">
                        <a-input v-model="queryParam.dto.title" placeholder=""/>
                      </a-form-item>
                     
               </a-col>
                <a-col :md="6" :sm="24">
                <a-form-item label="状态">
              <a-select v-model="queryParam.dto.status" placeholder="请选择" default-value="1">
                <a-select-option value>全部</a-select-option>
                <a-select-option value="0">正常</a-select-option>
                <a-select-option value="1">隐藏</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
              <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <a-button style="margin-left: 8px" @click="resetSearchForm()">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
     <div class="table-operator">
      <a-button
        type="primary"
        v-has="{perm:'cwfb:edit'}"
        icon="plus"
        @click="handleEdit(0,null)"
      >新增评议</a-button>
      <!-- <a-button type="dashed" @click="tableOption">{{ optionAlertShow && '关闭' || '开启' }} 批量操作</a-button>
      <a-dropdown v-action:edit v-if="selectedRowKeys.length > 0" v-has="{perm:'cwfb:batch'}">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="handleOpera(-1)">
            <a-icon type="delete" />删除
          </a-menu-item>
          <a-menu-item key="2" @click="handleOpera(1)">
            <a-icon type="lock" />隐藏
          </a-menu-item>
          <a-menu-item key="3" @click="handleOpera(0)">
            <a-icon type="unlock" />解除隐藏
          </a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px">
          批量操作
          <a-icon type="down" />
        </a-button>
      </a-dropdown> -->
    </div>
    
     <s-table
      ref="table"
      size="default"
      rowKey="id"
      :columns="columns"
      :data="loadData"
      :alert="options.alert"
      :rowSelection="options.rowSelection"
    >
    <span slot="action" slot-scope="text, record">
        <template>
         <a-tag color="teal" @click="handleItem(record.id)"  v-has="{perm:'cwfb:select'}" >投票详情</a-tag>
        <a-tag color="orange" @click="handleEdit(1,record)" v-has="{perm:'cwfb:edit'}">编辑</a-tag>
        <a-tag color="red" @click="handleDelete(record)" v-has="{perm:'cwfb:del'}">删除</a-tag>
        </template>
    </span>
	</s-table>
    <!-- <form-handle ref="formHandle" @ok="handleOk"  v-on:searchForm="searchForm" /> -->
    <a-drawer
      :title="drawer01.title"
      :width="drawer01.width"
      :maskClosable="false"
      :visible="drawer01.visible"
      :body-style="{ paddingBottom: '80px' }"
      @close="()=>{drawer01.visible=false}"
    >
      <form-handle ref="formHandle" @ok="handleOk"  v-on:searchForm="searchForm"/>
      <div
        :style="{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
          zIndex: 1,
        }"
      >
        <a-button :style="{ marginRight: '8px' }" @click="()=>{drawer01.visible=false}">取消</a-button>
        <a-button type="primary" @click="()=>{$refs.formHandle.handleSubmit()}">确定</a-button>
      </div>
    </a-drawer>
         <a-modal width="800px" v-if="userSearchVisible"
      title="候选者"
      :visible="userSearchVisible"
      :confirm-loading="userSearchLoading"
      @cancel="userSearchCancel"
      @ok="userSearchCancel"
    >
        <form-item ref="formItem" />
    </a-modal>
  </a-card>
</template>

<script>
import moment from 'moment'
import formHandle from './handle'
import formItem from './item'
import { page, delByPk } from '@/api/discuss'
import { STable } from '@/components'
export default {
  name: 'TableList',
  components: {
    STable,
    formHandle,
    formItem
  },
  props: {
    statusFilter: {
      type: Function,
      default: undefined
    }
  },
  data () {
    return {
      mdl: {},
      advanced: false,
      optionAlertShow: true,
      queryParam: {
        dto: {
          typeid: 0
        }
      },
      columns: [
        {
          title: '标题',
          dataIndex: 'title'
        },
        {
          title: '选择人数',
          dataIndex: 'joinnum'
        },
        {
          title: '同意人数',
          dataIndex: 'yesnum'
        },
        {
          title: '拒绝人数',
          dataIndex: 'nonum'
        },
        // {
        //   title: '排序',
        //   dataIndex: 'sort'
        // },
        {
          title: '更新时间',
          dataIndex: 'gmtModified',
          customRender: (text) => {
            if (text) return moment(text).format('YYYY-MM-DD')
          }
        },
        {
          title: '结束时间',
          dataIndex: 'endtime',
          customRender: (text) => {
            if (text) return moment(text).format('YYYY-MM-DD')
          }
        },
        {
          title: '状态',
          dataIndex: 'status',
          customRender: (text) => {
            return text===1?'隐藏':'正常'
          }
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '250px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      loadData: parameter => {
        return page(Object.assign(parameter, this.queryParam)).then(response => {
          return response.res
        })
      },
      drawer01: {
        visible: false,
        width: '600',
        placement: 'right',
        title: '新建评议'
      },
      selectedRowKeys: [],
      selectedRows: [],
      options: {
        alert: {
          show: true,
          clear: () => {
            this.selectedRowKeys = []
          }
        },
        rowSelection: {
          selectedRowKeys: this.selectedRowKeys,
          onChange: this.onSelectChange
        }
      },
      userSearchVisible: false,
      userSearchLoading: false
    }
  },
  created () {
    this.tableOption();
    // this.setStartValue();
  },
  methods: {
    tableOption() {
      if (!this.optionAlertShow) {
        this.options = {
          alert: {
            show: true,
            clear: () => {
              this.selectedRowKeys = []
            }
          },
          rowSelection: {
            selectedRowKeys: this.selectedRowKeys,
            onChange: this.onSelectChange
          }
        }
        this.optionAlertShow = true
      } else {
        this.options = {
          alert: false,
          rowSelection: null
        }
        this.optionAlertShow = false
      }
    },
    handleDelete (record) {
      const that=this
      this.$confirm({
        title: '操作提醒',
        content: '确定要删除吗?',
        onOk() {
          delByPk({ pk: record.id }).then(response => {
            that.$message.info(response.message)
            that.$refs.table.refresh()
          }).catch((response) => { that.$message.warn(response.message) })
        },
        onCancel() {}
      })
    },
    handleEdit (__type, record) {
      this.drawer01.visible = true
      this.drawer01.title = __type === 0 ? '新增评议' : '编辑评议'
      this.$nextTick(() => {
        if (__type === 1) this.$refs.formHandle.edit(record)
        else this.$refs.formHandle.add(this.queryParam.dto.typeid)
      })
    },
    handleOk () {
      this.$refs.table.refresh()
      this.drawer01.visible = false
    },
    searchForm() {
      this.$refs.table.refresh(true);
    },
    setStartValue(){
      var myDate = new Date();
      var yesterDaytime=(new Date).getTime()-24*60*60*1000;
      this.queryParam.startTime =moment(myDate).format("YYYY-MM-DD")+' 00:00:00';
      this.queryParam.endTime =moment(myDate).format("YYYY-MM-DD")+' 23:59:59';
      this.rangeValue = [ moment(myDate).format("YYYY-MM-DD"), moment(myDate).format("YYYY-MM-DD")];
    },
    resetSearchForm () {
      this.queryParam = {
        dto: { }
      }
      // this.setStartValue();
      this.handleOk()
    },
    handleOpera(type) {
      const that=this
      that.$confirm({
        title: '操作提醒',
        content: '确定要操作'+that.selectedRowKeys.length+'条数据吗?',
        onOk() {
          batch({ status: type, ids: that.selectedRowKeys })
            .then((reponse) => {
              that.$message.info(reponse.msg)
              that.$refs.table.refresh()
              that.options.rowSelection.selectedRowKeys = []
            })
            .catch(() => console.log('Oops errors!'))
        },
        onCancel() {}
      })
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    handleItem(id){
      this.userSearchVisible=true
      this.$nextTick(() => {
        this.$refs.formItem.queryParam.dto.discussid=id
      })
    },
    userSearchCancel() {
      this.userSearchVisible=false
    }
  }
}
</script>
