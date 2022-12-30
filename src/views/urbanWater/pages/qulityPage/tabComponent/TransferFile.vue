<template>
	<!-- 调水档案 -->
	<div class="company-view">
		<div class="top-btns">
			<div class="flex-class">
				<div>
					<template>
						<el-date-picker
							v-model="date"
							type="daterange"
							range-separator="-"
							style="width: 320px; margin-right: 10px"
							size="small"
							format="yyyy-MM-dd HH:mm:ss"
						></el-date-picker>
					</template>
				</div>
				<div>
					<search-component @input="getSearch"></search-component>
				</div>
				<!-- <div>
          <suc-button
            type="primary"
            :config="{
              ghost: true
            }"
            :debounce="800"
            style="margin-left:10px;"
          >重置</suc-button>
        </div>-->
			</div>
		</div>
		<!-- <div class="companys flex-class">
      <div
        class="company-item"
        v-for="(item, index) in transferList"
        :key="'transfer' + index"
      >
        <div class="item-head">
          <div>
            <span>{{ item.title }}</span>
          </div>
        </div>
        <div class="item-content">
          <div class="info">
            <div class="info-item">
              <span class="info-name">调水前水质：</span>
              <span :class="item.beforeColor">{{ item.beforeQulity }}</span>
            </div>
            <div class="info-item">
              <span class="info-name">调水后水质：</span>
              <span :class="item.currentColor">{{ item.currentQulity }}</span>
            </div>
          </div>
          <div class="info">
            <div class="info-item">
              <span class="info-name">调水时长：</span>
              <span>{{ item.hour }}</span>
            </div>
            <div class="info-item">
              <span class="info-name">调水执行人：</span>
              <span>{{ item.excutive }}</span>
            </div>
          </div>
          <div class="info">
            <div><span class="info-name">调水时间：</span></div>
            <div class="info-name">
              <div>
                <span>{{ item.time1 }}</span>
              </div>
              <div>
                <span>{{ item.time2 }}</span>
              </div>
            </div>
            <div class="flex-class">
              <span class="iconfont icon-shijianfanwei info-name"></span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div>
      <suc-page
        :total="pageParams.total"
        :current="pageParams.current"
        :page-size="pageParams.pageSize"
        size="small"
        show-sizer
        show-elevator
        @on-change="getPage"
        @on-page-size-change="getSize"
      />
    </div>
    <div v-show="btnFlag" class="switch-btn left-btn" @click="scrollIt(1)">
      <span>＜</span>
    </div>
    <div v-show="btnFlag" class="switch-btn right-btn" @click="scrollIt(0)">
      <span>＞</span>
    </div>-->
		<div class="content">
			<table-component
				:columns="columns"
				:tableData="transferList"
			></table-component>
		</div>
	</div>
</template>
<script lang="ts">
import {
	Vue,
	Component,
	Prop,
	Emit,
	Model,
	Watch,
} from "vue-property-decorator";
import { SucPage, SucDatePicker, SucButton } from "@suc/ui";
import { DatePicker } from "element-ui";
import { State, Mutation, Action, namespace } from "vuex-class";
import { DatePickerOptions } from "@suc/ui/interfaces";
// import SearchComponent from "./SearchComponent.vue";
import { SearchComponent, TableComponent } from "@/components";
import { networkApi } from "@/api";
import dayjs from "dayjs";

@Component({
	components: {
		SucPage,
		SucDatePicker,
		SucButton,
		SearchComponent,
		TableComponent,
		ElDatePicker: DatePicker,
	},
})
export default class TransferFile extends Vue {
	@State waterQulity: any;
	date: any = [];
	options: DatePickerOptions = {
		type: "datetimerange",
	};
	transferList: any[] = [];
	btnFlag: boolean = false;
	pageParams: any = {
		total: 0,
		pageSize: 10,
		current: 1,
	};

	columns: any[] = [
		{
			title: "序号",
			type: "index",
		},
		{
			title: "名称",
			key: "title",
		},
		{
			title: "调水前水质",
			key: "beforeQulity",
		},
		{
			title: "调水后水质",
			key: "currentQulity",
		},
		{
			title: "调水时长",
			key: "hour",
		},
		{
			title: "执行人",
			key: "excutive",
		},
		{
			title: "调水开始时间",
			key: "time2",
		},
		{
			title: "调水开始时间",
			key: "time1",
		},
	];

