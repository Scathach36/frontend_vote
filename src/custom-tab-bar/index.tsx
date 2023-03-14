import { OsTabBar } from "ossaui";
import "../../node_modules/ossaui/dist/style/components/tab-bar.scss";
import "ossaui/dist/style/components/icon.scss";
import { useEffect, useState } from "react";
import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";

const tabsArr = [
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

export default () => {
  // 需要使用全局状态管理current，因为每个页面的tabbar都是不同的实例
  const [current, setCurrent] = useState<number>(0);

  const onChange = (item, index) => {
    Taro.switchTab({
      url: item.path,
    });
    setCurrent(index);
  };

  return (
    <View>
      <OsTabBar tabsArr={tabsArr} activeTabIdx={current} onClick={onChange} />
    </View>
  );
};
