import Taro from "@tarojs/taro";

import { useEffect, useState } from "react";
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
      <view>首页 </view>
    </>
  );
};

export default index;
