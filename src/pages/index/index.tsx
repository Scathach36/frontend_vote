import { View, Text } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { OsTabs, OsTabsHeader, OsTabsHeaderItem, OsTabsPanel } from "ossaui";
import { useEffect } from "react";
import "./index.scss";

const index = () => {
  //   token校验
  useEffect(() => {
    const token = Taro.getStorageSync("token") || null;
    if (token !== null) {
      Taro.request({
        url: "http://localhost:8080/login/checkToken",
        method: "POST",
        header: { token },
      }).then((res) => {
        if (!res) {
          Taro.redirectTo({
            url: "/pages/login/index",
          });
        }
      });
    }
  });
  return (
    <>
      {Taro.getStorageSync("role") == "0" && (
        <>
          <view>学生</view>
        </>
      )}
      {Taro.getStorageSync("role") == "1" && (
        <>
          <view>教师</view>
        </>
      )}
      {Taro.getStorageSync("role") == "2" && (
      <>
        <view>管理员</view>
      </>
      )}
    </>
  );
};

export default index;
