<template>
  <div>111</div>
</template>
<script>
export default {
 
  data() {
    return {
      description: '激活邮件已发送到你的邮箱中，邮件有效期为24小时。请及时登录邮箱，点击邮件中的链接激活帐户。',
      form: {}
    }
  },
  computed: {
    email() {
      const v = this.form && this.form.email || 'xxx'
      const title = `你的账户：${v} 注册成功`
      return title
    }
  },
  created() {
    this.form = this.$route.params;
    console.log(9999999999999999999999999)
  },
  methods: {
    goHomeHandle() {
      this.$router.push({ name: 'login' })
    }
  }
}
</script>

<style scoped>

</style>
