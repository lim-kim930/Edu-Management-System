<template>
  <el-container>
    <!-- 头部 -->
    <el-header class="logo">
      <div class="title">
        <span>教务—学业分享系统</span>
      </div>
      <div class="user">
        <el-badge v-if="globalFile === null" :hidden="true" class="item"
          style="width: 30px; height: 30px; margin-right: 15px; line-height: 30px !important">
          <el-upload ref="file-upload" class="upload" action="#" :http-request="uploadFile" :limit="1" accept=".enc"
            :show-file-list="false" :disabled="loading">
            <i class="el-icon-upload2" title="上传学业文件" style="color: #fff; font-size:20px"></i>
          </el-upload>
        </el-badge>
        <el-badge v-else is-dot :hidden="fileDownloaded" class="item"
          style="width: 30px; height: 30px; margin-right: 15px; line-height: 30px !important">
          <i :title="fileDownloaded ? '下载学业文件' : '新的学业文件未下载'" class="el-icon-download"
            style="font-size: 20px; color: #fff; cursor: pointer;" @click="DownloadFile()"></i>
        </el-badge>
        <el-badge :value="received" :hidden="received === 0" class="item"
          style="width: 30px; height: 30px; margin-right: 20px; line-height: 30px !important">
          <i title="消息中心" class="el-icon-message el-dropdown-link"
            style="font-size: 20px; color: #fff; cursor: pointer;" @click="msgRouteSwitch('received')"></i>
        </el-badge>
        <el-avatar :size="25" :src="circleUrl"></el-avatar>
        <span style="color: #fff;" id="uname">{{ uName === null ? "" : uName + " |" }}</span>
        <el-link :underline="false" @click="logOut()" style="font-size: 15px; color: #fff; margin-top: -4px">
          {{ uName === null ? "登录" : "退出登录" }}
          <i class="el-icon-caret-right"></i>
        </el-link>
      </div>
    </el-header>
    <!-- 主体 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :style="{ 'height': vh - 100 + 'px', 'width': isCollapse ? '64px' : '240px' }">
        <el-row class="tac">
          <el-col :span="24">
            <el-menu :default-active="activeIndex" @select="indexRouteSwitch" :collapse="isCollapse"
              background-color="#fff" text-color="#3a4b56" active-text-color="#409eff" class="aside">
              <el-submenu index="1">
                <template slot="title">
                  <i class="el-icon-s-grid"></i>
                  <span style="font-size: 20px">信息管理</span>
                </template>
                <el-menu-item index="1-1" style="padding:0 0 0 80px; font-size: 18px !important">信息确认</el-menu-item>
                <el-menu-item index="1-2" style="padding:0 0 0 80px; font-size: 18px !important"
                  :disabled="!xjConfirmed">成绩更改</el-menu-item>
                <el-menu-item index="1-3" style="padding:0 0 0 80px; font-size: 18px !important"
                  :disabled="!xjConfirmed">档案重置</el-menu-item>
              </el-submenu>
              <el-menu-item index="2" :disabled="!xjConfirmed">
                <i class="el-icon-share"></i>
                <span slot="title" style="font-size: 20px">信息分享</span>
              </el-menu-item>
              <el-menu-item index="3" :disabled="!xjConfirmed">
                <i class="el-icon-s-flag"></i>
                <span slot="title" style="font-size: 20px">岗位信息</span>
              </el-menu-item>
              <el-menu-item index="4" :disabled="!xjConfirmed">
                <i class="el-icon-s-promotion"></i>
                <span slot="title" style="font-size: 20px">信息公开设置</span>
              </el-menu-item>
              <el-menu-item index="5" :disabled="!xjConfirmed">
                <i class="el-icon-message-solid"></i>
                <span slot="title" style="font-size: 20px">消息中心</span>
              </el-menu-item>
              <!-- <el-menu-item index="6" :disabled="!xjConfirmed">
                <i class="el-icon-s-custom"></i>
                <span slot="title" style="font-size: 20px">账号设置</span>
              </el-menu-item>-->
            </el-menu>
          </el-col>
        </el-row>
        <span @click="isCollapse = !isCollapse" :title="isCollapse ? '展开' : '收起'" class="collapse"
          :style="{ 'width': isCollapse ? '64px' : '240px' }">
          <i style="font-size: 14px" :class="isCollapse ? 'el-icon-arrow-right' : 'el-icon-arrow-left'">
            <span :style="{ 'font-size': isCollapse ? '0' : '14px' }">{{ isCollapse ? "" : "点击收起" }}</span>
          </i>
        </span>
      </el-aside>
      <!-- 内容 -->
      <el-main :style="{ 'height': this.vh - 80 + 'px' }">
        <router-view v-loading="loading" element-loading-text="拼命加载中" @func3="getReceived" @func4="getFrequency"
          :frequency="reqFrequency" :received="received"></router-view>
      </el-main>
      <el-drawer :show-close="false" :with-header="false" :visible="noticeShow" direction="rtl" size="50%">
        <h2 style="text-align: center; padding: 10px; user-select: none;">首次使用须知! ! ! !</h2>
        <el-alert style="font-size: 16px" title="内容不多, 但为了避免影响使用体验, 请仔细阅读哦" type="warning" :wrapperClosable="false"
          show-icon :closable="false"></el-alert>
        <div style="padding: 20px 10px; color: #303133">
          <h3 style="text-indent: 1em">1.首次进入系统后, 会被强制进行第一步————学籍确认, 在完成之前你将不能使用其他功能。</h3>
          <h3>在检查信息无误并点击确认后, 会进入有点漫长的加载状态, 但只会进行这一次, 所以还请耐心等待加载完毕。</h3>
          <h3>然后请并务必按照提示, 下载和保存好一个叫做"学业文件.enc"的文件, 它存储了你以后确认和写入的所有信息</h3>
          <h3>因此它是你完整使用这个系统的前提, 并且一旦丢失将无法找回, 你写入的信息也将随之丢失。</h3>
          <el-divider>~</el-divider>
          <h3 style="text-indent: 1em">2.在每确认/写入一次文件后, 系统内保存的文件内容都会更新, 你可以根据提示选择是否下载新的文件到本地</h3>
          <h3>如果选择下载, 因为浏览器或设置的不同, 请根据自己的情况保存好新的文件, 旧的文件也就失效了, 可以直接替换掉</h3>
          <h3>如果选择不下载, 可以关闭提示弹窗, 然后继续进行其他操作, 但请不要忘记你还有新的文件没有下载, 在页面右上角也会有红点提示</h3>
          <h3>如果你未下载最新的文件, 在尝试退出登录、刷新、关闭标签页或者浏览器时, 会收到浏览器的提示, 此时请取消退出操作, 然后点击下载按钮进行下载</h3>
          <el-divider>~</el-divider>
          <h3 style="text-indent: 1em">3.使用2k等高分辨率屏幕的小伙伴往往会调大系统显示的缩放比例, 而这样你可能就会发现页面显得'大'和'怪', 有各种各样的滚动条</h3>
          <h3>所以为了不影响使用体验, 请缩小浏览器页面的缩放比例(
            <el-link target="_blank" type="primary" href="https://support.apple.com/zh-cn/guide/safari/cpsh003/mac">Mac:
              Safari</el-link>,
            <el-link target="_blank" type="primary"
              href="https://support.microsoft.com/zh-cn/microsoft-edge/microsoft-edge-%E4%B8%AD%E7%9A%84%E8%BE%85%E5%8A%A9%E5%8A%9F%E8%83%BD-4c696192-338e-9465-b2cd-bd9b698ad19a">
              Win: Edge/Chrome</el-link>),
            使得当前这个页面不出现滚动条为最佳
          </h3>
        </div>
        <el-button style="margin: 20px 0 20px 20px" plain type="primary" @click="noticeShow = false;">我知道啦</el-button>
      </el-drawer>
    </el-container>
  </el-container>