	mounted() {
		this.init();
	}

	init() {
		let st = dayjs().subtract(31, "day").format("YYYY-MM-DD HH:mm:ss");
		let et = dayjs().format("YYYY-MM-DD HH:mm:ss");
		this.dateRange = {
			start: st,
			end: et,
		};
		this.date = [st, et];
		this.getDaList();
	}
	// getPage(page: number) {
	//   this.pageParams.current = page;
	//   this.getDaList();
	// }
	// getSize(size: number) {
	//   this.pageParams.current = 1;
	//   this.pageParams.pageSize = size;
	//   this.getDaList();
	// }
	// scrollIt(i: number) {
	//   if (i == 0) {
	//     document.getElementsByClassName("companys")[0].scrollLeft += 140;
	//   }
	//   if (i == 1) {
	//     document.getElementsByClassName("companys")[0].scrollLeft -= 140;
	//   }
	// }

	value: string = "";
	getDaList() {
		this.transferList = [];
		let url = "/jnsw/sz/getDsda";
		let params = {
			// currentPage: this.pageParams.current,
			// size: this.pageParams.pageSize,
			start: this.dateRange.start,
			end: this.dateRange.end,
			mc: this.value,
			id: this.waterQulity.qulity.riverId,
		};
		this.$http
			.get(url, { params })
			.then((res: any) => {
				let data = res.data;
				this.transferList = data.map((item: any) => {
					let nitem = {
						title: item.mc,
						beforeQulity: item.dsqsz,
						currentQulity: item.dshsz,
						hour: item.sc + "h",
						excutive: item.zxr,
						time1: item.jssj,
						time2: item.kssj,
						beforeColor: "red-color",
						currentColor: "green-color",
					};
					return nitem;
				});
			})
			.catch((err: any) => {
				console.log(err.data.message);
			});
	}
	dateRange: any = {
		start: "",
		end: "",
	};
	getSearch(val: any) {
		this.value = val;
		if (this.date.length > 0) {
			this.dateRange = {
				start: this.$utils.dateFormat(
					this.date[0],
					"yyyy-MM-dd HH:mm:ss"
				),
				end: this.$utils.dateFormat(
					this.date[1],
					"yyyy-MM-dd HH:mm:ss"
				),
			};
		}

		this.getDaList();
	}
}
</script>
<style lang="scss" scoped>
@import "@/styles/commonVariables.scss";
.company-view {
	padding: 0 10px;
	position: relative;
	width: 100%;
	height: 100%;
	//   height: 260px;

	.companys {
		padding: 10px 0;
		overflow: hidden;
		// height: calc(100% - 80px);
		.company-item {
			flex-shrink: 0;
			width: calc(25% - 10px);
			//   height: 220px;
			margin-right: 10px;
			font-size: $font-size-base;
			color: $heading-color;
			border: 1px solid $border-color;
			.item-head {
				padding: 10px 14px;
				color: #ffffff;
				background: url("../../../../../assets/environment/qulitybg.png")
					no-repeat;
				background-size: cover;
			}
			.item-content {
				padding: 10px 10px 0;
			}
			.info {
				display: flex;
				padding-bottom: 10px;
				&-item {
					width: 50%;
				}
				&-name {
					color: $help-color;
				}
				.red-color {
					color: #ff5a47;
				}
				.green-color {
					color: #32bb53;
				}
			}
		}
	}
	.switch-btn {
		display: flex;
		align-items: center;
		width: 28px;
		height: 38px;
		background-color: rgba($color: #000000, $alpha: 0.5);
		color: #ffffff;
		font-size: 20px;
		border-radius: 5px;
		cursor: pointer;
	}
	.left-btn {
		position: absolute;
		top: 110px;
		left: 0;
	}
	.right-btn {
		position: absolute;
		top: 110px;
		right: 0;
	}
	.top-btns {
		padding-bottom: 10px;
		.flex-class {
			display: flex;
			align-items: center;
		}
	}
	.content {
		height: calc(100% - 43px);
	}
}
</style>
