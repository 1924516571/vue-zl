<template>
<!-- 政务办公 -->
    <div class="main_view">
        <nav-bar></nav-bar>
        <zw-main></zw-main>
    </div>
</template>
<script lang="ts">
import { Vue,Component,Prop,Emit,Model,Watch } from "vue-property-decorator";
import {ZwMain,NavBar} from './components'
@Component({
    components:{
        ZwMain,
        NavBar
    }
})
export default class ModuleView extends Vue{} 
</script>
<style lang="scss" scoped>

</style>