<template>
  <div class="page-header-index-wide">
    <ul class="u-grid">
    </ul>
  </div>
</template>

<script>
export default {
  name: "basepage",
  components: {
  },
  data() {
    return {};
  },
  created() {},
  watch: {},
  methods: {
    handleRedirect(__name) {
      this.$router.push({ name: __name });
    },
  },
};
</script>

