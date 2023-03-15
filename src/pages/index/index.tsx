import Taro from "@tarojs/taro";
import { OsButton } from "ossaui";

import { useEffect, useState } from "react";
import "./index.scss";

const index = () => {
  // token校验
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

  //添加新投票
  const addVote = () => {
    Taro.navigateTo({ url: "/pages/addVote/index" });
  };

  return (
    <>
      <OsButton type="primary" size="block" icon="add" onClick={addVote}>
        创建投票
      </OsButton>
    </>
  );
};

export default index;
