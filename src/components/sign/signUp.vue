<template>
  <el-form ref="form" :rules="rules">
    <el-form-item style="margin-bottom: 27px" prop="uname">
      <el-input
        placeholder="请输入企业名称"
        prefix-icon="el-icon-s-custom"
        v-model="uname"
        clearable
        maxlength="10"
      ></el-input>
      <el-popover
        placement="right-start"
        title="注意："
        width="200"
        trigger="hover"
        content="企业名由字母、数字以及汉字组成，区分大小写"
      >
        <i slot="reference" class="el-icon-warning-outline" style="cursor: pointer; color: #E6A23C"></i>
      </el-popover>
    </el-form-item>
    <!-- <el-form-item style="margin-bottom: 27px" prop="eAddress">
      <el-input placeholder="请输入邮箱地址" prefix-icon="el-icon-message" v-model="eAddress" clearable>
        <el-select v-model="com" slot="append" placeholder="请选择" style=" width: 140px">
        <el-option label="@qq.com" value="@qq.com"></el-option>
        <el-option label="@163.com" value="@163.com"></el-option>
        <el-option label="@gmail.com" value="@gmail.com"></el-option>
    </el-select></el-input>
    <el-popover
        placement="right-start"
        title="注意："
        width="200"
        trigger="hover"
        content="请确保该邮箱真实可用，我们将会发送一条验证码至该邮箱，输入验证码才能完成验证"
      >
      <i slot="reference" class="el-icon-warning-outline" style="cursor: pointer; color: #E6A23C"></i></el-popover>
    </el-form-item>-->
    <el-form-item style="margin-bottom: 27px" prop="password">
      <el-input
        placeholder="请输入密码"
        v-model="password"
        prefix-icon="el-icon-lock"
        clearable
        maxlength="16"
        show-password
      ></el-input>
      <el-popover
        placement="right-start"
        title="注意："
        width="200"
        trigger="hover"
        content="密码由6~14位字母、数字和唯一符号@组成,区分大小写"
      >
        <i slot="reference" class="el-icon-warning-outline" style="cursor: pointer; color: #E6A23C"></i>
      </el-popover>
    </el-form-item>
    <!-- <el-form-item  style="margin-bottom: 27px" prop="code">
      <el-input placeholder="请输入验证码" prefix-icon="el-icon-key" v-model='code' clearable maxlength="6"></el-input>
    </el-form-item>-->
    <el-form-item style="margin-bottom: 10px">
      <!-- <el-button type="primary" @click="getCode()" style="width: 120px;" :loading="btnLoad1" :disabled = "disabled1">{{placeholder}}</el-button> -->
      <el-button
        type="primary"
        @click="onSubmit()"
        style="width: 300px;"
        :loading="btnLoad2"
        :disabled="disabled2"
      >立即注册</el-button>
    </el-form-item>
    <div class="footer">
      <el-link
        style="margin-right: 170px"
        type="info"
        :underline="false"
        target="_blank"
        href="http://wpa.qq.com/msgrd?v=3&uin=1625753207&site=qq&menu=yes&hm"
      >遇到问题?</el-link>
      <el-link type="info" :underline="false" @click="signIn">立即登录</el-link>
    </div>
  </el-form>
</template>
<script>
export default {
  data() {
    var validateUname = (rule, value, callback) => {
      if (this.uname === "")
        return false;
      var newUname = this.uname.replace(/\s/g, "");
      if (newUname.length <= 1) {
        callback(new Error("用户名长度为2~10位，不能包含空格"));
        this.uname = "";
        return false;
      }
      // var zg =  /^[0-9a-zA-Z]*$/;
      // if (!zg.test(newUname)){
      //   callback(new Error("用户名只能由数字和字母组成"));
      //   this.uname = "";
      //   return false;
      // }
      callback();
    };
    var validatePwd = (rule, value, callback) => {
      if (this.password === "")
        return false;
      var newpassword = this.password.replace(/\s/g, "");
      if (newpassword.length <= 5) {
        callback(new Error("密码长度为6~14位，不能包含空格"));
        this.password = "";
        return false;
      }
      var zg = /^[0-9a-zA-Z]*$/;
      if (!zg.test(newpassword)) {
        var newPwd = newpassword.replaceAll("@", "");
        if (!zg.test(newPwd)) {
          callback(new Error("密码只能由数字和字母和@组成"));
          this.password = "";
        }
      }
      callback();
    };
    var validateAdd = (rule, value, callback) => {
      if (this.eAddress === "")
        return false;
      var neweAddress = this.eAddress.replace(/\s/g, "");
      if (neweAddress.length === 0 || neweAddress.length != this.eAddress.length) {
        callback(new Error("请输入正确邮箱"));
        this.eAddress = "";
        return false;
      }
      callback();
    };
    var validateCode = (rule, value, callback) => {
      if (this.code === "")
        return false;
      var newcode = this.code.replace(/\s/g, "");
      if (newcode.length != 6) {
        callback(new Error("验证码为6位数字"));
        this.code = "";
        return false;
      }
      var zg = /^\d+$/;
      if (!zg.test(newcode)) {
        callback(new Error("验证码为6位数字"));
        this.code = "";
      }
      callback();
    };
    return {
      com: "",
      uname: "",
      code: "",
      eAddress: "",
      password: "",
      placeholder: "发送验证码",
      btnLoad1: false,
      disabled1: true,
      btnLoad2: false,
      disabled2: false,
      rules: {
        uname: [
          { validator: validateUname, trigger: "blur" },
        ],
        password: [
          { validator: validatePwd, trigger: "blur" },
        ],
        eAddress: [
          { validator: validateAdd, trigger: "blur" },
        ],
        code: [
          { validator: validateCode, trigger: "blur" },
        ]
      },
    };
  },
  methods: {
    signIn() {
      this.$router.push("/signIn");
    },
    getCode() {
    },
    onSubmit() {
    },
  },
};
</script>

<style scoped>
.el-form {
  margin: 50px 130px 0 90px;
  width: 340px;
  height: 250px;
  padding: 5px 5px;
  background-color: rgba(255, 255, 255, 0);
}
.el-input {
  width: 300px;
  margin-right: 5px;
}
.footer {
  user-select: none;
}
</style>
<style>
.el-input-group__append {
  padding-left: 0 !important;
}
</style>