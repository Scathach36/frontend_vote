import { OsTabBar } from "ossaui";
import "../../node_modules/ossaui/dist/style/components/tab-bar.scss";
import "./custom.scss";
import { useState } from "react";
import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";

export default () => {
  // 需要使用全局状态管理current，因为每个页面的tabbar都是不同的实例
  const [current, setCurrent] = useState<number>(0);

  const tabsArrForStudent: any[] = [
    {
      icon: "home",
      selectedIcon: "home-pressed",
      text: "首页",
      path: "/pages/index/index",
    },
    {
      icon: "user",
      selectedIcon: "user-pressed",
      text: "我的",
      path: "/pages/user/index",
    },
  ];

  const tabsArrForTeacher: any[] = [
    {
      icon: "home",
      selectedIcon: "home-pressed",
      text: "首页",
      path: "/pages/index/index",
    },
    {
      icon: "subject",
      selectedIcon: "subject-pressed",
      text: "投票统计",
      path: "/pages/index/index",
    },
    {
      icon: "user",
      selectedIcon: "user-pressed",
      text: "我的",
      path: "/pages/user/index",
    },
  ];

  const tabsArrForAdmin: any[] = [
    {
      icon: "home",
      selectedIcon: "home-pressed",
      text: "首页",
      path: "/pages/index/index",
    },
    {
      icon: "subject",
      selectedIcon: "subject-pressed",
      text: "投票管理",
      path: "/pages/index/index",
    },
    {
      icon: "my-group-buying",
      selectedIcon: "my-group-buying-select",
      text: "用户管理",
      path: "/pages/index/index",
    },
    {
      icon: "user",
      selectedIcon: "user-pressed",
      text: "我的",
      path: "/pages/user/index",
    },
  ];

  const onChange = (item, index) => {
    Taro.switchTab({
      url: item.path,
    });
    setCurrent(index);
  };

  return (
    <View>
      {Taro.getStorageSync("data").role == 0 && (
        <OsTabBar
          tabsArr={tabsArrForStudent}
          activeTabIdx={current}
          onClick={onChange}
        />
      )}
      {Taro.getStorageSync("data").role == 1 && (
        <OsTabBar
          tabsArr={tabsArrForTeacher}
          activeTabIdx={current}
          onClick={onChange}
        />
      )}
      {Taro.getStorageSync("data").role == 2 && (
        <OsTabBar
          tabsArr={tabsArrForAdmin}
          activeTabIdx={current}
          onClick={onChange}
        />
      )}
    </View>
  );
};
