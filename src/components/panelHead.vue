<template>
  <div class="panelHeading">
    <div class="panel-lead">
      <div class="title">{{ panelTitle }}</div>
      <p class="description">{{ panelDescription }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
const route = useRoute();
const panelTitle = computed(() => route.meta.name || '默认标题');
const panelDescription = computed(() => route.meta.describe || '默认描述');
</script>

<style lang="less" scoped>
// 修正类名不一致问题（panelHeading 对应模板）
.panelHeading {
  padding: 15px;
  background: #e8edf0;
  border-color: #e8edf0;
  position: relative;

  .panel-lead {
    font-size: 14px;

    .title {
      font-weight: bold;
      font-style: normal;
    }

    .description {
      margin-top: 5px;
      margin: 0; // 清除默认p标签的margin
      color: #666;
    }
  }
}
</style>