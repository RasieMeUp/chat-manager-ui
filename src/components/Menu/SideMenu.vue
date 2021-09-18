<template>
  <a-layout-sider
    :class="[
      'sider',
      isDesktop() ? null : 'shadow',
      theme,
      fixSiderbar ? 'ant-fixed-sidemenu' : null,
    ]"
    width="256px"
    :collapsible="collapsible"
    v-model="collapsed"
    :trigger="null"
  >
    <logo :title="logoTitle" />
    <s-menu
      :collapsed="collapsed"
      :menu="menus"
      :theme="theme"
      :mode="mode"
      @select="onSelect"
      style="padding:64px 0 16px 0px"
    ></s-menu>
  </a-layout-sider>
</template>

<script>
import Logo from "@/components/tools/Logo";
import SMenu from "./index";
import { mixin, mixinDevice } from "@/utils/mixin";
import { domTitle } from "@/utils/domUtil";
import { strFormat } from "@/utils/util";

export default {
  name: "SideMenu",
  components: { Logo, SMenu },
  mixins: [mixin, mixinDevice],
  props: {
    mode: {
      type: String,
      required: false,
      default: "inline",
    },
    theme: {
      type: String,
      required: false,
      default: "dark",
    },
    collapsible: {
      type: Boolean,
      required: false,
      default: false,
    },
    collapsed: {
      type: Boolean,
      required: false,
      default: false,
    },
    menus: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      logoTitle: "",
    };
  },
  created() {
    let title = strFormat(domTitle, [""]);
    if (this.$store.getters.orgName) {
      title = strFormat(domTitle, [this.$store.getters.orgName]);
    }
    this.logoTitle = title;
  },
  methods: {
    onSelect(obj) {
      this.$emit("menuSelect", obj);
    },
  },
};
</script>
