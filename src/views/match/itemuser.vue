<template>
  <a-card :bordered="false">
    <!-- <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
                   <a-col :md="6" :sm="24">
                      <a-form-item label="标题">
                        <a-input v-model="queryParam.dto.name" placeholder=""/>
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
    </div> -->
     <!-- <div class="table-operator">
      <a-button
        type="primary"
        v-has="{perm:'ndpx:edit'}"
        icon="plus"
        @click="handleEdit(0,null)"
      >新增候选者</a-button>
         </div> -->
     <s-table
      ref="table"
      size="default"
      rowKey="id"
      :columns="columns"
      :data="loadData"
      :alert="options.alert"
      :rowSelection="options.rowSelection"
    >
	</s-table>
   
  </a-card>
</template>

<script>
import moment from 'moment'
import { page } from '@/api/matchitemuser'
import { STable } from '@/components'
export default {
  name: 'TableList',
  components: {
    STable
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
        }
      },
      columns: [
        {
          title: '活动名称',
          dataIndex: 'title'
        },
        {
          title: '候选者',
          dataIndex: 'name'
        },
        {
          title: '投票人',
          dataIndex: 'realName'
        },
        {
          title: '投票时间',
          dataIndex: 'gmtCreate',
          customRender: (text) => {
            if (text) return moment(text).format('YYYY-MM-DD HH:mm:ss')
          }
        }
      ],
      loadData: parameter => {
        return page(Object.assign(parameter, this.queryParam)).then(response => {
          return response.res
        })
      },
      
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
      }
    }
  },
  created () {
    this.tableOption()
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
    }
  }
}
</script>
