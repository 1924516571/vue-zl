<template>
<!-- 政务办公 -->
    <div class="main_view">
        <nav-bar></nav-bar>
        <ps-main></ps-main>
    </div>
</template>
<script lang="ts">
import { Vue,Component,Prop,Emit,Model,Watch } from "vue-property-decorator";
import {PsMain,NavBar} from './components'
@Component({
    components:{
        PsMain,
        NavBar
    }
})
export default class ModuleView extends Vue{} 
</script>
<style lang="scss" scoped>

</style>