</template>
<script>
import getOrigionWindowHeight from '../util/viewHeight';
import { mapGetters, mapMutations } from 'vuex';
import { downloadFile } from '../util/fileHandler';
export default {
  data() {
    return {
      circleUrl: "https://edu.limkim.cn/static/user.png",// 头像url
      activeIndex: "1",// 侧边导航默认选中值
      loading: false,// main的加载
      uName: null,// 用户名
      // file: null,// 文件
      received: 0,// 收件箱数量
      reqFrequency: 300,
      msgTimer: null,
      known: false,
      isCollapse: false,
      noticeShow: false,
      // downloaded: true,
    };
  },
  computed: {
    ...mapGetters({
      vh: "view/afterCompared",
      globalFile: "student/getFile",
      fileDownloaded: "student/getFileDownloaded",
      xjConfirmed: "student/getConfirmed"
    })
  },
  methods: {
    ...mapMutations({
      setViewHeight: "view/setHeight",
      setFile: "student/setFile",
      setFileDownloaded: "student/setDownloaded",
      setConfirmed: "student/setConfirmed"
    }),
    // 页面自适应屏幕高度
    adaptiveHeight() {
      // 拿到屏幕高度
      const height = getOrigionWindowHeight();
      this.setViewHeight(height);
    },
    // 前往消息中心
    msgRouteSwitch(command) {
      if (this.xjConfirmed)
        this.$router.push("/message/" + command);
    },
    // 右上角按钮下载文件
    DownloadFile() {
      downloadFile();
      setTimeout(() => {
        this.$confirm("学业文件已经开始下载, 请前往浏览器默认下载位置查看, 如未设置, 请手动选择下载路径并妥善保存", "提示", {
          confirmButtonText: "确定",
          showCancelButton: false,
          type: "success"
        });
      }, 400);
    },
    //拿到子组件传来的学业文件,全局存储在student页面
    // getFile(file) {
    //   if (this.file !== "")
    //     this.downloaded = false;
    //   this.file = file;
    // },
    uploadFile(params) {
      const len = params.file.name.length;
      if (params.file.name.substr(len - 4, 4) !== ".enc")
        return this.$message.error("请上传正确的学业文件");
      this.loading = true;
      let data = new FormData();
      data.append("dataFile", params.file);
      this.axios({
        method: "post",
        url: "/dataFile/get?staffID=" + JSON.parse(localStorage.getItem("jw_student_file")).staffID,
        headers: { "Authorization": "token " + JSON.parse(localStorage.getItem("jw_student_file")).token, 'Content-Type': 'multipart/form-data' },
        data
      }).then(() => {
        this.loading = false;
        this.setFile(params.file);
      }).catch((err) => {
        if (err.response.data.msg === "file hash does not equal to chain")
          this.$message.error("学业文件错误或者过期,请检查后再试");
        else
          this.$message.error("获取学业文件信息出错啦,请稍后再试");
        this.loading = false;
        this.$refs["file-upload"].clearFiles();
        this.setFile(null);
      });
    },
    //拿到子组件传来的学籍确认状态,全局存储在student页面
    // getConfirmed(confirmed) {
    //   let userData = JSON.parse(localStorage.getItem("jw_student_file"));
    //   this.xjConfirmed = confirmed;
    //   userData.xjConfirmed = this.xjConfirmed;
    //   localStorage.setItem("jw_student_file", JSON.stringify(userData));
    // },
    // getDownloaded(downloaded) {
    //   this.downloaded = downloaded;
    // },
    getReceived(received) {
      this.received = received;
    },
    getFrequency(frequency) {
      this.reqFrequency = frequency;
      clearInterval(this.msgTimer);
      if (frequency !== 0)
        this.msgTimer = setInterval(() => {
          this.getMsg(JSON.parse(localStorage.getItem("jw_student_file")));
        }, this.reqFrequency * 1000);
    },
    //路由切换
    indexRouteSwitch(key) {
      switch (key) {
        case "1-1":
          this.$router.push("/infoConfirm/profileConfirm");
          break;
        case "1-2":
          this.$router.push("/scoreChange");
          break;
        case "1-3":
          this.$router.push("/arcManage");
          break;
        case "2":
          this.$router.push("/infoShare");
          break;
        case "3":
          this.$router.push("/infoSquare");
          break;
        case "4":
          this.$router.push("/infoDisclose");
          break;
        case "5":
          this.$router.push("/message/received");
          break;
        case "6":
          this.$router.push("/accountManage");
          break;
      }
    },
    //退出登录
    logOut() {
      if (this.uName === null) {
        //没有用户信息直接定向到登录
        location.href = "https://edu.limkim.cn/sign";
      }
      else {
        this.$confirm("确定要退出登录吗?" + (this.fileDownloaded ? "" : "你好像还没有下载最新的学业文件到本地"), "提示", {
          confirmButtonText: "确定",
          cancelButtonText: this.fileDownloaded ? "取消" : "现在下载",
          type: "warning"
        }).then(() => {
          //清除localStorage里的用户信息,定向到登录
          localStorage.removeItem("jw_student_file");
          localStorage.removeItem("jw_student_msg");
          window.location.href = "../sign";
        }).catch(() => {
          if (this.fileDownloaded)
            return;
          this.DownloadFile();
        });
      }
    },
    //根据路由匹配activeIndex
    redirect() {
      if (this.xjConfirmed === true)
        switch (this.$route.path) {
          case "/infoConfirm/scoreConfirm":
          case "/infoConfirm/rewardConfirm":
          case "/infoConfirm/gradConfirm":
          case "/infoConfirm/profileConfirm":
          case "/infoConfirm/intConfirm":
          case "/infoConfirm/rankConfirm":
            this.activeIndex = "1-1";
            break;
          case "/scoreChange":
            this.activeIndex = "1-2";
            break;
          case "/arcManage":
            this.activeIndex = "1-3";
            break;
          case "/infoShare":
            this.activeIndex = "2";
            break;
          case "/infoSquare":
            this.activeIndex = "3";
            break;
          case "/infoDisclose":
            this.activeIndex = "4";
            break;
          case "/message/received":
          case "/message/sent":
            this.activeIndex = "5";
            break;
          case "/accountManage":
            this.activeIndex = "6";
            break;
        }
      else if (this.xjConfirmed === false)
        switch (this.$route.path) {
          case "/infoConfirm/profileConfirm":
            this.activeIndex = "1-1";
            break;
          default:
            setTimeout(() => {
              this.$confirm("您还没有确认学籍信息,请确认后再来吧", "提示", {
                confirmButtonText: "确定",
                showCancelButton: false,
                type: "warning",
                showClose: false,
                closeOnClickModal: false,
                closeOnPressEscape: false
              }).then(() => {
                this.$router.push("/infoConfirm/profileConfirm");
              });
            }, 100);
        }
      else {
        this.$router.push("/infoConfirm/profileConfirm");
        this.activeIndex = "1-1";
      }
    },
    getMsg(userData) {
      this.axios({
        method: "post",
        url: "/share/listFurtherShareRequestForReceiver",
        headers: { "Authorization": "token " + userData.token },
        data: { "student": "any" }
      }).then((response) => {
        this.received = 0;
        const data = response.data.data;
        for (let i = 0; i < data.length; i++) {
          if (!data[i].Read)
            this.received++;
        }
        return this.axios({
          method: "get",
          url: "/campusTalk/lookupForSelf",
          headers: { "Authorization": "token " + userData.token },
          data: { "StaffID": userData.staffID }
        });
      }).then((response) => {
        const data = response.data.data;
        for (let i = 0; i < data.length; i++) {
          if (!data[i].Read)
            this.received++;
        }
        this.loading = false;
      }).catch(() => {
        this.$message.error("获取站内信息出错啦,请稍后再试");
        this.loading = false;
      });
    }
  },
  watch: {
    $route() {
      this.redirect();
    }
  },
  created() {
    // 判断是否登录
    if (localStorage.getItem("jw_student_file") === null) {
      this.redirect();
      this.$confirm("您还未登录,请前往登录", "提示", {
        confirmButtonText: "去登录",
        showCancelButton: false,
        type: "warning",
        showClose: false,
        closeOnClickModal: false,
        closeOnPressEscape: false
      }).then(() => {
        window.location.href = "../sign";
      });
    }
    else {
      this.loading = true;
      let userData = JSON.parse(localStorage.getItem("jw_student_file"));
      this.uName = userData.staffID;
      if (!JSON.parse(localStorage.getItem("jw_student_msg")))
        localStorage.setItem("jw_student_msg", 300);
      this.reqFrequency = JSON.parse(localStorage.getItem("jw_student_msg"));
      // 拿学籍确认状态
      this.axios({
        method: "get",
        url: "/dataFile/getFileID",
        headers: { "Authorization": "token " + userData.token },
      }).then((response) => {
        const confirmed = response.data.data.FileID === "null" ? false : true;
        this.setConfirmed(confirmed);
        userData.xjConfirmed = this.xjConfirmed;
        localStorage.setItem("jw_student_file", JSON.stringify(userData));
        this.redirect();
        if (this.xjConfirmed) {
          if (localStorage.getItem("new_upload_notice") === null) {
            this.$notify({
              type: "warning",
              title: '提示',
              message: '学业文件上传按钮已统一移至右上角',
              duration: 0,
              offset: 100,
              onClose: () => { localStorage.setItem("new_upload_notice", true); }
            });
          }
          this.getMsg(userData);
          this.msgTimer = setInterval(() => {
            this.getMsg(userData);
          }, this.reqFrequency * 1000);
        }
        else {
          this.loading = false;
          this.noticeShow = true;
        }
      }).catch((err) => {
        this.loading = false;
        if (err.response.data.msg === "unauthorized") {
          return this.$confirm("您还未登录,请前往登录", "提示", {
            confirmButtonText: "去登录",
            showCancelButton: false,
            type: "warning",
            showClose: false,
            closeOnClickModal: false,
            closeOnPressEscape: false
          }).then(() => {
            window.location.href = "../sign";
          });
        }
        this.$message.error("获取学业文件状态出错啦,请稍后重试");
        this.redirect();
      });
    }
  },
  mounted() {
    // 刷新和关闭标签页提示
    window.onbeforeunload = (e) => {
      if (!this.fileDownloaded) {
        e = e || window.event;
        // 兼容IE8和Firefox 4之前的版本
        if (e)
          e.returnValue = "done";
        return this.$confirm("你好像还没有下载最新的学业文件到本地", "提示", {
          confirmButtonText: "现在下载",
          cancelButtonText: "已下载",
          type: "warning"
        }).then(() => {
          this.DownloadFile();
        });
      }
    };
    this.adaptiveHeight();
    window.onresize = () => this.adaptiveHeight();
  },
  destroyed() {
    window.onbeforeunload = null;
  }
};
</script>

