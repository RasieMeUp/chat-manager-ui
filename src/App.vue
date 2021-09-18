<template>
  <a-config-provider :locale="locale">
    <div id="app">
      <router-view />
    </div>
  </a-config-provider>
</template>

<script>
import zhCN from "ant-design-vue/lib/locale-provider/zh_CN";
import { AppDeviceEnquire } from "@/utils/mixin";

export default {
  mixins: [AppDeviceEnquire],
  data() {
    return {
      locale: zhCN
    };
  },
  mounted() {
    console.log(this);

  }
};
</script>
<style>
#app {
  height: 100%;
}

/*整体部分*/
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
/*滑动轨道*/
::-webkit-scrollbar-track {
  border-radius: 0px;
  background: none;
}
/*滑块*/
::-webkit-scrollbar-thumb {
  border-radius: 5px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.2);
  background-color: rgba(255, 255, 255, 0.75);
}
/*滑块效果*/
::-webkit-scrollbar-thumb:hover {
  border-radius: 5px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.2);
  background-color: rgba(85, 85, 85, 0.4);
}

.ant-table-thead > tr > th,
.ant-table-tbody > tr > td {
  padding:10px 10px !important;
}

.tk-table .ant-table-thead > tr > th,
.tk-table .ant-table-tbody > tr > td {
  padding:5px 10px !important;
}
.ant-menu-submenu-title span span{ font-size:15px;}
.sider .logo{ background:#03a9f4 !important;  box-shadow:0 0 0 !important;}
.ant-menu-dark, .ant-menu-dark .ant-menu-sub,.ant-layout-sider{  background:#324157 !important; }
.ant-menu-dark .ant-menu-inline.ant-menu-sub{ background:#1f2d3d !important;}
.ant-menu .ant-menu-submenu .ant-menu-item  .anticon{ display:none; }
.ant-menu .anticon svg{    color: #fff;}

.fnt-link {  color:#1890ff;}
.fnt-error {  color: #f5222d;}
.fnt-success { color: #52c41a;}

.tixsh-table {overflow: hidden; padding:15px 0 0 0;}
.tixsh-table .ant-tabs-bar{ margin-bottom:10px;}

.ul-list{background: #fff7e6; padding:20px 0 0; margin-bottom:20px; font-size:16px; color:#000;}
.ul-list span{ display:inline-block; padding:0 15px 0;margin-bottom:20px; border-right:1px solid #eee; }
.ul-list span em{ font-style:normal; font-weight:bold;}


.ant-menu li:last-child{ display:none;}
.ant-menu li li:last-child{ display:inherit;}

.ant-drawer-right .ant-drawer-content-wrapper{width:85% !important; height:80% !important; top:10% !important; left:5% !important; box-shadow: -2px 0 30px rgba(0, 0, 0, 0.32) !important; }

.table-page-search-wrapper .ant-form-item-label{ width:85px !important; text-align: left !important;}
.ant-drawer-mask{ background-color:rgba(0,0,0,0) !important;}
</style>
