import { OsTabBar } from "ossaui";
import "../../node_modules/ossaui/dist/style/components/tab-bar.scss";
import "./custom.scss";
import { useDispatch, useSelector } from "react-redux";
import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";

export default () => {
  const current = useSelector((state: any) => state.current);
  const dispatch = useDispatch();

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
      path: "/pages/voteCount/index",
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
    dispatch({ type: "SETCURRENTVALUE", current: index });
  };

  return (
    <View>
      {Taro.getStorageSync("data").role == 0 && (
        <OsTabBar
          tabsArr={tabsArrForStudent}
          activeTabIdx={current.current}
          onClick={onChange}
        />
      )}
      {Taro.getStorageSync("data").role == 1 && (
        <OsTabBar
          tabsArr={tabsArrForTeacher}
          activeTabIdx={current.current}
          onClick={onChange}
        />
      )}
      {Taro.getStorageSync("data").role == 2 && (
        <OsTabBar
          tabsArr={tabsArrForAdmin}
          activeTabIdx={current.current}
          onClick={onChange}
        />
      )}
    </View>
  );
};
