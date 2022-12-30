<template>
  <!-- 消息推送 -->
  <div class="module-view">
    <div class="plan">
      <div class="bg-shadow left">
        <div class="title">
          推送提醒
        </div>
        <div v-for="(list, index) in leftList" :key="index" :class="activeIndex == index ? 'list active' : 'list'" @click="changeIndex(index, list)">
          <div :class="iconColor[index]">
            <i :class="icon[index]"></i>
          </div>
          <div class="desc">
            <p>{{ list.title }}</p>
            <p>{{ list.content }}</p>
          </div>
          <div class="time">
            <p>{{ list.happenTime }}</p>
            <p v-if="list.msgNum > 0">
              <el-badge :value="list.msgNum" class="item"></el-badge>
            </p>
          </div>
        </div>
        <!-- <div :class="activeIndex==1?'list active':'list'"  @click="changeIndex(1,'故障消息')">
          <div class="tubiao b">
              <i class="el-icon-warning-outline"></i>
          </div>
          <div class="desc">
            <p>故障消息</p>
            <p>故障类提醒</p>
          </div>
          <div class="time">
            <p>08月16日</p>
            <p>
              <el-badge :value="1" class="item"></el-badge>
            </p>
          </div>
        </div> -->
      </div>
      <div class="bg-shadow right">
        <div class="right-title">
          <span v-text="rightTitle"></span>
        </div>
        <div class="right-content scroll">
          <div v-for="(list, index) in rightList" :key="index">
            <div :class="list.title == '报警消息' ? iconColor[0] : list.title == '简报' ? iconColor[1] : iconColor[2]">
              <i :class="list.title == '简报' ? icon[2] : list.title == '报警消息' ? icon[0] : icon[1]"></i>
            </div>
            <div class="list">
              <div>
                <span>{{ list.msgStatus }}</span>
                <p>{{ list.title }}</p>
                <p>{{ list.content }}</p>
                <p>
                  {{ list.happenTime }}
                </p>
              </div>
              <el-button type="primary" @click="toDetail">查看详情</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { SucButton, SucTree, SucModal, SucForm, SucFormItem, SucSelect, SucInput } from "@suc/ui";
import { SearchComponent } from "@/components";
import { dataBaseApi, infoApi } from "@/api";
@Component({
  components: {
    SucButton,
    SucTree,
    SucModal,
    SucForm,
    SucFormItem,
    SucSelect,
    SucInput,
    SearchComponent,
  },
})
export default class TransferPlan extends Vue {
  activeIndex: any = -1;
  rightTitle: any = "";
  leftList: any = [];
  rightList: any = [];
  icon: any = ["txt iconfont icon-yujingxinxi", "el-icon-warning-outline", "txt iconfont icon-guanwangjianbao"];
  iconColor: any = ["tubiao r", "tubiao b", "tubiao c"];
  mounted() {
    this.getList();
  }
  async changeIndex(index: any, item: any) {
    this.activeIndex = index;
    this.rightTitle = item.title;
    const url = "hsServer/hs/message/getMessageRecord";
    let data = await infoApi.getWithParam(url, { userId: localStorage.getItem("userId"), messageType: item.msgType });
    this.rightList = data.data;
  }

  toDetail() {
    if (this.rightTitle == "报警消息") {
      this.$router.push("/main/film/alarm");
    } else if (this.rightTitle == "故障信息") {
      this.$router.push("/main/film/fault");
    } else {
      this.$router.push("/main/floodmanage/report");
    }
  }

  async getList() {
    const url = "hsServer/hs/message/getMessage";
    let data = await infoApi.getWithParam(url, { userId: localStorage.getItem("userId") });
    this.leftList = data.data;
  }
}
</script>
<style lang="scss" scoped>
@import "@/styles/commonVariables.scss";
.module-view {
  position: relative;
  padding: 10px;
  background-color: $pages-bg;
  .bg-shadow {
    background-color: #ffffff;
    box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.08);
  }
  .top {
    padding: 14px 15px;
    display: flex;
    justify-content: space-between;
    .button-pannel {
      display: inline-block;
      margin-right: 16px;
    }
  }
  .plan {
    display: flex;
    margin-top: 10px;
    height: calc(100% - 70px);
    .left {
      width: 400px;
      height: 100%;
      .title {
        background-color: #027db4;
        height: 50px;
        color: seashell;
        font-size: 16px;
        line-height: 50px;
        padding-left: 20px;
      }
      .list {
        width: 100%;
        cursor: pointer;
        border-bottom: 1px solid #f9eeee;
        &:hover {
          background-color: #f2f5fa;
        }
        padding: 5px;

        .desc {
          display: inline-block;
          margin-left: 20px;
          height: 50px;
          vertical-align: top;
          line-height: 50px;
          p:nth-child(1) {
            font-size: 13px;
            margin-top: 5px;
          }
          p:nth-child(2) {
            color: #ccc;
          }
        }
        .time {
          float: right;
          text-align: right;
          margin-right: 10px;
          color: #bfbfbf;
          font-size: 14px;
          p:nth-child(2) {
            margin-top: 15px;
            margin-left: 36px;
          }
        }
      }
    }
    .right {
      margin-left: 10px;
      width: calc(100% - 210px);
      height: 100%;
      &-title {
        padding: 15px;
        border-bottom: 1px solid $border-color;
      }
      &-content {
        padding: 5%;
        height: 100%;
        overflow: auto;
        .list {
          display: inline-block;
          margin-bottom: 30px;
          width: 800px;
          height: 180px;
          border: 1px solid #ccc;
          border-radius: 5px;
          margin-left: 10px;
          span {
            float: right;
          }
          button {
            float: right;
            margin-right: 5px;
          }
          div {
            margin: 20px 40px;
            font-size: 14px;
            p {
              margin-bottom: 15px;
            }
          }
        }
      }
    }
  }
  .delete-view {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.3);
  }
  .active {
    background-color: #f2f5fa;
  }
  .tubiao {
    border-radius: 50%;
    width: 38px;
    height: 38px;
    line-height: 36px;
    padding-left: 11px;
    display: inline-block;
    vertical-align: top;
    margin-top: 6px;
    i {
      color: seashell;
    }
  }
  .r {
    background-color: #e16f6f;
    i {
      font-size: 22px;
    }
    padding-top: 5px;
    padding-left: 8px;
  }
  .b {
    i {
      font-size: 22px;
    }
    background-color: #6c6eee;
    padding-top: 5px;
    padding-left: 8px;
  }
  .c {
    i {
      font-size: 22px;
    }
    background-color: #24f7b7;
    padding-top: 5px;
    padding-left: 8px;
  }
}
</style>
