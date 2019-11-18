module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        'views': '@/views',
        'components': '@/components',
        'network': '@/network',
        'common': '@/common',
        'assets': '@/assets',
      }
    }
  },
  devServer: {
    port: 8888,     // 端口
  },
  lintOnSave: false   // 取消 eslint 验证
}