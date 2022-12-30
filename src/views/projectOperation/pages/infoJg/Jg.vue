<template>
  <div>
    <h1>{{ currentTheme }}</h1>
    <h2>{{ getName() }}</h2>
    <h1>-----------------actions-------------</h1>
    <h2>
      (1)通过action修改name：{{ currentTheme }}
      <button @click="updateName1">确定修改</button>
      <button @click="promiseUpdateName">promise回调修改</button>
    </h2>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, Model, Watch } from "vue-property-decorator";
import { State, Mutation, Action, namespace } from "vuex-class";
import { publicApi } from "@/api";

const user = namespace("user");
@Component({
  components: {},
})
export default class Test extends Vue {
  @user.State currentTheme: any;
  @user.Mutation setCurrentTheme: any;
  @user.Action updateName: any;

  Swtimer:any = ""
  mounted() {
    // this.Swtimer = setInterval(() => {
    //   setTimeout(this.getTest, 0);
    // },  5);
    // this.getTest();
  }

  // async getTest() {
  //   const url = "wjServer/paishui/repair/pqChart";
  //   let parms = {
  //     year: "",
  //   };
  //   const data = await publicApi.getWithParam(url, parms);
  //   console.log(data, "888");
  // }
  beforeDestroy() {
    clearInterval(this.Swtimer);
    this.Swtimer = null;
  }

  //   created(){
  //       c("11") // -> store.dispatch('foo', { value: true })
  //   }
  updateName1() {
    this.updateName({ value: true });
  }

  getName() {
    return "Typescript";
  }
}
</script>
