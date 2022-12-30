<template>
<!-- 视频监控 -->
    <div class="main_view">
        <nav-bar></nav-bar>
        <urbanwater-Main></urbanwater-Main>
    </div>
</template>
<script lang="ts">
import { Vue,Component,Prop,Emit,Model,Watch } from "vue-property-decorator";
import {urbanwaterMain,NavBar} from './components'
@Component({
    components:{
        NavBar,
        urbanwaterMain
    }
})
export default class ModuleView extends Vue{} 
</script>
<style lang="scss" scoped>

</style>