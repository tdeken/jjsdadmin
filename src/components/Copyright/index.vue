<template>
  <div class="footer">
    <el-container>
      <el-footer>
        <div class="copyright">
          <p class="copyright-text" onclick="window.open('https://beian.miit.gov.cn')">
            <img class="copyright-img" src="./image/b.png" alt="">
            Copyright © 粤ICP备2021125107号
          </p>
        </div>
      </el-footer>
    </el-container>
  </div>
</template>
<script>
export default {
  name: 'FooterComponent'
}
</script>

<style lang="scss">
.footer {
  position: fixed;
  width: 100%;
  bottom: 0;
  background-color: #2d3a4b; /* 设置背景色 */
  padding: 20px;
  text-align: center; /* 居中对齐 */
}

.copyright {
  display: block;
  margin-top: 30px;
  color: #fff; /* 设置文字颜色 */
  font-size: 13px;
}
</style>
