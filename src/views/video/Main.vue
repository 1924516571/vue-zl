<template>
<!-- 视频监控 -->
    <div class="main_view">
        <nav-bar></nav-bar>
        <video-main></video-main>
    </div>
</template>
<script lang="ts">
import { Vue,Component,Prop,Emit,Model,Watch } from "vue-property-decorator";
import {VideoMain,NavBar} from './components'
@Component({
    components:{
        VideoMain,
        NavBar
    }
})
export default class ModuleView extends Vue{} 
</script>
<style lang="scss" scoped>

</style>