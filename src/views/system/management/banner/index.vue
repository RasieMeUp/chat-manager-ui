<template>
 <a-form :form="form">
 <a-card :bordered="false">
    <s-table
      ref="table"
      size="default"
      rowKey="id"
      :columns="columns"
      :data="loadData"
      :alert="options.alert"
      :rowSelection="options.rowSelection"
    >

      <span slot="actives" slot-scope="text, record">
        <template >
        
          {{ record.name | isEmpty(true) }}
        </template>
      </span>

      <span slot="lang" slot-scope="lang">
        <template >
          {{ lang | isEmpty(true) }}
        </template>
      </span>

     <span slot="images" slot-scope="text, record">
        <template>
<span v-if="record.id==rowId">
         <a-input type="hidden" v-decorator="['imgurl']" />
           <a-upload
                name="file"
                :action="uploadUrl"
                :headers="headers"
                listType="picture-card"
                :fileList="fileList"
                :remove="removeFile"
                @preview="handlePreview"
                @change="handleFileChange"
              >
                <div v-if="fileList.length < 1">
                  <a-icon type="plus" />
                  <div class="ant-upload-text">上传图片</div>
                </div>
              </a-upload>
            </span>
             
<span v-else> <img 
            :src="record.imageUrl"
            style="
              height: 85px;
              width: 360px;
              max-width: 100%;
              vertical-align: middle;
              border: 0;
            "
          /></span>
         
        </template>
      </span>


      <span slot="action" slot-scope="text, record">
        <template>
          <a-tag color="red" @click="uploadFile(record)" v-has="{ perm: 'news:delete' }"
            >本都上传</a-tag
          >

           <a-tag color="red" @click="handleInsert(record)" v-has="{ perm: 'news:delete' }"
            >保存</a-tag
          >
        
           <a-tag color="red" @click="handleDelete(record)" v-has="{ perm: 'news:delete' }"
            >删除</a-tag
          >
        </template>
      </span>
    </s-table>
 

  </a-card>

 </a-form>
</template>

<script>
import moment from "moment";
import { page, delByPk, batch } from "@/api/news";
import { getListBanner,delBanner } from "@/api/system/management/paramter";
import { STable } from "@/components";
import { ApiUrl } from "@/utils/request.js";
import {
  ACCESS_TOKEN
} from '@/store/mutation-types'
import { deleteFile } from "@/api/resource/index";
//import formHandle from '../appconfig/handle';
export default {
  name: "giftList",
  components: {
    STable
  },
  props: {
    statusFilter: {
      type: Function,
      default: undefined,
    },
  },
  data() {
    return {
      uploadUrl: ApiUrl + "/upload/uploadFile",
      fileList: [],
      headers: {
        Authorization: "bearer  " +ACCESS_TOKEN,
      },
      rowId:"",
      imgurls: [],
      type: 0,
      advanced: false,
      optionAlertShow: false,
      queryParam: {},
      versionShow:false,
      columns: [
     
        {
          title: "",
          dataIndex: "actives",
          width:"130px",
          scopedSlots: { customRender: "actives" },
        },
        {
          title: "语言",
          dataIndex: "lang",
          scopedSlots: { customRender: "lang" },
        },
       {
          title: "图片",
          dataIndex: "images",
          width: "350px",
          scopedSlots: { customRender: "images" },
        },
       
        {
          title: "操作",
          dataIndex: "action",
          width: "180px",
          scopedSlots: { customRender: "action" },
        },
      ],
      loadData: (parameter) => {
         console.log( ACCESS_TOKEN)
        return getListBanner().then((response) => {
          this.userCount = response.extra.userCount;
          //临时数据
          let res = { pageCount: 10, pageIndex: 1, pageSize: 10, total: 10, rows: [] };
          res.rows = response.data;
        // console.log(response.data)
          return res;
          return response.res;
        });
      },
      
      selectedRowKeys: [],
      selectedRows: [],
      options: {
        alert: {
          show: true,
          clear: () => {
            this.selectedRowKeys = [];
          },
        },
        rowSelection: {
          selectedRowKeys: this.selectedRowKeys,
          onChange: this.onSelectChange,
        },
      },
    };
  },
  created() {
   
   // this.tableOption();
  },
  filters: {


    isEmpty(__value,__type) {
          if(__value !== null && typeof __value !== 'undefined') return __value;
          if(__type){
            return '-';
          }else{
            return '0';
          }
        },

    },
  methods: {
     handleFileChange(e) {
       console.log(e)
      this.fileList = e.fileList;
      if (e.file.response && e.file.response.code === 0) {
        this.disable = true;
        setTimeout(() => {
          this.form.setFieldsValue({
            imgurl: e.file.response.res.fileFullPath,
          });
        }, 100);
      }

      this.handleInsert(e);
     // console.log(this.fileList);

    },
    handlePreview(file) {
      this.previewImage = file.url || file.thumbUrl;
      this.previewVisible = true;
      window.open(file.url, "_blank");
    },
    removeFile(file) {
      this.disable = false;
      if (file && !file.error && file.response) {
        deleteFile({
          filePath: file.response.res.path,
        }).then((response) => {
          if (response.code === 0) {
            console.log("delete file success");
          }
        });
      }
    },

     handlePreview(file) {
      this.previewImage = file.url || file.thumbUrl;
      this.previewVisible = true;
      window.open(file.url, "_blank");
    },
    uploadFile(record){
         const that = this;
         this.rowId=record.id

    },

    handleInsert(e){
      console.log(e.file)
       updatePhotos({ bannerId:this.rowId })
            .then((response) => {
              that.$message.info(response.message);
              that.$refs.table.refresh();
            })
            .catch((response) => {
              that.$message.warn(response.message);
            });
      

    },
    handleDelete(record) {
      const that = this;
      this.$confirm({
        title: "操作提醒",
        content: "确定要隐藏吗?",
        onOk() {
          delBanner({ bannerId: record.id })
            .then((response) => {
              that.$message.info(response.message);
              that.$refs.table.refresh();
            })
            .catch((response) => {
              that.$message.warn(response.message);
            });
        },
        onCancel() {},
      });
    },

    handleChange(record){
     this.drawer01.visible = true
      this.drawer01.title = record.version +'-修改'
      this.$nextTick(() => {
        this.$refs.formHandle.edit(record)
      })
    },
    handleOk() {
      this.$refs.table.refresh();
    },
    
    searchForm() {
      this.$refs.table.refresh(true);
    },
    resetSearchForm() {
      this.queryParam = {};
      this.handleOk();
    },

    handleOpera(type) {
      const that = this;
      that.$confirm({
        title: "操作提醒",
        content: "确定要操作" + that.selectedRowKeys.length + "条数据吗?",
        onOk() {
          batch({ status: type, ids: that.selectedRowKeys })
            .then((reponse) => {
              that.$message.info(reponse.msg);
              that.$refs.table.refresh();
              that.options.rowSelection.selectedRowKeys = [];
            })
            .catch(() => console.log("Oops errors!"));
        },
        onCancel() {},
      });
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
    },

  },
  watch: {
    $route(cur, old) {
      this.$nextTick(() => {
        this.$refs.table.refresh(true);
      });
    },
  },
};
</script>
