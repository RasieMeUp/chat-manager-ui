<template>
  <div class="page-header-index-wide">
    <a-card
      :bordered="false"
      :bodyStyle="{ padding: '16px 0', height: '100%' }"
      :style="{ height: '100%' }"
    >
      <div class="account-settings-info-main" :class="device">
        <div class="account-settings-info-left">
          <a-menu
            :mode="device == 'mobile' ? 'horizontal' : 'inline'"
            :style="{
              border: '0',
              width: device == 'mobile' ? '560px' : 'auto',
            }"
            :defaultSelectedKeys="defaultSelectedKeys"
            type="inner"
            @openChange="onOpenChange"
          >
            <a-menu-item key="/app/settings/link" v-has="{ perm: 'app:link' }">
              <router-link :to="{ name: 'TargetLink' }"> 链接配置 </router-link>
            </a-menu-item>
            <a-menu-item
              key="/app/settings/notify"
              v-has="{ perm: 'app:notify' }"
            >
              <router-link :to="{ name: 'AppNotify' }"> 消息推送 </router-link>
            </a-menu-item>
            <a-menu-item
              key="/app/settings/base"
              v-has="{ perm: 'app:upgrade' }"
            >
              <router-link :to="{ name: 'AppSettings' }">
                升级配置
              </router-link>
            </a-menu-item>
            <a-menu-item
              key="/app/settings/launch"
              v-has="{ perm: 'app:launch:adv' }"
            >
              <router-link :to="{ name: 'LaunchAdv' }"> 启动广告 </router-link>
            </a-menu-item>
            <a-menu-item
              key="/app/settings/other"
              v-has="{ perm: 'app:other' }"
            >
              <router-link :to="{ name: 'OtherConfig' }">
                其他配置
              </router-link>
            </a-menu-item>
                        <a-menu-item
              key="/app/function/open"
              v-has="{ perm: 'app:function' }"
            >
              <router-link :to="{ name: 'OpenFunction' }">
                功能开放
              </router-link>
            </a-menu-item>
          </a-menu>
        </div>
        <div class="account-settings-info-right">
          <div class="account-settings-info-title">
            <span>{{ $route.meta.title }}</span>
          </div>
          <route-view></route-view>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script>
import { PageView, RouteView } from "@/layouts";
import { mixinDevice } from "@/utils/mixin.js";

export default {
  components: {
    RouteView,
    PageView,
  },
  mixins: [mixinDevice],
  data() {
    return {
      // horizontal  inline
      mode: "inline",

      openKeys: [],
      defaultSelectedKeys: [],

      // cropper
      preview: {},
      option: {
        img: "/avatar2.jpg",
        info: true,
        size: 1,
        outputType: "jpeg",
        canScale: false,
        autoCrop: true,
        // 只有自动截图开启 宽度高度才生效
        autoCropWidth: 180,
        autoCropHeight: 180,
        fixedBox: true,
        // 开启宽度和高度比例
        fixed: true,
        fixedNumber: [1, 1],
      },

      pageTitle: "",
    };
  },
  created() {
    this.updateMenu();
  },
  methods: {
    onOpenChange(openKeys) {
      this.openKeys = openKeys;
    },
    updateMenu() {
      const routes = this.$route.matched.concat();
      this.defaultSelectedKeys = [routes.pop().path];
    },
  },
};
</script>

<style lang="less" scoped>
.account-settings-info-main {
  width: 100%;
  display: flex;
  height: 100%;
  overflow: auto;

  &.mobile {
    display: block;

    .account-settings-info-left {
      border-right: unset;
      border-bottom: 1px solid #e8e8e8;
      width: 100%;
      height: 50px;
      overflow-x: auto;
      overflow-y: scroll;
    }
    .account-settings-info-right {
      padding: 20px 40px;
    }
  }

  .account-settings-info-left {
    border-right: 1px solid #e8e8e8;
    width: 120px;
  }

  .account-settings-info-right {
    flex: 1 1;
    padding: 8px 40px;

    .account-settings-info-title {
      color: rgba(0, 0, 0, 0.85);
      font-size: 20px;
      font-weight: 500;
      line-height: 28px;
      margin-bottom: 12px;
    }
    .account-settings-info-view {
      padding-top: 12px;
    }
  }
}
</style>
