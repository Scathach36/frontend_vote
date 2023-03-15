import Taro from "@tarojs/taro";
import { OsButton, OsModal } from "ossaui";
import { useState } from "react";

const user = () => {
  const [showBase, setShowBase] = useState(false);

  // 退出系统
  const quit = () => {
    setShowBase(false);
    Taro.clearStorageSync();
    Taro.redirectTo({ url: "/pages/login/index" });
  };

  return (
    <>
      <view>我的</view>
      <OsButton type="primary" size="block" onClick={() => setShowBase(true)}>
        退出
      </OsButton>

      <OsModal
        title="确认退出"
        cancelText="取消"
        confirmText="确定"
        content="确认要退出系统吗"
        isShow={showBase}
        onCancel={() => setShowBase(false)}
        onClose={() => setShowBase(false)}
        onConfirm={quit}
      ></OsModal>
    </>
  );
};

export default user;
