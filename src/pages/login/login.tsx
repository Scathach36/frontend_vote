import Taro from "@tarojs/taro";
import { OsButton, OsInput, OsToast } from "ossaui";
import { useEffect, useState } from "react";

const login = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [toastText, setToastText] = useState<string>("");
  const [isShow, setIsShow] = useState<boolean>(false);

  const data = {
    username,
    password,
  };

//   token校验
  useEffect(() => {
    const token = Taro.getStorageSync("token") || null;
    if (token !== null) {
      Taro.request({
        url: "http://localhost:8080/login/checkToken",
        method: "POST",
        header: { token },
      }).then((res) => {
        if (res) {
          Taro.redirectTo({
            url: "/pages/index/index",
          });
        } else {
            Taro.redirectTo({
                url: "/pages/login/login",
              });
        }
      });
    }
  });

  // 登录
  const login = () => {
    if (username.length == 0 || password.length == 0) {
      setToastText("请输入用户名或密码");
      setIsShow(true);
    } else {
      Taro.request({
        url: "http://localhost:8080/login/login",
        method: "POST",
        data,
      }).then((res) => {
        if (!res.data.role) {
          setToastText(res.data.msg);
          setIsShow(true);
        } else {
          Taro.setStorageSync("token", res.data.token);
          setToastText("登录成功");
          setIsShow(true);
          Taro.redirectTo({
            url: "/pages/index/index",
          });
        }
      });
    }
  };

  const toastClose = () => {
    setIsShow(false);
  };

  return (
    <>
      <OsInput
        label="用户名"
        placeholder="请输入用户名"
        value={username.trim()}
        onChange={(v) => {
          setUsername(v.trim());
        }}
        maxLength={15}
      ></OsInput>
      <OsInput
        type="password"
        label="密码"
        placeholder="请输入密码"
        value={password.trim()}
        onChange={(v) => {
          setPassword(v.trim());
        }}
        maxLength={15}
      ></OsInput>
      <OsButton type="primary" size="block" onClick={login}>
        登录
      </OsButton>

      <OsToast text={toastText} isShow={isShow} onClose={toastClose}></OsToast>
    </>
  );
};

export default login;
