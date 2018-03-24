module.exports = {
  root: true, // 确保当前目录都用这个规则，不去遍历父级目录，可以给每个目录单独设置eslint规则
  env: {      // 环境设置
    browser: true,
    node: true,
    es6: true,
  },
  extends: 'airbnb-base', // 就是刚才初始化选择的验证包咯
}