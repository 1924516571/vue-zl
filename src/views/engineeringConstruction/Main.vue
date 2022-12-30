<template>
<!-- 视频监控 -->
    <div class="main_view">
        <nav-bar></nav-bar>
        <engineeringConstruction-Main></engineeringConstruction-Main>
    </div>
</template>
<script lang="ts">
import { Vue,Component,Prop,Emit,Model,Watch } from "vue-property-decorator";
import {engineeringConstructionMain,NavBar} from './components'
@Component({
    components:{
        NavBar,
        engineeringConstructionMain
    }
})
export default class ModuleView extends Vue{} 
</script>
<style lang="scss" scoped>

</style>