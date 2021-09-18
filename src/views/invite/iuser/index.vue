<template>
  <div>
    iuser 
  </div>
</template>

<script>
import moment from "moment";
export default {
  name: "",
  components: {

  },
  data() {
    return {
    }
  },
  created() {

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
};
</script>


