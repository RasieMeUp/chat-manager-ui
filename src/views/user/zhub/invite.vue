<template>
  <a-modal
    :title="modalTitle"
    :width="580"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="用户ID" :labelCol="labelCol" :wrapperCol="wrapperCol" v-show="false">
           <a-input v-decorator="['digitId']"/>
        </a-form-item>
       
        <a-form-item label="邀请人ID" :labelCol="labelCol" :wrapperCol="wrapperCol">
         <a-input v-decorator="['inviteCode']" /> <a-button type="primary" size="small" @click="searchInviteUser()" style="margin-right: 50px">查询</a-button>
        </a-form-item>
        <a-form-item label="邀请人昵称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          {{inviteNick}}
        </a-form-item>
       

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import moment from 'moment'
import { getBind,postBind } from '@/api/system/inviteManager'
import pick from 'lodash.pick'
export default {
  data() {
    return {
      inviteNick:'',
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
      modalTitle: '',
      modalOpera: 0, // 0：新增 1：编辑
      visible: false,
      confirmLoading: false,
      type:null,
      inputStartTime:null,
      inputEndTime:null,
      inputStartTime2:null,
      inputEndTime2:null,
      form: this.$form.createForm(this),
      showTime2:false
    }
  },
  created() {},
  methods: {
    moment,
    add(digitId,type) {
      console.log('绑定邀请人 ===' ,digitId);
      this.modal('绑定邀请人', 0)
      this.$nextTick(()=>{
        setTimeout(() => {
          var vobj ={
            digitId: digitId,
          }
          this.form.setFieldsValue(vobj);
        }, 100)

      });

     
    },

    searchInviteUser(){
      const that = this;
      this.confirmLoading = true;
      that.form.validateFields((errors, values) => {
          if (!errors) {
            if(values.digitId == undefined){
              that.$message.info('请输入邀请人ID');
               this.confirmLoading = false;
              return;
            }
              console.log('查找邀请人：values==',values);
            getBind({ inviteCode : values.inviteCode  }).then((response) => {
              console.log("查找邀请人：values response ==> " ,response);
              if (response.code === 0) {
                  that.inviteNick = response.data.nick;
                }else{
                  that.$message.error(response.message)
                }
              
            });

          }
          that.confirmLoading = false
      })
    },

//  edit(record) {
//       this.modal("绑定邀请人", 1);
//       console.log("修改主绑定邀请人=》",record);
//       this.type = record.type;
//       this.$nextTick(()=>{
//         setTimeout(() => {
//           var vobj ={
//           digitId: record.digitId,
//         }
//         this.form.setFieldsValue(pick(vobj, 'digitId', 'recommend','type','level'))  // loadsh的pick方法
//         }, 100)

        
//       });
//     },


    modal(title,opera) {
      this.modalTitle = title
      this.modalOpera = opera
      this.visible = true
      this.form.resetFields();
    },
    // 普通时间格式转成秒
    timeToSec(__value){
        var timeArr =  (__value || "").split(':')
        var hour = timeArr[0]
        var minute = timeArr[1]
        var sec = timeArr[2]
        return Number(hour * 3600) + Number(minute * 60) + Number(sec)
    },
    handleSubmit() {

      const that = this;
      this.confirmLoading = true;
      that.form.validateFields((errors, values) => {
          if (!errors) {
            console.log('绑定邀请人提交数据：values==',values);
              postBind(values).then(response => {
                if (response.code === 0) {
                  that.$message.info('绑定成功')
                  that.handleCancel()
                }else{
                  that.$message.error(response.message)
                }
              })
          }
          that.confirmLoading = false
      })
    },
    
    handleCancel() {
      this.visible = false
      this.confirmLoading = false;
    },
    endOnChange(time, timeString) {
      this.inputEndTime = timeString +':00';
    },
    startOnChange(time, timeString) {
      this.inputStartTime = timeString +':00'
    },

    endOnChange2(time, timeString) {
        this.inputEndTime2 = timeString +':00';
    },
    startOnChange2(time, timeString) {
        this.inputStartTime2 = timeString +':00';
    },
    selectChange(value){
      this.type = value;
    },
    delTimes2(){
      this.showTime2=false;
       this.inputStartTime2='';
       this.inputEndTime2 ='';
       delete this.queryParam.startTime2;
       delete this.queryParam.endTime2;
    }
  }
}

</script>
<style lang="less" scoped>
.form-del{ position: absolute; top:0; right:-40px; cursor:pointer;}
</style>
