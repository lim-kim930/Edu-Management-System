<template>
  <el-form
    class="form"
    ref="form"
    label-width="80px"
    v-loading="loading"
    element-loading-text="拼命加载中"
    :style="{'max-height': this.wh - 105 + 'px'}"
  >
    <span>请选择筛选条件:</span>
    <el-select
      v-model="conditions.UnitCode"
      filterable
      placeholder="学院名称"
      style="width: 180px; margin: 0 10px"
    >
      <el-option
        v-for="item in options[0].children"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>
    <el-select v-model="conditions.MajorCode" filterable placeholder="专业名称" style="width: 180px;">
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
    </el-select>
    <el-input style="width: 90px" v-model="conditions.GPA[0]" placeholder="gpa下限"></el-input>
    <el-input style="width: 90px; margin: 0 10px" v-model="conditions.GPA[1]" placeholder="gpa上限"></el-input>
    <!-- <el-button type="primary" plain icon="el-icon-plus" circle></el-button> -->
    <el-button type="primary" @click="getInfo()" style="margin-top: 20px">点击筛选</el-button>
    <el-table
      v-show="tableData.length !== 0"
      :data="tableData"
      style="width: 100%; margin-top: 20px"
      border
      :default-sort="{prop: 'id', order: 'descending'}"
      :max-height="this.wh - 270"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="姓名">
              <span>{{ props.row.Name }}</span>
            </el-form-item>
            <el-form-item label="性别">
              <span>{{ props.row.Sex }}</span>
            </el-form-item>
            <el-form-item label="民族">
              <span>{{ props.row.Nation }}</span>
            </el-form-item>
            <el-form-item label="学号">
              <span>{{ props.row.StaffID }}</span>
            </el-form-item>
            <el-form-item label="班级号码">
              <span>{{ props.row.ClassCode }}</span>
            </el-form-item>
            <el-form-item label="班级名称">
              <span>{{ props.row.ClassName }}</span>
            </el-form-item>
            <el-form-item label="学校代码">
              <span>{{ props.row.SchoolCode }}</span>
            </el-form-item>
            <el-form-item label="学院代码">
              <span>{{ props.row.UnitCode }}</span>
            </el-form-item>
            <el-form-item label="学院名称">
              <span>{{ props.row.UnitName }}</span>
            </el-form-item>
            <el-form-item label="专业代码">
              <span>{{ props.row.MajorCode }}</span>
            </el-form-item>
            <el-form-item label="专业名称">
              <span>{{ props.row.MajorName }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="姓名" prop="Name" sortable></el-table-column>
      <el-table-column label="学院" prop="UnitName"></el-table-column>
      <el-table-column label="专业" prop="MajorName"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">请求详细简历</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-empty :image-size="200" v-show="tableData.length === 0"></el-empty>
  </el-form>
</template>
<script>
export default {
  data() {
    return {
      tableData: [],
      loading: false,
      options: [{
        value: "UnitCode",
        label: "学院",
        children: [
          { value: "27", label: "网络空间安全学院" },
          { value: "14", label: "会计学院" },
          { value: "03", label: "管理学院" },
          { value: "06", label: "自动化学院（人工智能学院）" }
        ]
      }, {
        value: "MajorCode",
        label: "专业",
        children: [
          { value: "0304", label: "管理科学与工程类" },
          { value: "0648", label: "生物医学工程" },
          { value: "1483", label: "会计学类" },
          { value: "2701", label: "网络空间安全专业" }
        ]
      }, {
        value: "Sex",
        label: "性别",
        children: [
          { value: "男", label: "男" },
          { value: "女", label: "女" }
        ]
      }],
      conditions: {
        GPA: [],
        MajorCode: "",
        UnitCode: "",
        Sex: ""
      },// 选择的条件
      Predicates: []// 要传给后端的筛选条件
    }
  },
  props: ["wh"],
  methods: {
    getInfo() {
      this.loading = true;
      this.tableData = [];
      // 先根据conditions填好Predicates
      this.Predicates = [];
      const index = Object.keys(this.conditions);
      for (let i = 0; i < index.length; i++) {
        if (this.conditions[index[i]].length !== 0)
          this.Predicates.push({
            "FieldPath": ["data_map", index[i] === "GPA" ? "rank" : "profile", "*", index[i]],
            "RelationType": "must",
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
          this.tableData.push(result[i].Source.data_map.profile[result[i].FileID])
          this.tableData[i].Photo = "/"
        }
        this.loading = false;
      }).catch(() => {
        this.$message.error("获取公开信息出错啦,请稍后再试")
        this.loading = false
      });
    }
  },
  mounted() {
    this.getInfo()
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
</style>