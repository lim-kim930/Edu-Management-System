<template>
  <el-form ref="form">
    <h3 style="font-weight: 400; margin-bottom: 30px; color: #909399">企业账号密码登录</h3>
    <el-form-item style="margin-bottom: 27px">
      <el-input
        placeholder="请输入企业账号"
        v-model="name"
        style="width: 100%"
        prefix-icon="el-icon-user"
        clearable
        @keyup.enter.native="onSubmit()"
      ></el-input>
    </el-form-item>
    <el-form-item style="margin-bottom: 27px">
      <el-input
        type="password"
        placeholder="请输入密码"
        v-model="pwd"
        style="width: 100%"
        prefix-icon="el-icon-key"
        clearable
        show-password
        @keyup.enter.native="onSubmit()"
      ></el-input>
    </el-form-item>
    <el-form-item style="margin-bottom: 5px">
      <el-button type="primary" @click="onSubmit()" style="width: 100%" :loading="btnLoad">登录</el-button>
    </el-form-item>
    <div class="footer">
      <el-link
        type="info"
        :underline="false"
        target="_blank"
        href="http://wpa.qq.com/msgrd?v=3&uin=1625753207&site=qq&menu=yes&hm"
      >遇到问题?</el-link>
    </div>
  </el-form>
</template>
<script>
export default {
  data() {
    return {
      name: "",
      pwd: "",
      btnLoad: false,// 登录按钮加载
    };
  },
  methods: {
    onSubmit() {
      this.btnLoad = true;
      if (this.name.trim().length === 0 || this.pwd.trim().length === 0) {
        this.$message.error("请正确填写账号和密码");
        this.btnLoad = false;
        return;
      }
      this.axios({
        method: "post",
        url: "/company/login",
        data: {
          "CompanyCode": this.name,
          "Passphrase": this.pwd
        }
      }).then((response) => {
        this.$message.success("登录成功");
        localStorage.setItem("jw_ent_file", JSON.stringify({
          CompanyCode: this.name,
          authorization: response.headers.authorization
        }));
        window.location = "../company";
      }).catch(() => {
        this.$message.error("账号或密码错误,请检查后再试");
        this.btnLoad = false;
      });
    }
  },
};
</script>

<style scoped>
.el-form {
  margin: 60px 90px 0 90px;
  width: calc(100% - 180px);
  height: 300px;
  padding: 5px 5px;
  background-color: rgba(255, 255, 255, 0);
}
.footer {
  user-select: none;
}
</style>v
