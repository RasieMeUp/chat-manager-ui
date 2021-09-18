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
           <a-input v-decorator="['digitId', {rules: [{required: true}]}]"/>
        </a-form-item>
        <a-form-item label="设置推荐" :labelCol="labelCol" :wrapperCol="wrapperCol" v-show="false">
           <a-input v-decorator="['recommend', {rules: [{required: true}]}]"/>
        </a-form-item>
        <a-form-item label="推荐模块" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select  v-decorator="['type']" @change="selectChange" >
            <a-select-option :value="0"> 首页-推荐一 </a-select-option>
            <a-select-option :value="6"> 首页-推荐二 </a-select-option>
            <a-select-option :value="7"> 首页-推荐三 </a-select-option>
            <!-- <a-select-option :value="1"> 首页活跃 </a-select-option> -->
            <a-select-option :value="2"> 首页-新人 </a-select-option>
            <a-select-option :value="4"> 推荐池-视频 </a-select-option>
            <a-select-option :value="3"> 推荐池-私信 </a-select-option>
            <a-select-option :value="5"> 审核池 </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="排序" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['level']" />
        </a-form-item>
        
        <a-form-item label="推荐时间段一" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if='type==4 || type==0|| type==6|| type==7?true:false'>
          <a-time-picker  :default-open-value="moment('00:00', 'HH:mm')" v-decorator="['startTime']"  format="HH:mm" @change="startOnChange"/> 至
        </a-form-item>
        <a-form-item  style="position: absolute; left: 58%; margin-top:-65px;"  :labelCol="labelCol" :wrapperCol="wrapperCol" v-if='type==4|| type==0|| type==6 || type==7?true:false'>
          <a-time-picker :default-open-value="moment('00:00', 'HH:mm')" v-decorator="['endTime']"  format="HH:mm"  @change="endOnChange"/> 
          <!-- <a-icon class="dynamic-delete-button form-del"  type="plus-circle"  :style="{ fontSize: '22px', color: '#666' }" @click="showTime2=true" /> -->
        </a-form-item>


         <a-form-item label="推荐时间段二" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if='(type==4|| type==0|| type==6 || type==7)?true:false'>
          <a-time-picker :default-open-value="moment('00:00', 'HH:mm')" v-decorator="['startTime2']"  format="HH:mm" @change="startOnChange2"/> 至
        </a-form-item>
        <a-form-item  style="position: absolute; left: 58%; margin-top:-65px;"  :labelCol="labelCol" :wrapperCol="wrapperCol" v-if='(type==4|| type==0 || type==6 || type==7) ?true:false'>
          <a-time-picker :default-open-value="moment('00:00', 'HH:mm')" v-decorator="['endTime2']"  format="HH:mm"  @change="endOnChange2"/>
          <!-- <a-icon class="dynamic-delete-button form-del"  type="minus-circle-o"  :style="{ fontSize: '22px', color: '#666' }"  @click="delTimes2" /> -->
        </a-form-item>
        

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import moment from 'moment'
import { anchorRecommendHandle } from '@/api/system/userManager'
import pick from 'lodash.pick'
export default {
  data() {
    return {
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
      console.log('主播推荐type ===' ,type);
      this.modal('主播推荐', 0)
      
      this.inputStartTime = null;
      this.inputEndTime =null;
      this.inputStartTime2 = null;
      this.inputEndTime2 =null;

      this.$nextTick(()=>{
        setTimeout(() => {
          var vobj ={
            digitId: digitId,
            recommend:1,
          }
          this.form.setFieldsValue(vobj);
        }, 100)

      });

     
    },

 edit(record) {
      this.modal("修改推荐", 1);
      console.log("修改主播推荐=》",record);
      this.type = record.type;

     

      this.$nextTick(()=>{
        setTimeout(() => {

            this.inputStartTime = record.startTime;
            this.inputEndTime =record.endTime;
            this.inputStartTime2 = record.startTime2;
            this.inputEndTime2 =record.endTime2;

             var vobj ={
          digitId: record.digitId,
          recommend:1,
          type:record.type,
          level:record.level,
          startTime:record.startTime==null?'':moment(record.startTime, 'HH:mm'),
          endTime:record.endTime==null?'':moment(record.endTime, 'HH:mm'),
          startTime2:record.startTime2==null?'':moment(record.startTime2, 'HH:mm'),
          endTime2:record.endTime2==null?'':moment(record.endTime2, 'HH:mm'),

      
          }
         
        if(record.type == 4 || record.type == 0 || record.type == 6 || record.type == 7 ){
             if(record.startTime2 == null && record.endTime2 == null){
                this.form.setFieldsValue(pick(vobj, 'digitId', 'recommend','type','level','startTime','endTime'))  // loadsh的pick方法
             }else{
                this.form.setFieldsValue(pick(vobj, 'digitId', 'recommend','type','level','startTime','endTime','startTime2','endTime2'))  // loadsh的pick方法
             }
         
         }else{
           this.form.setFieldsValue(pick(vobj, 'digitId', 'recommend','type','level'))  // loadsh的pick方法
         }
        // this.form.setFieldsValue(vobj);
        }, 100)


        
      });
    },


    modal(title,opera) {
      this.modalTitle = title
      this.modalOpera = opera
      this.visible = true
      this.form.resetFields();
    },
    // 普通时间格式转成秒
    timeToSec(__value){
      if(__value == null) return null;
        var timeArr =  (__value || "").split(':')
        var hour = timeArr[0]
        var minute = timeArr[1]
        var sec = timeArr[2]
        return Number(hour * 3600) + Number(minute * 60) + Number(sec)
    },
    handleSubmit() {
        console.log(this.inputStartTime,this.inputEndTime,this.inputStartTime2,this.inputEndTime2);

        if(this.type == 4 || this.type == 0 || this.type == 6 || this.type == 7){

        let startTimeTemp = this.timeToSec(this.inputStartTime),
            endTimeTemp =  this.timeToSec(this.inputEndTime),
            startTimeTemp2 = this.timeToSec(this.inputStartTime2),
            endTimeTemp2 =  this.timeToSec(this.inputEndTime2);

            if(this.inputStartTime == null || this.inputStartTime == '' || this.inputEndTime == null || this.inputEndTime == '' ||   this.inputStartTime2 == null || this.inputStartTime2 == '' || this.inputEndTime2 == null || this.inputEndTime2 == ''){
               this.$message.error('推荐时段不可为空');
              return;
            }


            if(startTimeTemp == endTimeTemp) {
              this.$message.error('时间段一的起始时间和结束时间不能相同');
              return;
            }

            if(startTimeTemp2 !== null && endTimeTemp2 !==null){
                if(startTimeTemp2>=startTimeTemp  && startTimeTemp2 < endTimeTemp) {
                  this.$message.error('时间段冲突，请重新设置');
                  return;
                }
                if(startTimeTemp2 == endTimeTemp2) {
                  this.$message.error('时间段二的起始时间和结束时间不能相同');
                  return;
                }
            }

        }

            


      const that = this;
      this.confirmLoading = true;
      that.form.validateFields((errors, values) => {
          if (!errors) {
            console.log('提交数据0：values==',values);
            values.endTime = this.inputEndTime;
            values.startTime = this.inputStartTime;
            values.endTime2 = this.inputEndTime2;
            values.startTime2 = this.inputStartTime2;

             if(values.startTime == null){
               delete values.startTime;
            }
            if(values.startTime2 == null){
               delete values.startTime2;
            }
            if(values.endTime == null){
               delete values.endTime;
            }
            if(values.endTime2 == null){
               delete values.endTime2;
            }

            console.log('提交数据：values==',values);


                anchorRecommendHandle(values).then(response => {
                  if (response.code === 0) {
                    that.$message.info(response.message)
                    that.$emit('searchForm');
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
      if(timeString == ''){
         this.inputEndTime = null;
        return;
      }
      this.inputEndTime = timeString +':00';
    },
    startOnChange(time, timeString) {
      if(timeString == ''){
         this.inputStartTime = null;
        return;
      }
      this.inputStartTime = timeString +':00'
    },

    endOnChange2(time, timeString) {
      if(timeString == ''){
         this.inputEndTime2 = null;
        return;
      }
        this.inputEndTime2 = timeString +':00';
    },
    startOnChange2(time, timeString) {
      if(timeString == ''){
         this.inputStartTime2 = null;
        return;
      }
        this.inputStartTime2 = timeString +':00';
    },
    selectChange(value){
      this.type = value;
    },
    delTimes2(){
      // this.showTime2=false;
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
