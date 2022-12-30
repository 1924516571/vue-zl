<template>
    <div class="main_view">
        <nav-bar></nav-bar>
        <message-main></message-main>
    </div>
</template>
<script lang="ts">
import { Vue,Component,Prop,Emit,Model,Watch } from "vue-property-decorator";
import {MessageMain,NavBar} from './components'
@Component({
    components:{
        MessageMain,
        NavBar
    }
})
export default class ModuleView extends Vue{} 
</script>
<style lang="scss" scoped>

</style>