<template>
  <el-tabs
    tab-position="left"
    class="received"
    :style="{'max-height': this.wh - 230 + 'px', 'margin-top': '10px'}"
  >
    <el-tab-pane style="font-size: 17px">
      <span slot="label">
        <el-badge :value="received" :max="99" class="item" v-show="received !== 0"></el-badge>
        <i class="el-icon-share"></i> 简历分享
      </span>
      <!-- <el-dropdown @command="classifySwitch" style="cursor: pointer; margin: 10px 30px 0 71%">
          <span class="el-dropdown-link">
            分类依据 : {{classify}}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="无">无</el-dropdown-item>
            <el-dropdown-item command="学校">学校</el-dropdown-item>
            <el-dropdown-item command="应聘岗位">应聘岗位</el-dropdown-item>
          </el-dropdown-menu>
      </el-dropdown>-->
      <el-dropdown @command="sortSwitch" style="cursor: pointer;  margin: 10px 30px 10px 80%">
        <span class="el-dropdown-link">
          排序方式 : {{sort}}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="过期时间▼">过期时间▼</el-dropdown-item>
          <el-dropdown-item command="过期时间▲">过期时间▲</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <div
        style="height: 175px"
        v-for="item in receivedMsgData"
        v-bind:key="item.index"
        @click="goQuery(item.url)"
      >
        <el-col :span="8" class="card">
          <el-card shadow="hover" style="cursor: pointer;">
            <el-link
              type="danger"
              style="float: right"
              @click.stop="deleteMsg(item.ShareLinkID, item.index, item.Read)"
            >删除</el-link>
            <h5>就读学校: {{item.SchoolCode === "1"?"杭州电子科技大学":item.SchoolCode}}</h5>
            <h5>就读专业: {{item.MajorName}}</h5>
            <h5>应聘岗位: {{item.TargetJob}}</h5>
            <h5>过期时间: {{item.date}}</h5>
            <h5>
              状态: {{item.Read?"已读":"未读"}}
              <el-badge :hidden="item.Read" value="new" class="badge"></el-badge>
            </h5>
          </el-card>
        </el-col>
      </div>
      <el-divider v-if="receivedMsgData.length !== 0" style="padding: 2%">没有更多啦~</el-divider>
      <el-empty v-show="receivedMsgData.length === 0" :image-size="200" description="您还没有收到的消息哦~"></el-empty>
    </el-tab-pane>
    <el-tab-pane>
      <span slot="label">
        <i class="el-icon-setting"></i> 消息设置
      </span>
      <el-form>
        <h5 style="font-size: 16px; margin-bottom: 10px;">消息刷新频率(消息收件箱的刷新频率)</h5>
        <el-form-item>
          <el-radio-group v-model="reqFrequency" @change="freChange">
            <el-radio
              style="margin: 0 5px"
              border
              :label="item.value"
              v-for="item in freOptions"
              :key="item.value"
            >{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-divider style="margin: 0"></el-divider>
      </el-form>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
export default {
  data() {
    return {
      sort: "过期时间▲",
      classify: "无",
      receivedMsgData: [],
      freOptions: [
        { value: 0, label: "关闭" },
        { value: 180, label: "3分钟" },
        { value: 300, label: "5分钟" },
        { value: 600, label: "10分钟" },
      ],
      reqFrequency: 300,
      received: 0
    };
  },
  props: ["wh", "frequency"],
  methods: {
    classifySwitch(command) {
      this.classify = command;
    },
    sortSwitch(command) {
      if (command !== this.sort) {
        this.sort = command;
        const temp = this.receivedMsgData;
        this.receivedMsgData = [];
        for (let i = 0; i < temp.length; i++)
          this.receivedMsgData[i] = temp[temp.length - i - 1];
      }
    },
    freChange(v) {
      this.$emit("func3", v);
    },
    goQuery(url) {
      this.$router.push({
        path: "/queryInfo",
        query: { url }
      });
    },
    deleteMsg(ShareLinkID, index, Read) {
      this.$emit("func2", true);
      this.axios({
        method: "put",
        url: "/share/deleteShareLinkForCompany",
        headers: { "Authorization": JSON.parse(localStorage.getItem("jw_ent_file")).authorization },
        data: { ShareLinkID }
      }).then(() => {
        this.receivedMsgData.splice(index, 1);
        if (!Read) {
          this.$emit("func", this.received - 1);
          this.received--;
        }
        this.$message.success("删除成功!");
        this.$emit("func2", false);
      }).catch(() => {
        this.$message.error("删除信息出错啦,请稍后再试");
        this.$emit("func2", false);
      });
    }
  },
  created() {
    this.$emit("func2", true);
    let jobTranslation = {};
    let majorTranslation = {};
    this.axios({
      method: "post",
      url: "/job/lookup",
      data: { "CompanyCode": JSON.parse(localStorage.getItem("jw_ent_file")).CompanyCode }
    }).then(response => {
      const data = response.data.data;
      const type = Object.keys(data);
      for (let i = 0; i < type.length; i++)
        for (let j = 0; j < data[type[i]].length; j++)
          jobTranslation[data[type[i]][j].JobID] = data[type[i]][j].Name;
      return this.axios({
        method: "get",
        url: "/info/listMajor",
      });
    }).then(response => {
      const data = response.data.data;
      for (let i = 0; i < data.length; i++)
        majorTranslation[data[i].MajorCode] = data[i].MajorName;
      return this.axios({
        method: "post",
        url: "/share/lookupShareLinkForCompany",
        headers: { "Authorization": JSON.parse(localStorage.getItem("jw_ent_file")).authorization },
        data: { "schoolCode": "1" }
      });
    }).then((response) => {
      const data = response.data.data;
      const newData = data.sort((a, b) => {
        return new Date(a.ExpireAt) - new Date(b.ExpireAt);
      });
      let readed = [], unReaded = [];
      for (let i = 0; i < newData.length; i++) {
        if (!newData[i].Read) {
          this.received++;
          unReaded.push(newData[i]);
        }
        else
          readed.push(newData[i]);
        newData[i].TargetJob = jobTranslation[newData[i].TargetJobID];
        newData[i].MajorName = majorTranslation[newData[i].MetaData.MajorCode];
        newData[i].index = i;
        newData[i].date = new Date(+new Date(newData[i].ExpireAt) + 8 * 3600 * 1000).toISOString().replace(/T/g, " ").replace(/\.[\d]{3}Z/, "");
        newData[i].url = "/share/verify?fileID=" + newData[i].FileID + "&encryptedK1S=" + newData[i].EncryptedK1S;
      }
      this.$emit("func", this.received);
      this.receivedMsgData = [...unReaded, ...readed];
      this.$emit("func2", false);
    }).catch(() => {
      this.$message.error("获取站内信息出错啦,请稍后再试");
      this.$emit("func2", false);
    });
  },
  mounted() {
    this.reqFrequency = this.frequency;
    this.$nextTick(() => {
      document.querySelector(".el-tabs .el-tabs__content").style.height = this.wh - 230 + "px";
      document.querySelector(".el-tabs .el-tabs__header").style.height = this.wh - 230 + "px";
    });
  }
};
</script>

<style scoped>
.el-form {
  padding: 20px;
}
.card {
  margin: 10px 2%;
  height: 155px;
  border-radius: 10px;
  width: 95%;
}
.card h5 {
  margin: 5px 0;
}
.card h5:first-child {
  margin: 0;
}
.el-card {
  height: 155px;
  border-radius: 5px;
  background-color: rgb(252, 252, 252);
}
.item {
  margin-top: -2px;
  margin-right: 3px;
  padding-top: 8px;
}
</style>
<style>
.el-card__body {
  padding: 15px 20px;
}
/* 未读状态 */
.badge {
  width: 73px;
}
.badge .el-badge__content {
  line-height: 12px;
}
.el-tabs .el-tabs__content {
  overflow: auto;
}
.el-tabs .el-tabs__item {
  font-size: 16px;
  width: 180px;
}
.received #tab-1 {
  border-top: 1px solid #ccc;
}
.el-tabs .el-divider--horizontal {
  width: 95%;
  margin-left: 2%;
}
.el-tabs .el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
</style>