import Taro from "@tarojs/taro";
import { OsButton } from "ossaui";

const user = () => {
  // 退出系统
  const quit = () => {
    Taro.clearStorageSync();
    Taro.redirectTo({ url: "/pages/login/index" });
  };

  return (
    <>
      <view>我的</view>
      <OsButton type="primary" size="block" onClick={quit}>
        退出
      </OsButton>
    </>
  );
};

export default user;
