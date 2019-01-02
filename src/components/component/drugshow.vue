<template>
    <div>
       <!--  <div class="all" v-text="dragText">

        </div> -->
        <p class="title">{{dragText.标题}}</p>
        <ul style="text-align:left;">
            <li v-for="(item,index) in dragText" :key="index">{{index}}：{{item}}</li>
        </ul>
    </div>
</template>


<script>
export default {
  name: "drugshow",
  props: ["dragText"],
  data() {
    return {
   
    };
  },
  methods: {
    
  },
  created() {

  }
};
</script>



<style scoped>
.title {
    font-size: 18px;
    font-weight: 700;
}
</style>
