import Vue from 'vue'

Vue.directive('watermark', (el, binding) => {
   function addWaterMarker(str, parentNode, font, textColor) {// 水印文字，父元素，字体，文字颜色
       var can = document.createElement('canvas');
       parentNode.appendChild(can);
       can.width = 400;
       can.height = 200;
       can.style.display = 'none';
       var cans = can.getContext('2d');
       cans.rotate(-15 * Math.PI / 180);//旋转角度
       cans.font = font || "24px Microsoft JhengHei";
       cans.fillStyle = textColor || "rgba(180, 180, 180, 0.3)";
       cans.textAlign = 'left';
       cans.textBaseline = 'Middle';
       // cans.fillText(str, can.width / 3, can.height / 2);
       for (let i = 0; i < 800 / can.height; i++) {
           for (let j = 0; j < can.width / 50; j++) {

               cans.fillText(str, i * 200, j * 100)
           }
       }
    //    parentNode.src = can.toDataURL("image/png");
   }
   addWaterMarker(binding.value.text, el, binding.value.font, binding.value.textColor)
})
