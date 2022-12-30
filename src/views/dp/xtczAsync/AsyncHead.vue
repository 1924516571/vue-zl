<template>
  <div>
      <div class="nr nr1">
        <div class="gyys">
          <div class="zjnr">
            <div>发现问题</div>
            <span class="centes">{{this.tableData.fxwt}}</span>
          </div>  
          <div class="zjnr2">
            <div>同比上月</div>
            <!-- 控制字体颜色↓ -->
            <span :class="[this.tableData.fxwtFlag == 'down'? 'red': 'green',]">
             {{this.tableData.fxwtPercent}}
             <!-- 控制同比上升下降↓ -->
              <span :class="[this.tableData.fxwtFlag == 'down'? 'bgtb': 'bgtb2',]"></span>
            </span>
          </div>
        </div>
      </div>
      <div class="nr nr2">
        <div class="gyys">
          <div class="zjnr">
            <div>立案</div>
            <span class="centes">{{this.tableData.la}}</span>
          </div>  
          <div class="zjnr2">
            <div>同比上月</div>
            <!-- 控制字体颜色↓ -->
            <span :class="[this.tableData.laFlag == 'down'? 'red': 'green',]">
             {{this.tableData.laPercent}}
             <!-- 控制同比上升下降↓ -->
              <span :class="[this.tableData.laFlag == 'down'? 'bgtb': 'bgtb2',]"></span>
            </span>
          </div>
        </div>
      </div>
      <div class="nr nr3">
        <div class="gyys">
          <div class="zjnr">
            <div>结案</div>
            <span class="centes">{{this.tableData.ja}}</span>
          </div>  
          <div class="zjnr2">
            <div>同比上月</div>
            <!-- 控制字体颜色↓ -->
            <span :class="[this.tableData.jaFlag == 'down'? 'red': 'green',]">
             {{this.tableData.jaPercent}}
             <!-- 控制同比上升下降↓ -->
              <span :class="[this.tableData.jaFlag == 'down'? 'bgtb': 'bgtb2',]"></span>
            </span>
          </div>
        </div>
      </div>
      <div class="nr nr4">
        <div class="gyys">
          <div class="zjnr">
            <div>派单</div>
            <span class="centes">{{this.tableData.pd}}</span>
          </div>  
          <div class="zjnr2">
            <div>同比上月</div>
            <!-- 控制字体颜色↓ -->
            <span :class="[this.tableData.pdFlag == 'down'? 'red': 'green',]">
             {{this.tableData.pdPercent}}
             <!-- 控制同比上升下降↓ -->
              <span :class="[this.tableData.pdFlag == 'down'? 'bgtb': 'bgtb2',]"></span>
            </span>
          </div>
        </div>
      </div>
      <div class="nr nr5">
        <div class="gyys">
          <div class="zjnr">
            <div>处置</div>
            <span class="centes">{{this.tableData.cz}}</span>
          </div>  
          <div class="zjnr2">
            <div>同比上月</div>
            <!-- 控制字体颜色↓ -->
            <span :class="[this.tableData.czFlag == 'down'? 'red': 'green',]">
             {{this.tableData.czPercent}}
             <!-- 控制同比上升下降↓ -->
              <span :class="[this.tableData.czFlag == 'down'? 'bgtb': 'bgtb2',]"></span>
            </span>
          </div>
        </div>
      </div>
      <div class="nr nr6">
        <div class="gyys">
          <div class="zjnr">
            <div>核查</div>
            <span class="centes">{{this.tableData.hc}}</span>
          </div>  
          <div class="zjnr2">
            <div>同比上月</div>
            <!-- 控制字体颜色↓ -->
            <span :class="[this.tableData.hcFlag == 'down'? 'red': 'green',]">
             {{this.tableData.hcPercent}}
             <!-- 控制同比上升下降↓ -->
              <span :class="[this.tableData.hcFlag == 'down'? 'bgtb': 'bgtb2',]"></span>
            </span>
          </div>
        </div>
      </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { SucCheckboxGroup, SucCheckbox } from "@suc/ui";
import { publicApi } from "@/api";
@Component({
  components: {
    SucCheckboxGroup,
    SucCheckbox,
  },
})
export default class AsyncHead extends Vue {
  group: any[] = ["燃气安全"]; //默认展示的复选框
  tableData: any = [];
  changeCheck(arr:any){
     console.log(arr,">>>54654645");
     
  }
  mounted() {
    this.center();
  }

  async center() {
    let url = "wjServer/xwzl/xtcz/contrastLastMonth";
    let data = await publicApi.getNoParam(url);
    this.tableData = data.data;
  }
}
</script>

<style lang="scss" scoped>
$deep: "::v-deep";
.centes{
  text-align: center;
}
.nr{
  width: 140px;
  height: 50px;
  background-color: #fff;
  position: relative;
  background: url("../../../assets/dp/Xtcz/bk.png") 100% no-repeat;
  background-size: 100% 100%;
}
.nr1{
  position: absolute;
  top: 18%;
  left: 770px;
}
.nr2{
  position: absolute;
  top: 20%;
  left: 1080px;
}
.nr3{
  position: absolute;
  top: 24%;
  left: 880px;
}
.nr4{
  position: absolute;
  top: 25%;
  left: 620px;
}
.nr5{
  position: absolute;
  top: 36%;
  left: 630px;
}
.nr6{
  position: absolute;
  top: 37%;
  left: 1100px;
}
.zjnr{
  display: flex;
  flex-direction:column;
  margin-left:15px;
  margin-top:5px;
  color: #B1C1D6;
  span{
    font-weight: bold;
    font-size:16px ;
    color: #fff;
  }

}
.zjnr2{
  display: flex;
  flex-direction:column;
  margin-left:15%;
  margin-top:5px;
  color: #B1C1D6;
 span{
  font-weight: bold;
  font-size:16px ;
  vertical-align: middle;
 }
}
.bgtb{
  align-items: center;
  margin-top: -3px;
  margin-left: -3px;
  width: 15px;
  height: 15px;
  background: url("../../../assets/dp/Xtcz/xj.png") 100% no-repeat;
  background-size: 100% 100%;
  display: inline-block;
}
.bgtb2{
  align-items: center;
  margin-top: -3px;
  margin-left: -3px;
  width: 15px;
  height: 15px;
  background: url("../../../assets/dp/Xtcz/ss.png") 100% no-repeat;
  background-size: 100% 100%;
  display: inline-block;
}
.red{
  color: red;
}
.green{
  color: #5ACE41;
}
.gyys{
  display: flex;
}
</style>
