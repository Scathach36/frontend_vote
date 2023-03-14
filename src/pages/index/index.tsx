import { View, Text } from "@tarojs/components";
import Taro from "@tarojs/taro";
import {
  OsButton,
  OsNoticeBar,
  OsTabs,
  OsTabsHeader,
  OsTabsHeaderItem,
  OsTabsPanel,
} from "ossaui";
import { useEffect, useState } from "react";
import "./index.scss";

const index = () => {
  const [current, setCurrent] = useState<number>(1);

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

  // 退出系统
  const quit = () => {
    Taro.clearStorageSync();
    Taro.redirectTo({ url: "/pages/login/index" });
  };

  return (
    <>
      <>
        <OsNoticeBar leftIcon="inform" scrollable>
          如果需要更改学号、班级、姓名等个人信息，请联系管理员帮助修改。
        </OsNoticeBar>
        <OsTabs
          renderHeader={
            <OsTabsHeader value={current}>
              {Taro.getStorageSync("role") > 0 && (
                <OsTabsHeaderItem
                  index={0}
                  current={current}
                  text="发起投票"
                  onClick={(value) => setCurrent(value)}
                />
              )}
              <OsTabsHeaderItem
                index={1}
                current={current}
                text="参与投票"
                onClick={(value) => setCurrent(value)}
              />
              <OsTabsHeaderItem
                index={2}
                current={current}
                text="我的"
                onClick={(value) => setCurrent(value)}
              />
            </OsTabsHeader>
          }
        >
          <OsTabsPanel
            current={current}
            index={0}
            customStyle={{ height: Taro.pxTransform(400) }}
          >
            <View className="tabs__content">发起投票</View>
          </OsTabsPanel>
          <OsTabsPanel
            current={current}
            index={1}
            customStyle={{ height: Taro.pxTransform(400) }}
          >
            <View className="tabs__content">参与投票</View>
          </OsTabsPanel>
          <OsTabsPanel
            current={current}
            index={2}
            customStyle={{ height: Taro.pxTransform(400) }}
          >
            <OsButton type="primary" size="block" onClick={quit}>
              退出系统
            </OsButton>
          </OsTabsPanel>
        </OsTabs>
      </>
      )
    </>
  );
};

export default index;
