<template>
  <el-form
    class="form"
    ref="form"
    label-width="0px"
    v-loading="loading"
    element-loading-text="拼命加载中"
    :style="{ 'max-height': vh - 105 + 'px' }"
  >
    <div class="recommend">
      <div class="top">
        <h2 class="title__name">推荐岗位信息</h2>
        <el-button
          type="primary"
          icon="el-icon-refresh"
          class="refreshBtn"
          @click="randomRecommend"
          >换一批</el-button
        >
      </div>

      <ul class="recommend-card">
        <li
          class="recommend-item"
          v-for="(item, index) in recommendList"
          :key="index"
        >
          <company-recommend-card :recommend="item" />
        </li>
      </ul>
    </div>
    <div class="filter-all">
      <h2 class="title__name">所有岗位信息</h2>
      <span>请选择筛选条件:</span>
      <el-select
        v-model="Name"
        clearable
        filterable
        placeholder="岗位名称"
        style="width: 180px; margin: 0 10px"
      >
        <el-option
          v-for="item in options[0].children"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-select
        v-model="JobTypeCode"
        clearable
        filterable
        placeholder="岗位大类"
        style="width: 180px"
      >
        <el-option
          v-for="item in options[1].children"
          :key="item.id"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-select
        v-model="MinSalary"
        filterable
        clearable
        placeholder="最低薪资"
        style="width: 140px; margin: 0 10px"
      >
        <el-option
          v-for="item in options[2].children"
          :key="item.id"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-form-item style="display: inline-block; width: 180px">
        <el-cascader
          v-model="location"
          :options="locations"
          clearable
          placeholder="工作地点"
          filterable
        ></el-cascader>
      </el-form-item>
      <el-autocomplete
        class="inline-input"
        v-model="CompanyName"
        prefix-icon="el-icon-search"
        :fetch-suggestions="querySearch"
        @select="companySelect"
        @change="removeCode"
        placeholder="公司(请输入后选择)"
        :trigger-on-focus="false"
        style="margin-left: 10px"
      ></el-autocomplete>
      <el-button
        type="primary"
        @click="getInfo()"
        style="margin: 20px"
        icon="el-icon-search"
        >点击查询</el-button
      >
      <el-table
        :data="
          tableData.slice(
            page * parseInt((vh - 360) / 53),
            (page + 1) * parseInt((vh - 360) / 53)
          )
        "
        style="width: 100%"
        :border="true"
        @sort-change="sortChange"
        @filter-change="filterHandler"
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form
              label-position="left"
              inline
              class="demo-table-expand"
              label-width="80px"
            >
              <el-form-item label="公司简介:" class="companyDesc">
                <span style="display: inline-block">{{
                  props.row.Company.Description.replace(//g, "")
                }}</span>
              </el-form-item>
              <el-form-item label="岗位名称:">
                <span>{{ props.row.Name }}</span>
              </el-form-item>
              <el-form-item label="薪资类型:">
                <span>{{
                  props.row.SalaryMode +
                  (props.row.SalaryCount
                    ? " - " + props.row.SalaryCount + "薪"
                    : "")
                }}</span>
              </el-form-item>
              <el-form-item
                label="最低薪资:"
                v-if="props.row.SalaryMode !== '面议'"
              >
                <span>{{ props.row.MinSalary }}</span>
              </el-form-item>
              <el-form-item
                label="最高薪资:"
                v-if="props.row.SalaryMode !== '面议'"
              >
                <span>{{ props.row.MaxSalary }}</span>
              </el-form-item>
              <el-form-item label="发布时间:">
                <span>{{
                  new Date(+new Date(props.row.CreatedAt) + 8 * 3600 * 1000)
                    .toISOString()
                    .replace(/T/g, " ")
                    .replace(/\.[\d]{3}Z/, "")
                }}</span>
              </el-form-item>
              <el-form-item label="工作地点:">
                <span>{{ props.row.WorkLocation }}</span>
              </el-form-item>
              <el-form-item label="岗位描述:">
                <span style="display: inline-block">{{
                  props.row.Description.replace(//g, "")
                }}</span>
              </el-form-item>
              <el-form-item label="岗位要求:">
                <span style="display: inline-block">{{
                  props.row.Requirement.replace(//g, "")
                }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          label="公司"
          prop="Company.Name"
          width="320"
        ></el-table-column>
        <el-table-column label="岗位" width="450">
          <template slot-scope="scope">
            {{ scope.row.Name }}
            <el-badge
              v-if="scope.row.Name.indexOf('2022年海康威视校园大使') !== -1"
              value="hot"
              class="job"
            ></el-badge>
          </template>
        </el-table-column>
        <el-table-column
          label="最高薪资"
          prop="MaxSalary"
          sortable
        ></el-table-column>
        <el-table-column
          label="薪资类型"
          prop="SalaryMode"
          :filters="salaryFilter"
        ></el-table-column>
        <el-table-column
          label="工作地点"
          width="160"
          prop="WorkLocation"
        ></el-table-column>
        <el-table-column label="操作" width="110">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)"
              >投递简历</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        @current-change="currentChange"
        :page-size="parseInt((this.vh - 360) / 53)"
        :pager-count="9"
        layout="prev, pager, next"
        :total="total"
        style="margin: 10px 0"
      ></el-pagination>
    </div>
  </el-form>
</template>
<script>
import { provinceAndCityData, CodeToText } from "element-china-area-data";
import { mapGetters } from "vuex";
import companyRecommendCard from "../common_components/companyRecommendCard.vue";
export default {
  components: { companyRecommendCard },
  data() {
    return {
      recommendList: [
        {
          jobName: "Web开发",
          subtitle: "校招",
          tags: [
            {
              text: "全职",
              id: 1,
            },
            {
              text: "学历不限",
              id: 2,
            },
            {
              text: "经验不限",
              id: 3,
            },
          ],
          companyName: "正元智慧",
          short_desc: "计算机软件 500-999人",
          base: "杭州",
          salary: "7k - 9k",
        },
        {
          jobName: "网络优化",
          subtitle: "校招",
          tags: [
            {
              text: "全职",
              id: 1,
            },
            {
              text: "本科",
              id: 2,
            },
            {
              text: "经验不限",
              id: 3,
            },
          ],
          companyName: "中国联通",
          short_desc: "通信/网络设备 国企 1000+人",
          base: "杭州",
          salary: null,
        },
        {
          jobName: "嵌入式软件设计师",
          subtitle: "校招",
          tags: [
            {
              text: "全职",
              id: 1,
            },
            {
              text: "学历不限",
              id: 2,
            },
            {
              text: "不限",
              id: 3,
            },
          ],
          companyName: "海格通信",
          short_desc: "电子/半导体/集成电路 国企 1000+人",
          base: "杭州",
          salary: "7k - 9k",
        },
      ],

      total: 0,
      page: 0,
      tableData: [],
      originalData: [],
      loading: false,
      locations: provinceAndCityData,
      options: [
        {
          value: "Name",
          label: "岗位",
          children: [{ value: "", label: "不限" }],
        },
        {
          value: "JobTypeCode",
          label: "岗位大类",
          children: [{ value: "", label: "不限制此项" }],
        },
        {
          value: "MinSalary",
          label: "最低薪资",
          children: [
            { value: 0, label: "不限" },
            { value: 1000, label: "1K" },
            { value: 2000, label: "2K" },
            { value: 3000, label: "3K" },
            { value: 4000, label: "4K" },
            { value: 5000, label: "5K" },
            { value: 6000, label: "6K" },
            { value: 7000, label: "7K" },
            { value: 8000, label: "8K" },
            { value: 9000, label: "9K" },
            { value: 10000, label: "10K" },
            { value: 15000, label: "20K" },
            { value: 15000, label: "15K" },
          ],
        },
      ],
      salaryFilter: [
        { text: "日薪", value: "日薪" },
        { text: "年薪", value: "年薪" },
        { text: "月薪", value: "月薪" },
        { text: "面议", value: "面议" },
      ],
      companies: [],
      location: [],
      Name: null,
      MinSalary: "",
      WorkLocation: "",
      JobTypeCode: null,
      CompanyName: "",
      CompanyCode: "",
      select: { MinSalary: 0 },
      input: [],
      gpa: false,
    };
  },
  computed: {
    ...mapGetters({
      vh: "view/afterCompared",
    }),
  },
  methods: {
    /**
     * 获取随机数值
     * @param {Number} min 最小值
     * @param {Number} max 最大值
     * @return {Number} 返回 [最小值, 最大值] 随机数值
     */
    getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min; //含最大值，含最小值
    },
    /**
     * 假数据形成智能推荐列表
     */
    randomRecommend() {
      const jobs = [
        "Web开发",
        "软件开发",
        "UI设计",
        "网络优化",
        "产品经理",
        "软件工程师",
        "前端开发实习生",
        "后端开发实习生",
        "算法工程师",
      ];
      const bases = [
        "成都",
        "重庆",
        "杭州",
        "北京",
        "上海",
        "苏州",
        "南京",
        "深圳",
        "不限",
        "长沙",
      ];
      const tags = [
        "全职",
        "兼职",
        "学历不限",
        "经验不限",
        "本科",
        "硕士",
        "博士",
        "不限",
        "项目经验",
      ];
      const Companies = [
        "中国移动",
        "海康威视",
        "浙江安恒",
        "杭州迪普",
        "大华",
        "奇安信",
        "珠海剑心",
      ];
      const desc = [
        "通信/硬件",
        "计算机软件",
        "区块链",
        "网络安全",
        "行业领军",
        "上市公司",
      ];
      const n = 3;
      this.recommendList = [];
      for (let i = 0; i < n; i++) {
        const salary = this.getRandomInt(6, 18);
        const tag1 = this.getRandomInt(0, tags.length - 1);
        let tag2 = this.getRandomInt(0, tags.length - 1);
        let tag3 = this.getRandomInt(0, tags.length - 1);
        while (tag1 === tag2) {
          tag2 = this.getRandomInt(0, tags.length - 1);
        }
        while (tag1 === tag3 || tag2 === tag3) {
          tag3 = this.getRandomInt(0, tags.length - 1);
        }

        const recommendItem = {
          jobName: jobs[this.getRandomInt(0, jobs.length - 1)],
          subtitle: "校招",
          tags: [
            {
              text: tags[tag1],
              id: 1,
            },
            {
              text: tags[tag2],
              id: 2,
            },
            {
              text: tags[tag3],
              id: 3,
            },
          ],
          companyName: Companies[this.getRandomInt(0, Companies.length - 1)],
          short_desc: desc[this.getRandomInt(0, desc.length - 1)],
          base: bases[this.getRandomInt(0, bases.length - 1)],
          salary: salary + "k - " + (salary + this.getRandomInt(1, 6)) + "k",
        };
        this.recommendList.push(recommendItem);
      }
      console.log(this.recommendList);
    },
    filterHandler(value) {
      const key = Object.keys(value);
      const data = value[key];
      if (data.length === 0) {
        this.tableData = [...this.originalData];
        this.total = this.tableData.length;
        return;
      }
      let newData = [];
      this.total = 0;
      for (let i = 0; i < data.length; i++) {
        const temp = this.originalData.filter((oldData) => {
          return oldData.SalaryMode == data[i];
        });
        newData = [...newData, ...temp];
      }
      this.tableData = newData;
      this.total = this.tableData.length;
    },
    removeCode() {
      this.CompanyCode = "";
      if (this.CompanyCode === "") this.CompanyName = "";
    },
    companySelect(v) {
      this.CompanyCode = v.CompanyCode;
    },
    querySearch(queryString, cb) {
      let results = [];
      this.axios({
        method: "get",
        url: "/company/lookup",
        // headers: { "Authorization": "token " + JSON.parse(localStorage.getItem("jw_student_file")).token },
        params: {
          name: queryString,
        },
      }).then((response) => {
        for (let i = 0; i < response.data.data.length; i++)
          results.push({
            CompanyCode: response.data.data[i].CompanyCode,
            value: response.data.data[i].Name,
          });
        cb(results);
      });
    },
    currentChange(v) {
      this.page = v - 1;
    },
    sortChange(sort) {
      if (sort.order) {
        if (sort.order === "ascending")
          this.tableData = this.tableData.sort((a, b) => {
            if (a[sort.prop] === "/" && b[sort.prop] === "/") return 0;
            else if (a[sort.prop] !== "/" && b[sort.prop] === "/") return 1;
            else if (a[sort.prop] === "/" && b[sort.prop] !== "/") return -1;
            return a[sort.prop] - b[sort.prop];
          });
        else if (sort.order === "descending")
          this.tableData = this.tableData.sort((a, b) => {
            if (a[sort.prop] === "/" && b[sort.prop] === "/") return 0;
            else if (a[sort.prop] !== "/" && b[sort.prop] === "/") return -1;
            else if (a[sort.prop] === "/" && b[sort.prop] !== "/") return 1;
            return b[sort.prop] - a[sort.prop];
          });
      } else this.tableData = [...this.originalData];
    },
    handleEdit(index, row) {
      sessionStorage.setItem(
        "com",
        JSON.stringify({
          CompanyCode: row.Company.CompanyCode,
          Name: row.Company.Name,
          job: row.Name,
          JobID: row.JobID,
        })
      );
      this.$router.push("/infoShare");
    },
    getInfo() {
      this.select = { MinSalary: 0 };
      if (this.Name && this.Name.length !== 0) this.select.Name = this.Name;
      if (this.JobTypeCode && this.JobTypeCode.length !== 0)
        this.select.JobTypeCode = this.JobTypeCode;
      if (this.MinSalary.length !== 0) this.select.MinSalary = this.MinSalary;
      if (this.CompanyName.length !== 0)
        this.select.CompanyCode = this.CompanyCode;
      if (this.location.length !== 0)
        this.select.WorkLocation =
          CodeToText[this.location[0]] +
          (CodeToText[this.location[1]] === "市辖区"
            ? ""
            : CodeToText[this.location[1]]);
      this.loading = true;
      this.tableData = [];
      this.total = 0;
      this.page = 0;
      this.axios({
        method: "post",
        url: "/job/lookup",
        // headers: { "Authorization": "token " + JSON.parse(localStorage.getItem("jw_student_file")).token },
        data: this.select,
      })
        .then((response) => {
          if (response.data.data.length === 0) {
            this.loading = false;
            return;
          }
          const type = Object.keys(response.data.data);
          let hkws = null;
          for (let i = 0; i < type.length; i++)
            for (let j = 0; j < response.data.data[type[i]].length; j++) {
              this.total++;
              if (response.data.data[type[i]][j].SalaryMode === "面议") {
                response.data.data[type[i]][j].MinSalary = "/";
                response.data.data[type[i]][j].MaxSalary = "/";
              }
              if (
                response.data.data[type[i]][j].Name.indexOf(
                  "2022年海康威视校园大使"
                ) !== -1
              )
                hkws = response.data.data[type[i]][j];
              else this.tableData.push(response.data.data[type[i]][j]);
            }
          if (hkws) this.tableData.unshift(hkws);
          this.originalData = [...this.tableData];
          this.loading = false;
        })
        .catch(() => {
          this.$message.error("获取岗位信息出错啦,请稍后再试");
          this.loading = false;
        });
    },
  },
  mounted() {
    this.loading = true;
    this.axios({
      method: "post",
      url: "/job/lookup",
      data: { MinSalary: 0 },
    })
      .then((response) => {
        this.axios({
          method: "get",
          url: "/job/type/list",
        })
          .then((response2) => {
            if (response.data.data.length !== 0) {
              let job = [];
              this.tableData = [];
              const type = Object.keys(response.data.data);
              let hkws = null;
              for (let i = 0; i < type.length; i++)
                for (let j = 0; j < response.data.data[type[i]].length; j++) {
                  this.total++;
                  if (response.data.data[type[i]][j].SalaryMode === "面议") {
                    response.data.data[type[i]][j].MinSalary = "/";
                    response.data.data[type[i]][j].MaxSalary = "/";
                  }
                  if (
                    response.data.data[type[i]][j].Name.indexOf(
                      "2022年海康威视校园大使"
                    ) !== -1
                  )
                    hkws = response.data.data[type[i]][j];
                  else this.tableData.push(response.data.data[type[i]][j]);
                  if (job.indexOf(response.data.data[type[i]][j].Name) === -1)
                    job.push(response.data.data[type[i]][j].Name);
                }
              if (hkws) this.tableData.unshift(hkws);
              for (let i = 0; i < job.length; i++) {
                this.options[0].children.push({
                  label: job[i],
                  value: job[i],
                });
              }
            }
            for (let i = 0; i < response2.data.data.length; i++) {
              this.options[1].children.push({
                label: response2.data.data[i].Name,
                value: response2.data.data[i].JobTypeCode,
              });
            }
            this.originalData = [...this.tableData];
            this.loading = false;
          })
          .catch(() => {
            this.$message.error("获取岗位大类信息出错啦,请稍后再试");
            this.loading = false;
          });
      })
      .catch(() => {
        this.$message.error("获取招聘信息出错啦,请稍后再试");
        this.loading = false;
      });
  },
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
.el-table {
  margin: 0 !important;
}
.title__name {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 30px;
}
.recommend-card {
  display: flex;
  justify-content: space-between;
  margin-bottom: 40px;
}
.recommend-item {
  margin-bottom: 20px;
}
.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
<style>
.el-icon-arrow-down {
  font-size: 12px;
}
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
.form .el-form--inline .el-form-item__content {
  text-indent: 2em;
  padding-left: 20px;
}
.el-table .job {
  margin-top: -2px;
  margin-right: 3px;
  padding-top: 4px;
  height: 25px;
}
.companyDesc {
  width: 100% !important;
}
</style>
<style>
.job {
  width: 50px;
}
.job .el-badge__content {
  line-height: 15px;
}
</style>