<!-- 工程运行 -->
<template>
    <div class="main_view">
        <nav-bar></nav-bar>
        <water-main></water-main>
    </div>
</template>
<script lang="ts">
import { Vue,Component,Prop,Emit,Model,Watch } from "vue-property-decorator";
import {WaterMain,NavBar} from './components'
@Component({
    components:{
        WaterMain,
        NavBar
    }
})
export default class ModuleView extends Vue{} 
</script>
<style lang="scss" scoped>

</style>