<template>
  <el-form
    class="form"
    ref="form"
    label-width="80px"
    v-loading="loading"
    element-loading-text="拼命加载中"
    :style="{'max-height': this.wh - 105 + 'px', 'overflow': this.loading?'hidden':'auto'}"
  >
    <!-- <el-select
      v-model="conditions.UnitCode"
      filterable
      placeholder="学院名称"
      style="width: 190px; margin: 0 10px"
    >
      <el-option
        v-for="item in options[0].children"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>
    <el-select v-model="conditions.MajorCode" filterable placeholder="专业名称" style="width: 190px;">
      <el-option
        v-for="item in options[1].children"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>
    <el-select
      v-model="conditions.Sex"
      filterable
      placeholder="性别"
      style="width: 80px; margin: 0 10px"
    >
      <el-option
        v-for="item in options[2].children"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>-->
    <span>请选择筛选条件:</span>
    <el-button type="primary" @click="getInfo()" style="margin: 10px 0 0 10px">点击筛选</el-button>
    <el-button type="primary" plain @click="resetConditions()" style="margin-bottom: 10px">清空</el-button>
    <el-form class="coditions" label-width="110px">
      <el-form-item label="匹配规则">
        <el-radio-group v-model="method">
          <el-radio
            style="margin: 0 5px"
            :label="item.value"
            v-for="item in options[7].children"
            :key="item.value"
            border
          >{{item.label}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="就读专业">
        <el-select
          v-model="conditions.MajorCode"
          filterable
          placeholder="请选择"
          style="width: 190px; margin-left: 5px"
        >
          <el-option
            v-for="item in options[1].children"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="GPA">
        <el-input
          style="width: 90px; margin-left: 5px"
          v-model="conditions.GPA[0]"
          placeholder="gpa下限"
        ></el-input>
        <el-input
          style="width: 90px; margin: 0 10px"
          v-model="conditions.GPA[1]"
          placeholder="gpa上限"
        ></el-input>
      </el-form-item>
      <el-form-item label="奖学金获得情况">
        <el-radio-group v-model="conditions.Jxj">
          <el-radio
            style="margin: 0 5px"
            :label="item.value"
            border
            v-for="item in options[3].children"
            :key="item.value"
          >{{item.label}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="竞赛获奖情况">
        <el-radio-group v-model="conditions.Js">
          <el-radio
            style="margin: 0 5px"
            border
            :label="item.value"
            v-for="item in options[4].children"
            :key="item.value"
          >{{item.label}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="班团工作">
        <el-radio-group v-model="conditions.Club">
          <el-radio
            style="margin: 0 5px"
            :label="item.value"
            border
            v-for="item in options[5].children"
            :key="item.value"
          >{{item.label}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="社会工作">
        <el-radio-group v-model="conditions.Social">
          <el-radio
            style="margin: 0 5px"
            :label="item.value"
            border
            v-for="item in options[6].children"
            :key="item.value"
          >{{item.label}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="性别">
        <el-radio-group v-model="conditions.Sex">
          <el-radio
            style="margin: 0 5px"
            border
            :label="item.value"
            v-for="item in options[2].children"
            :key="item.value"
          >{{item.label}}</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <el-divider>
      <i class="el-icon-collection-tag">为您找到以下结果</i>
    </el-divider>
    <el-table
      v-show="exposeData.length !== 0"
      :data="exposeData"
      style="width: 100%; margin-top: 20px"
      border
      :default-sort="{prop: 'id', order: 'descending'}"
      :max-height="this.wh - 270"
    >
      <el-table-column label="姓名" prop="Name" width="120px"></el-table-column>
      <el-table-column label="年级" prop="Grade" width="150px" sortable></el-table-column>
      <el-table-column label="学院" prop="UnitName"></el-table-column>
      <el-table-column label="专业" prop="MajorName"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="askMore(scope.$index, scope.row)">请求详细简历</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-empty :image-size="200" v-show="exposeData.length === 0"></el-empty>
    <el-dialog title="请填写您想详细了解的内容" :visible.sync="dialogFormVisible" style="width: 100%;">
      <el-form :model="form" label-width="100px">
        <el-form-item label="请求对象">
          <el-input style="width: 150px" disabled :placeholder="chossenName"></el-input>
        </el-form-item>
        <el-form-item label="其他请求描述" class="text">
          <el-alert type="info" :closable="false">
            【{{uname}}】亲爱的同学您好，由于您的信息与我们岗位: 【<el-select style="width: 150px" v-model="form.FromJobID" filterable placeholder="请选择">
              <el-option
                v-for="item in jobList"
                :key="item.JobID"
                :label="item.Name"
                :value="item.JobID"
              ></el-option>
            </el-select>】的需求高度匹配，为进一步了解，诚邀您提供一份完整的简历。如有意向，请尽快登录学业分享系统分享完整版简历。如有任何问题，请联系HR，联系方式:
            <el-input
              v-model="form.Text"
              style="width: 200px;"
            ></el-input>
          </el-alert>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="sendAsk()">确 定</el-button>
      </div>
    </el-dialog>
  </el-form>
</template>
<script>
export default {
  data() {
    return {
      exposeData: [],
      uname: "",
      loading: false,
      options: [{
        value: "UnitCode",
        label: "学院",
        children: [
          { value: "", label: "不限" },
          { value: "27", label: "网络空间安全学院" },
          { value: "14", label: "会计学院" },
          { value: "03", label: "管理学院" },
          { value: "06", label: "自动化学院（人工智能学院）" }
        ]
      }, {
        value: "MajorCode",
        label: "专业",
        children: [
          { value: "", label: "不限" },
          { value: "0304", label: "管理科学与工程类" },
          { value: "0648", label: "生物医学工程" },
          { value: "1406", label: "会计学类" },
          { value: "2703", label: "网络空间安全专业" }
        ]
      }, {
        value: "Sex",
        label: "性别",
        children: [
          { value: "", label: "不限" },
          { value: "男", label: "男" },
          { value: "女", label: "女" }
        ]
      }, {
        value: "jxj",
        label: "奖学金情况",
        children: [
          { value: "", label: "不限" },
          { value: "1", label: "获得过国家级奖学金" },
          { value: "2", label: "获得过省级奖学金" },
          { value: "3", label: "获得过校级奖学金" }
        ]
      }, {
        value: "js",
        label: "竞赛获奖情况",
        children: [
          { value: "", label: "不限" },
          { value: "1", label: "获得过国赛级奖项" },
          { value: "2", label: "获得过省赛级奖项" },
          { value: "3", label: "获得过校赛级奖项" }
        ]
      }, {
        value: "club",
        label: "班团工作",
        children: [
          { value: "", label: "不限" },
          { value: "1", label: "曾任校级工作" },
          { value: "2", label: "曾任院级工作" },
          { value: "3", label: "曾任班级工作" }
        ]
      }, {
        value: "social",
        label: "社会工作",
        children: [
          { value: "", label: "不限" },
          { value: "1", label: "实习工作" }
        ]
      }, {
        value: "method",
        label: "各条件匹配规则",
        children: [
          { value: "must", label: "全部符合" },
          { value: "should", label: "满足一项及以上" }
        ]
      }],
      conditions: {
        GPA: [],
        MajorCode: "",
        UnitCode: "",
        Sex: "",
        Club: "",
        Social: "",
        Jxj: "",
        Js: "",
      },// 选择的条件
      method: "must",
      Predicates: [],// 要传给后端的筛选条件
      dialogFormVisible: false,
      form: {
        "ExposeFileID": "",
        "Text": "",
        "FromJobID": ""
      },
      chossenName: "",
      jobList: []
    };
  },
  props: ["wh"],
  methods: {
    resetConditions() {
      this.conditions = {
        GPA: [],
        MajorCode: null,
        UnitCode: null,
        Sex: null,
        Club: null,
        Social: null,
        Jxj: null,
        Js: null,
        method: "must"
      };
    },
    resetForm() {
      this.form = {
        ExposeFileID: "",
        Text: ""
      };
    },
    getInfo() {
      this.loading = true;
      this.exposeData = [];
      // 先根据conditions填好Predicates
      this.Predicates = [];
      const index = Object.keys(this.conditions);
      for (let i = 0; i < index.length; i++) {
        if (this.conditions[index[i]].length !== 0)
          this.Predicates.push({
            "FieldPath": ["data_map", index[i] === "GPA" ? "rank" : "profile", "*", index[i]],
            "RelationType": this.method,
            "NodeType": index[i] === "GPA" ? "range" : "match",
            "Predicate": index[i] === "GPA" ? { "from": +this.conditions[index[i]][0] ? +this.conditions[index[i]][0] : 0, "to": +this.conditions[index[i]][1] ? +this.conditions[index[i]][1] : 5.0 } : { "value": this.conditions[index[i]] }
          });
      }
      this.axios({
        method: "post",
        url: "https://api.hduhelp.com/gormja_wrapper/expose/search",
        data: { "Predicates": this.Predicates }
      }).then((response) => {
        if (response.data.data.Results.length === 0)
          return this.loading = false;
        const result = response.data.data.Results;
        for (let i = 0; i < result.length; i++) {
          // 把FileID也放进去
          let data = result[i].Source.data_map.profile[result[i].FileID];
          if (data.Name.length === 2)
            data.Name = data.Name.substr(0, 1) + "*";
          else {
            let name = data.Name.substr(0, 1);
            for (let i = 0; i < (data.Name.length - 2); i++)
              name += "*";
            data.Name = name + data.Name.substr(data.Name.length - 1);
          }
          if (data.ClassCode)
            data.Grade = "20" + data.ClassCode.substr(0, 2);
          else
            data.Grade = "/";
          data.FileID = result[i].FileID;
          this.exposeData.push(data);
        }
        this.loading = false;
      }).catch(() => {
        this.$message.error("获取公开信息出错啦,请稍后再试");
        this.loading = false;
      });
    },
    askMore(index, row) {
      this.resetForm();
      this.form.ExposeFileID = row.FileID;
      this.chossenName = row.Name;
      this.dialogFormVisible = true;
    },
    sendAsk() {
      this.loading = true;
      this.axios({
        method: "post",
        url: "https://api.hduhelp.com/gormja_wrapper/share/addFurtherShareRequest",
        headers: { "Authorization": JSON.parse(localStorage.getItem("jw_ent_file")).authorization },
        data: this.form
      }).then(() => {
        this.$message.success("已成功向该求职者发送详细简历请求");
        this.resetForm();
        this.dialogFormVisible = false;
        this.loading = false;
      }).catch(() => {
        this.$message.error("请求详细简历出错啦,请稍后再试");
        this.loading = false;
      });
    }
  },
  watch: {
    conditions: {
      handler() {
        this.getInfo();
      },
      deep: true
    },
    method: {
      handler() {
        this.getInfo();
      }
    }
  },
  mounted() {
    this.loading = true;
    this.uname = JSON.parse(localStorage.getItem("jw_ent_file")).CompanyCode;
    this.axios({
      method: "post",
      url: "https://api.hduhelp.com/gormja_wrapper/job/lookup",
      data: { "CompanyCode": this.uname }
    }).then(response => {
      const type = Object.keys(response.data.data);
      for (let i = 0; i < type.length; i++)
        for (let j = 0; j < response.data.data[type[i]].length; j++)
          this.jobList.push(response.data.data[type[i]][j]);
      this.getInfo();
    }).catch(() => {
      this.$message.error("获取招聘信息出错啦,请稍后再试");
      this.loading = false;
    });

  }
};
</script>

<style scoped>
.form {
  overflow: auto;
  margin: 10px;
  width: calc(100% - 20px);
  padding: 40px 100px;
  background-color: #fff;
  border: 1px solid rgba(204, 204, 204, 0.5);
  box-shadow: 0 2px 5px 1px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}
.coditions {
  padding: 20px;
  background-color: rgba(243, 243, 243, 0.541);
}
</style>
<style>
/* table里下拉菜单的样式表 */
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
  margin-left: 20px;
}
.demo-table-expand .el-form-item {
  margin: 0;
  width: 50%;
}
.el-form--inline .el-form-item {
  margin-right: 0;
}
.el-dialog__wrapper .el-dialog {
  /* margin: 90px 25%; */
  width: 40%;
  min-width: 740px;
}
.coditions .el-form-item {
  margin-bottom: 10px;
}
.form .el-loading-mask {
  height: 1000px;
}
.text .el-alert .el-alert__description {
  font-size: 14px;
}
</style>