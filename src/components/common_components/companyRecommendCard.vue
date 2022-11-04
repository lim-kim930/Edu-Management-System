<template>
  <div class="crc">
    <div class="top-bar">
      <div class="main-title">{{ recommend.jobName }}</div>
      <el-tag class="sub-title" size="mini">{{
        recommend.subtitle || 校招
      }}</el-tag>
    </div>
    <ul class="tags-container">
      <li class="tag-item" v-for="tag in recommend.tags" :key="tag.id">
        <el-tag type="info" size="mini">{{ tag.text }}</el-tag>
      </li>
    </ul>
    <div class="company-name">{{ recommend.companyName }}</div>
    <div class="short-desc">{{ recommend.short_desc }}</div>

    <div class="salary">{{ recommend.salary || "面议" }}</div>
    <div class="base">
      <slot name="base">{{ recommend.base }}</slot>
    </div>
  </div>
</template>

<script>
export default {
  props: ["recommend"],
};
</script>

<style scoped>
.crc {
  position: relative;
  display: inline-flex;
  flex-direction: column;
  width: 300px;
  padding: 20px;
  border-radius: 15px;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}
.salary {
  position: absolute;
  right: 20px;
  top: 20px;
  color: rgb(97, 163, 255);
}
.base {
  position: absolute;
  right: 20px;
  bottom: 20px;
  color: #444;
  font-size: 14px;
  font-weight: normal;
  letter-spacing: 1px;
}
.top-bar {
  display: flex;
  align-items: center;
}
.main-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
  margin-right: 20px;
  max-width: 50%;
  /* 超出省略号 */
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.sub-title {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 10px;
}
.tags-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  margin-top: 10px;
}
.tag-item {
  margin-right: 10px;
}
.company-name {
  font-size: 16px;
  font-weight: bold;
  margin-top: 20px;
  color: #444;
}
.short-desc {
  font-size: 14px;
  color: #666;
  margin-top: 10px;
  max-width: 80%;
  /* 超出省略号 */
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>