<template>
  <a-spin :spinning="confirmLoading"
          style="max-height: 900px; overflow-y: hidden; margin:0; padding:0;">
    <iframe :src="loadUrl"
            frameborder="no"
            border="0"
            width="100%"
            :height="dyheigth"
            :style="{'min-height':dyheigth}"></iframe>
  </a-spin>
</template>
<script>
import { ApiUrl } from '@/utils/request'
import { pagesUrl } from "@/config/serverstatus";
export default {
  data() {
    return {
      pagesUrl,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
      page: '',
      dyheigth: '',
      visible: false,
      confirmLoading: false,
      loadUrl: ''
    }
  },
  created() {
    console.log(this.$route.meta.query.pageId);
    this.dyheigth = (window.innerHeight) + 'px'
  
    this.loadUrl = this.pagesUrl[this.$route.meta.query.pageId]
  },
  methods: {

  }
}
</script>
