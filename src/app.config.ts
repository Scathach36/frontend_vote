export default defineAppConfig({
  pages: [
    'pages/login/index',
    'pages/index/index',
    'pages/register/index',
    'pages/user/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    custom: true,
    list: [
      {
        pagePath: "pages/index/index",
        text: "首页"
      },
      {
        pagePath: "pages/user/index",
        text: "我的"
      }
    ]
  }
})
