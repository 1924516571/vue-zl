<template>
<!-- 主页 -->
    <div class="main_view">
        <nav-bar></nav-bar>
        <homes-Main></homes-Main>
    </div>
</template>
<script lang="ts">
import { Vue,Component,Prop,Emit,Model,Watch } from "vue-property-decorator";
import {homesMain,NavBar} from './components'
@Component({
    components:{
        NavBar,
       homesMain
    }
})
export default class ModuleView extends Vue{} 
</script>
<style lang="scss" scoped>

</style>