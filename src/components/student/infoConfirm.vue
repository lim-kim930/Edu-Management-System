<template>
  <el-form ref="ruleForm" label-width="100px" v-loading="loading" element-loading-text="拼命加载中" class="form"
    :style="{ 'max-height': this.vh - 105 + 'px' }">
    <el-menu :default-active="activeIndex" class="header_menu" mode="horizontal" @select="indexRouteSwitch">
      <el-menu-item index="1" style="font-size: 18px" :disabled="route !== null && route !== 0">学籍确认</el-menu-item>
      <el-menu-item index="2" style="font-size: 18px" >
        学业成绩确认</el-menu-item>
      <el-menu-item index="3" style="font-size: 18px" :disabled="(route === null && !confirmed) || (route !== null && route !== 2)">
        综合素质确认</el-menu-item>
      <el-menu-item index="4" style="font-size: 18px" :disabled="(route === null && !confirmed) || (route !== null && route !== 4)">
        排名确认</el-menu-item>
      <el-menu-item index="5" style="font-size: 18px" :disabled="(route === null && !confirmed) || (route !== null && route !== 5)">
        毕业确认</el-menu-item>
      <el-menu-item index="6" style="font-size: 18px" :disabled="(route === null && !confirmed) || (route !== null && route !== 3)">
        个人填写</el-menu-item>
    </el-menu>
    <router-view @func3="getRoute" style="padding-top: 60px;"></router-view>
  </el-form>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      route: null,
      activeIndex: "1",
      loading: false,
    };
  },
  computed: {
    ...mapGetters({
      vh: "view/afterCompared",
      confirmed: "student/getConfirmed"
    })
  },
  methods: {
    getRoute(route) {
      this.route = route;
    },
    indexRouteSwitch(key) {
      switch (key) {
        case "1":
          this.$router.push("/infoConfirm/profileConfirm");
          break;
        case "2":
          this.$router.push("/infoConfirm/scoreConfirm");
          break;
        case "3":
          this.$router.push("/infoConfirm/rewardConfirm");
          break;
        case "4":
          this.$router.push("/infoConfirm/rankConfirm");
          break;
        case "5":
          this.$router.push("/infoConfirm/gradConfirm");
          break;
        case "6":
          this.$router.push("/infoConfirm/intConfirm");
          break;
      }
    },
    redirect() {
      switch (this.$route.path) {
        case "/infoConfirm/profileConfirm":
          this.activeIndex = "1";
          break;
        case "/infoConfirm/scoreConfirm":
          this.activeIndex = "2";
          break;
        case "/infoConfirm/rewardConfirm":
          this.activeIndex = "3";
          break;
        case "/infoConfirm/rankConfirm":
          this.activeIndex = "4";
          break;
        case "/infoConfirm/gradConfirm":
          this.activeIndex = "5";
          break;
        case "/infoConfirm/intConfirm":
          this.activeIndex = "6";
          break;
      }
    },
  },
  watch: {
    $route() {
      this.redirect();
    }
  },
  mounted() {
    this.redirect();
  },
};
</script>

<style scoped>
.form {
  position: relative;
  overflow: auto;
  margin: 10px;
  width: calc(100% - 20px);
  min-width: 1250px;
  padding: 20px 80px 40px 80px;
  background-color: #fff;
  border: 1px solid rgba(204, 204, 204, 0.5);
  box-shadow: 0 2px 5px 1px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}
.header_menu {
  position: absolute;
  top: 20px;
  width: calc(100% - 160px);
  z-index: 10;
}
</style>