<style scoped>
.title {
  float: left;
  width: 240px;
  height: 80px;
  line-height: 80px;
  margin-left: 330px;
  font-size: 26px;
  color: #fff;
  font-weight: 700;
}

.el-header {
  background: url(../assets/img/logo.png) no-repeat;
  background-position: 20px;
  background-size: 300px;
  background-color: #468dba;
  box-shadow: 0 2px 4px 1px var(--cb-color-shadow, rgba(0, 0, 0, 0.13));
  z-index: 99;
  height: 80px !important;
  min-width: 1500px;
}

.user {
  float: right;
  width: 300px;
  height: 80px;
  margin-right: 10%;
  text-align: center;
  line-height: 80px;
}

#uname {
  display: inline-block;
  margin: 0 5px;
}

.el-container {
  background-color: rgba(224, 224, 224, 0.685);
  min-width: 1500px !important;
}

.el-main {
  padding: 0 !important;
  background-size: 100%;
  height: 800px;
}

.el-header .el-menu-item {
  padding: 0 30px !important;
}

.el-aside {
  margin-top: 1px;
  background-color: #fff;
  margin: 10px;
  border-radius: 10px;
  transition: all 0.5s;
  position: relative;
}

.el-aside .collapse {
  cursor: pointer;
  text-align: center;
  display: inline-block;
  height: 30px;
  line-height: 30px;
  transition: all 0.5s;
  color: #909399;
  position: absolute;
  bottom: 0;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}

.el-aside .collapse span {
  transition: all 0.3s;
  user-select: none;
}

.el-aside .collapse:hover {
  background-color: #ccc;
}

.aside .el-menu-item {
  height: 60px !important;
  line-height: 60px !important;
  padding-left: 10px;
}

.el-menu--collapse .el-menu .el-submenu,
.el-menu--popup {
  width: 100px !important;
  min-width: 100px !important;
}

.el-menu--popup li {
  padding-left: 0 !important;
  text-align: center;
}

.el-avatar {
  vertical-align: middle !important;
}

.el-aside ul {
  border: none;
}

.el-drawer h3 {
  padding: 5px;
  line-height: 25px;
}
</style>
<style>
* {
  margin: 0px;
  padding: 0px;
  text-decoration: none;
  list-style: none;
  outline: none;
  box-sizing: border-box;
}

.item .el-badge__content {
  line-height: 16px;
}

.el-badge .is-dot {
  border: none;
}
</style>
