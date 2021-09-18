<template>
  <a-popover
    v-model="visible"
    trigger="click"
    placement="bottomRight"
    overlayClassName="header-notice-wrapper"
    :autoAdjustOverflow="true"
    :arrowPointAtCenter="true"
    :overlayStyle="{ width: '200px', top: '50px' }"
  >
    <template slot="content">
      <a-spin :spinning="loadding">
        <a-tabs>
          <a-tab-pane tab="系统设置" key="1">
            <a-list>
              <a-list-item v-has="{ perm: 'flush:cache:data' }">
                   <!-- <a-button style="margin-left: 10px;"   @click="flushDB">清除数据缓存</a-button> -->
              </a-list-item>
              <a-list-item v-has="{ perm: 'flush:cache:browser' }">
                   <!-- <a-button style="margin-left: 10px;"   @click="flushDB">清除浏览器缓存</a-button> -->
              </a-list-item>
            </a-list>
          </a-tab-pane>
        </a-tabs>
      </a-spin>
    </template>
    <span @click="fetchNotice" class="header-notice">
      <a-badge>
        <a-icon style="font-size: 16px; padding: 4px" type="setting" />
      </a-badge>
    </span>
  </a-popover>
</template>

<script>
import { mixinDevice } from '@/utils/mixin.js'
// import {  flushDB } from '@/api/system/user'
export default {
  components: {
  },
  name: 'HeaderNotice',
  data () {
    return {
      percent: 0,
      loadding: false,
      visible: false
    }
  },
  methods: {
    fetchNotice () {
      this.visible = !this.visible
    },

    // flushDB() {
    //   this.percent = 0
    //   flushDB({}).then(response => {
    //     if (response.code === 0) {
    //       this.$message.info('清除成功!')
    //       this.percent = 100
    //     } else {
    //       this.$message.error(response.message)
    //     }
    //   })
    // },
  }
}
</script>

<style lang="css">
  .header-notice-wrapper {
    top: 50px !important;
  }
</style>
<style lang="less" scoped>
  .header-notice{
    display: inline-block;
    transition: all 0.3s;

    span {
      vertical-align: initial;
    }
  }
</style>
