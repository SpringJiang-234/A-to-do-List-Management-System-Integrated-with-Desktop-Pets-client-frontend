<script setup lang="ts">
import moment from "moment";
import "moment/dist/locale/zh-cn";
import { ref, onMounted } from "vue";

moment.locale("zh-cn");

const props = withDefaults(
  defineProps<{
    size: number;
  }>(),
  {
    size: 10
  }
);

const ansRes: any = [];
const date = new Date();
const today = {
  year: date.getFullYear(),
  month: date.getMonth(),
  day: date.getDate()
};
let endTime = moment(date, "YYYY/MM/DD").format("L");
let startTime = moment(
  today.year - 1 + "/" + (today.month + 1) + "/" + today.day,
  "YYYY/MM/DD"
).format("L");
const visibleList = ref<Record<string, boolean>>({});
let days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

interface MonthData {
  year: number;
  month: number;
  remainDay: number;
  week: number;
  rev: boolean;
}

function isLeapYear(year: number) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function init() {
  //上一年开始遍历
  //下标从0开始
  for (let month = today.month; month <= 12 + today.month; month++) {
    let year = Math.floor(month / 12); //0->前一年 1->今年
    let m = month % 12;
    let remainDay;
    let week;
    if (month != today.month && month != 12 + today.month) {
      remainDay =
        days[m] +
        (isLeapYear(today.year - (year == 0 ? 1 : 0)) && m == 1 ? 1 : 0); // 闰年补1
      week = new Date(
        today.year - (year == 0 ? 1 : 0) + "/" + (m + 1) + "/1"
      ).getDay();
    } else {
      if (month == today.month) {
        remainDay =
          days[m] -
          today.day +
          1 +
          (isLeapYear(today.year - (year == 0 ? 1 : 0)) && m == 1 ? 1 : 0); // 例如 1/1 ~ 1/2 日期相差2天，相减+1
        week = new Date(
          today.year - (year == 0 ? 1 : 0) + "/" + (m + 1) + "/" + today.day
        ).getDay();
      } else {
        remainDay =
          today.day +
          (isLeapYear(today.year - (year == 0 ? 1 : 0)) && m == 1 ? 1 : 0);
        week = new Date(
          today.year - (year == 0 ? 1 : 0) + "/" + (m + 1) + "/1"
        ).getDay();
      }
    }

    ansRes.push({
      year,
      month: m,
      remainDay,
      week,
      rev: month == today.month // 第一个日期必须反转 例如2024/1/20 剩余11天，应该显示2024/1/20 ~ 2024/1/31
    });
  }
}

const viewsList = ref<any>({
  totalCnt: 0,
  views: {
    // '2025/01/20': 10 //格式 —— (key：日期，value：数量)
  },
  colors: {
    // '2025/01/20': '#fff000' //格式 —— (key：日期，value：色值)
  }
});

// 自定义颜色
const colorArr = [
  "#E0F8E0",
  "#C6E0C6",
  "#AEE6AE",
  "#96EA96",
  "#7EF07E",
  "#66F566",
  "#4EF94E",
  "#36FD36",
  "#1EFF1E",
  "#00CC00"
];
function getColorFunc(value: number): string {
  let i = 0;
  while (value > 10 && i < colorArr.length) {
    value -= 10;
    i += 1;
  }
  return colorArr[i];
}

function generateData() {
  let startTimeStamp = new Date(startTime).getTime();
  let endTimeStamp = new Date(endTime).getTime();
  // 随机生成365个数据
  for (let i = 0; i < 365; i++) {
    let randomTimeStamp: number =
      endTimeStamp - Math.random() * (endTimeStamp - startTimeStamp); //  随机减一个随机时间戳，相当于在今天的时间戳基础上减
    let dateStr: string = moment(randomTimeStamp).format("YYYY/MM/DD");
    if (!viewsList.value.views[dateStr]) {
      viewsList.value.views[dateStr] = 0;
    }
    let curCnt = (Math.random() * 100) | 0; // |0去除小数点
    viewsList.value.views[dateStr] += curCnt;
    viewsList.value.totalCnt += curCnt;
    viewsList.value.colors[dateStr] = getColorFunc(
      viewsList.value.views[dateStr]
    );
  }
}

