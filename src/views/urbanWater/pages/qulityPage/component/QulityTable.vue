<template>
  <suc-table :data="tableData" border :span-method="spanMethod">
    <template v-for="(item, index) in cols">
      <suc-table-column
        :prop="item.value"
        :label="item.title"
        :width="item.width"
        :align="item.align"
        :key="index"
      >
        <suc-table-column v-if="index == 1" label="标准值" align="center">
          <suc-table-column label="项目" align="center" prop="name"></suc-table-column>
        </suc-table-column>
      </suc-table-column>
    </template>
  </suc-table>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { SucTable, SucTableColumn } from "@suc/ui";
@Component({
  components: {
    SucTable,
    SucTableColumn
  }
})
export default class QulityTable extends Vue {
  cols: Array<object> = [
    {
      title: "序号",
      value: "num",
      width: 60,
      align: "center"
    },
    {
      title: "分类",
      value: "",
      width: 140,
      align: "center"
    },
    {
      title: "",
      value: "compare",
      width: 40,
      align: "center"
    },
    {
      title: "Ⅰ类",
      value: "level1",
      width: 120,
      align: "center"
    },
    {
      title: "Ⅱ类",
      value: "level2",
      width: 120,
      align: "center"
    },
    {
      title: "Ⅲ类",
      value: "level3",
      width: 120,
      align: "center"
    },
    {
      title: "Ⅳ类",
      value: "level4",
      width: 120,
      align: "center"
    },
    {
      title: "Ⅴ类",
      value: "level5",
      width: 120,
      align: "center"
    }
  ];
  tableData: Array<object> = [
    {
      num: 1,
      name: "氨氮(NH3-N)",
      compare: "≤",
      level1: 0.15,
      level2: 0.5,
      level3: 1.0,
      level4: 1.5,
      level5: 2.0
    },
    {
      num: 2,
      name: "总磷(以P计)",
      compare: "≤",
      level1: "0.02(湖、库0.01)",
      level2: "0.1(湖、库0.025)",
      level3: "0.2(湖、库0.05)",
      level4: "0.3(湖、库0.1)",
      level5: "0.4(湖、库0.2)"
    },
    {
      num: 3,
      name: "高锰酸盐指数",
      compare: "≤",
      level1: 2,
      level2: 4,
      level3: 6,
      level4: 10,
      level5: 15
    },
    {
      num: 4,
      name: "pH值(无量纲)",
      compare: "6~9"
    },
    {
      num: 5,
      name: "溶解氧",
      compare: "≥",
      level1: "饱和度90%(或7.5)",
      level2: 6,
      level3: 5,
      level4: 3,
      level5: 2
    },
    {
      num: 6,
      name: "化学需氧量",
      compare: "≤",
      level1: 15,
      level2: 15,
      level3: 20,
      level4: 30,
      level5: 40
    },
    {
      num: 7,
      name: "水温(℃)",
      compare: "人为造成的环境水温变化应限制在:周平均最大温升≤1周平均最大温降≤2"
    }
  ];
  spanMethod({ row, column, rowIndex, columnIndex } : { row: object, column: object, rowIndex: number, columnIndex: number }) {
    if (columnIndex === 2 && rowIndex === 3) {
      return [1, 6];
    } else if (columnIndex === 2 && rowIndex === 6) {
      return [1, 6];
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
