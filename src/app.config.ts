export default defineAppConfig({
  pages: [
    "pages/login/index",
    "pages/index/index",
    "pages/register/index",
    "pages/user/index",
    "pages/addVote/index",
    "pages/voteDetail/index",
    "pages/voteCount/index",
    "pages/echarts/index",
    "pages/userManagement/index",
  ],
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#fff",
    navigationBarTitleText: "WeChat",
    navigationBarTextStyle: "black",
  },
  tabBar: {
    custom: true,
    list: [
      {
        pagePath: "pages/index/index",
        text: "首页",
      },
      {
        pagePath: "pages/user/index",
        text: "我的",
      },
      {
        pagePath: "pages/voteCount/index",
        text: "投票统计",
      },
      {
        pagePath: "pages/userManagement/index",
        text: "用户管理",
      },
    ],
  },
});