const formatDate = (year: number, month: number, day: number | string) => {
  return moment(
    today.year +
      (year == 0 ? -1 : 0) +
      "/" +
      (month + 1) +
      "/" +
      (Number(day) + 1),
    "YYYY/MM/DD"
  ).format("L");
};

init();
onMounted(() => {
  generateData();
});
</script>

<template>
  <div class="calander_box">
    <p class="view_title">
      近一年共浏览
      <span style="font-weight: bold; padding: 0 5px"
        >{{ viewsList?.totalCnt != null ? viewsList?.totalCnt : "..." }}
      </span>
      次
    </p>
    <el-scrollbar>
      <div class="mobile_wrap">
        <div class="calander_view_g_wrap">
          <div
            class="views_wrap"
            v-for="month in ansRes"
            v-show="month.remainDay > 0"
          >
            <!-- 一排 7个 加边距(20px) -->
            <div
              class="views_month"
              :style="{ height: props.size * 7 + 20 + 'px' }"
            >
              <!-- 伪装的格子 -->
              <div
                class="views_day"
                :style="{
                  width: props.size + 'px',
                  height: props.size + 'px'
                }"
                v-for="_offset in month.week"
                style="background: transparent; cursor: auto"
              ></div>
              <!-- 真正显示的格子 -->
              <div v-for="(_day, index) in month.remainDay">
                <el-tooltip
                  effect="dark"
                  :visible="
                    visibleList[formatDate(month.year, month.month, index)]
                  "
                  :content="`${formatDate(month.year, month.month, !month.rev ? index : Number(days[month.month]) - (Number(month.remainDay) - Number(index)))}  ${viewsList?.views[formatDate(month.year, month.month, index)] || 0}次浏览`"
                  placement="top-start"
                >
                  <div
                    class="views_day"
                    @mouseenter="
                      visibleList[formatDate(month.year, month.month, index)] =
                        true
                    "
                    @mouseleave="
                      visibleList[formatDate(month.year, month.month, index)] =
                        false
                    "
                    :style="{
                      background:
                        viewsList?.colors[
                          formatDate(month.year, month.month, index)
                        ],
                      width: props.size + 'px',
                      height: props.size + 'px'
                    }"
                  ></div>
                </el-tooltip>
              </div>
            </div>
            <p style="color: #a2a2a2">{{ month.month + 1 + "月" }}</p>
          </div>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<style lang="scss" scoped>
.calander_box {
  width: 100%;
  padding: 20px;

  .view_title {
    font-size: 18px;
    padding-left: 10px;
    margin-bottom: 20px;
  }

  .mobile_wrap {
    width: fit-content;

    @media screen and (max-width: 480px) {
      width: 800px;
      white-space: nowrap;
      overflow-anchor: auto;
    }

    .calander_view_g_wrap {
      display: flex;
      justify-content: space-between;

      .views_wrap {
        width: 100%;
        margin-right: 8px;
        margin-left: 8px;

        p {
          text-align: center;
          margin-top: 10px;
        }

        .views_month {
          width: calc(100% / 12);
          height: 90px;
          display: flex;
          flex-direction: column;
          flex-wrap: wrap;

          @media screen and (max-width: 1200px) {
            height: 50px;
          }

          .views_day {
            margin: 0 2px 2px 0;
            border-radius: 2px;
            background: #f7f7f8;
            cursor: pointer;

            @media screen and (max-width: 1200px) {
              width: 5px;
              height: 5px;
            }
          }
        }
      }
    }
  }
}
</style>
