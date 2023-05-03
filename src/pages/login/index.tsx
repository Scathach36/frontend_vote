import Taro from "@tarojs/taro";
import { OsActionsheet, OsButton, OsInput, OsModal, OsToast } from "ossaui";
import { useEffect, useState } from "react";
import { Weapp } from "@tarojs/plugin-platform-weapp";
import { Button, View } from "@tarojs/components";

const login = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [toastText, setToastText] = useState<string>("");
  const [isShow, setIsShow] = useState<boolean>(false);
  const [showBase, setShowBase] = useState<boolean>(false);
  const [bindShow, setBindShow] = useState<boolean>(false);
  const [openId, setOpenId] = useState<string>("");

  const appId = "wx79b641290cf31106";
  const appSecret = "651009e8a1290f25aae136c9c3c19b29";

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
            url: "/pages/login/index",
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
        if (!res.data.data.role) {
          setToastText(res.data.data.msg);
          setIsShow(true);
        } else {
          Taro.setStorageSync("token", res.data.data.token);
          Taro.setStorageSync("data", res.data.data);
          setToastText("登录成功");
          setIsShow(true);
          Taro.redirectTo({
            url: "/pages/index/index",
          });
        }
      });
    }
  };

  // 注册跳转
  const goToReg = () => {
    Taro.navigateTo({ url: "/pages/register/index" });
  };

  const toastClose = () => {
    setIsShow(false);
  };

  // 一键登录
  const handleGetUserProfile = () => {
    Taro.getUserProfile({
      lang: "zh_CN",
      desc: "获取你的昵称、头像、地区及性别",
      success: (response) => {
        console.log("response", response);
        Taro.setStorageSync("userInfo", response.userInfo);
        Taro.login({
          success: (res) => {
            // console.log("loginRes", res.code);
            Taro.request({
              url:
                "https://api.weixin.qq.com/sns/jscode2session?appid=" +
                appId +
                "&secret=" +
                appSecret +
                "&js_code=" +
                res.code +
                "&grant_type=authorization_code",
              method: "GET",
            }).then((r) => {
              // console.log("openid", r.data.openid);
              const openid = r.data.openid;
              setOpenId(openid);
              Taro.request({
                url: "http://localhost:8080/login/wxLogin",
                method: "POST",
                data: {
                  openid,
                },
              }).then((res) => {
                console.log(res);
                if (res.data.code == 201 && res.data.msg == "用户不存在") {
                  setShowBase(true);
                } else if (res.data.code == 200 && res.data.msg == "登录成功") {
                  Taro.setStorageSync("token", res.data.data.token);
                  Taro.setStorageSync("data", res.data.data);
                  setToastText(res.data.msg);
                  setIsShow(true);
                  Taro.redirectTo({
                    url: "/pages/index/index",
                  });
                }
              });
            });
          },
        });
      },
    });
  };

  // 绑定账号
  const bindUser = () => {
    Taro.request({
      url: "http://localhost:8080/login/bindUser",
      method: "POST",
      data: {
        username,
        password,
        openid: openId,
      },
      success: (res) => {
        console.log(res);
        if (res.data.code == 201) {
          setToastText(res.data.msg);
          setIsShow(true);
        } else {
          setToastText(res.data.msg);
          setIsShow(true);
          setBindShow(false);
          setShowBase(false);
          setUsername("");
          setPassword("");
        }
      },
    });
  };

  // 注册为新用户
  const createUser = () => {
    Taro.request({
      url: "http://localhost:8080/user/save",
      method: "POST",
      data: {
        role: 0,
        openid: openId,
      },
      success: (response) => {
        if (response.statusCode == 200) {
          Taro.setStorageSync("data", { role: "0" });
          Taro.request({
            url: "http://localhost:8080/login/createToken",
            method: "POST",
            data: openId,
            success: (res) => {
              setToastText("注册成功");
              setIsShow(true);
              Taro.setStorageSync("token", res.data.token);
              Taro.setStorageSync("new", true);
              setShowBase(false);
            },
          });
        }
      },
    });
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
        customStyle={{ marginTop: "20px" }}
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
        customStyle={{ marginTop: "20px" }}
      ></OsInput>
      <OsButton
        type="primary"
        size="block"
        onClick={login}
        customStyle={{ marginTop: "20px" }}
      >
        登录
      </OsButton>
      <OsButton
        type="default"
        size="block"
        onClick={goToReg}
        customStyle={{ marginTop: "20px" }}
      >
        注册
      </OsButton>
      <OsButton
        type="default"
        size="block"
        customStyle={{ marginTop: "20px" }}
        onClick={handleGetUserProfile}
        openType="getUserInfo"
      >
        一键登录
      </OsButton>

      <OsToast text={toastText} isShow={isShow} onClose={toastClose}></OsToast>

      <OsActionsheet
        title="首次登录"
        isShow={showBase}
        onClose={() => {
          setShowBase(false);
        }}
      >
        <View
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            marginTop: "8rpx",
          }}
        >
          <OsButton
            type="primary"
            size="normal"
            shape="round"
            onClick={() => {
              setBindShow(true);
            }}
          >
            绑定账号
          </OsButton>
          <OsButton
            type="primary"
            size="normal"
            shape="round"
            onClick={createUser}
          >
            注册为新用户
          </OsButton>
        </View>
      </OsActionsheet>

      {/* 绑定账号 */}
      <OsModal
        cancelText="取消"
        confirmText="确定"
        closeOnClickMask
        isShow={bindShow}
        onCancel={() => setBindShow(false)}
        onConfirm={() => bindUser()}
        onClose={() => setBindShow(false)}
      >
        <View style={{ backgroundColor: "#fff" }}>
          <View style={{ textAlign: "center", padding: "8rpx" }}>绑定账号</View>
          <OsInput
            type="bankcard"
            placeholder="用户名"
            value={username}
            onChange={(v) => {
              setUsername(v);
            }}
            customStyle={{ marginTop: "20px" }}
          ></OsInput>
          <OsInput
            type="bankcard"
            placeholder="密码"
            value={password}
            onChange={(v) => {
              setPassword(v);
            }}
            customStyle={{ marginTop: "20px" }}
          ></OsInput>
        </View>
      </OsModal>
    </>
  );
};

export default login;
