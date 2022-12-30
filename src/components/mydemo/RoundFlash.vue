<template>
  <div class="content">
    <div class="point point-flicker">
      <div class="test"></div>
    </div>
    <!-- <div class="cicrle1"></div> -->
  </div>
</template>

<style lang="scss" scoped>
.content {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  position: absolute;
  left: -30%;
}
.point {
  width: 20px;
  height: 20px;
  background-color: #e89999;
  position: absolute;
  border-radius: 50%;
}
.test {
  width: 12px;
  height: 12px;
  background: #fafafa;
  border-radius: 50%;
  position: absolute;
  left: 21%;
  top: 20%;
}

/* 设置动画前颜色 */
.point-flicker:after {
  background-color: #e89999;
}

/* 设置动画后颜色 */
.point-flicker:before {
  background-color: rgba(253, 0, 118, 0.2);
}

/* 设置动画 */
.point-flicker:before,
.point-flicker:after {
  content: "";
  width: 40px;
  height: 40px;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -20px;
  margin-top: -20px;
  border-radius: 50%;
  animation: warn 1s linear 0s infinite;
}

/* 设置动画后颜色 */
.cicrle1:before {
  background-color: rgba(0, 168, 253, 0.5);
}

.cicrle1:before,
.cicrle1:after {
  content: "";
  width: 80px;
  height: 80px;
  position: absolute;
  left: 50%;
  top: 50%;
  border-radius: 50%;
  animation: warn 1s ease-out 0s infinite;
}

// @keyframes warn {
//   0% {
//     transform: scale(0.5);
//     opacity: 1;
//   }
//   30% {
//     transform: scale(0.7);
//     opacity: 1;
//   }

//   100% {
//     transform: scale(1.4);
//     opacity: 0;
//   }
// }

@keyframes warn {
  from {
    /**动画开始 */
    transform: scale(0.5);
    opacity: 1;
  }
  to {
    transform: scale(1.4);
    opacity: 0;
  }
}
</style>
