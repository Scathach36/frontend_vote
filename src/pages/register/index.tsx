import Taro from "@tarojs/taro";
import { OsButton, OsInput, OsToast } from "ossaui";
import { useState } from "react";

const register = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [classNumber, setClassNumber] = useState<string>("");
  const [number, setNumber] = useState<string>("");
  const [toastText, setToastText] = useState<string>("");
  const [isShow, setIsShow] = useState<boolean>(false);
  const [usernameChecked, setUsernameChecked] = useState<boolean>(false);
  const [numberChecked, setNumberChecked] = useState<boolean>(false);

  const data = {
    username,
    password,
    name,
    classNumber,
    number,
    role: "0",
  };

  // 校验用户名是否已经被注册
  const existsByUsername = () => {
    Taro.request({
      url: "http://localhost:8080/user/existsByUsername",
      method: "POST",
      data: { username },
    }).then((res) => {
      if (res.data) {
        setToastText("该用户名已被注册！");
        setIsShow(true);
        setUsernameChecked(false);
      }else {
        setUsernameChecked(true);
      };
    });
  };

  // 校验学号是否已经被注册
  const existsByNumber = () => {
    Taro.request({
      url: "http://localhost:8080/user/existsByNumber",
      method: "POST",
      data: { number },
    }).then((res) => {
      if (res.data) {
        setToastText("该学号已被注册！");
        setIsShow(true);
        setNumberChecked(false);
      } else {
        setNumberChecked(true);
      }
    });
  };

  // 用户名校验
  const checkUsername = () => {
    if (username.length > 15 || username.length < 6) {
      setToastText("用户名长度为6-15个字符！");
      setIsShow(true);
      setUsernameChecked(false);
      return;
    } else if (username.length == 0) {
      setToastText("用户名未输入！");
      setIsShow(true);
      setUsernameChecked(false);
      return;
    } else {
      existsByUsername();
    }
  };

  // 密码校验
  const checkPassword = () => {
    if (password.length > 15 || password.length < 6) {
      setToastText("密码长度为6-15个字符！");
      setIsShow(true);
      return false;
    } else if (password.length == 0) {
      setToastText("密码未输入！");
      setIsShow(true);
      return false;
    }
    return true;
  };

  // 姓名校验
  const checkName = () => {
    if (name.length > 15) {
      setToastText("请输入正确的姓名！");
      setIsShow(true);
      return false;
    } else if (name.length == 0) {
      setToastText("姓名未输入！");
      setIsShow(true);
      return false;
    }
    return true;
  };

  // 学号校验
  const checkNumber = () => {
    if (number.length > 15) {
      setToastText("请输入正确的学号！");
      setIsShow(true);
      setNumberChecked(false);
      return;
    } else if (number.length == 0) {
      setToastText("学号未输入！");
      setIsShow(true);
      setNumberChecked(false);
      return;
    } else {
      existsByNumber();
    }
  };

  // 班级校验
  const checkClassNumber = () => {
    if (classNumber.length > 15) {
      setToastText("请输入正确的班级！");
      setIsShow(true);
      return false;
    } else if (classNumber.length == 0) {
      setToastText("班级未输入！");
      setIsShow(true);
      return false;
    }
    return true;
  };

  const goToRegister = () => {
    if (
      usernameChecked &&
      numberChecked &&
      checkClassNumber() &&
      checkPassword() &&
      checkName()
    ) {
      Taro.request({
        url: "http://localhost:8080/user/save",
        method: "POST",
        data,
      }).then((res) => {
        if (res) {
          setToastText("注册成功，即将返回登录界面！");
          setIsShow(true);
          setTimeout(() => {
            Taro.redirectTo({ url: "/pages/login/index" });
          }, 2000);
        }
      });
    } else {
      setToastText("该用户已存在或信息填写不全！");
      setIsShow(true);
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
        onBlur={checkUsername}
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
        onBlur={checkPassword}
        maxLength={5}
        customStyle={{ marginTop: "20px" }}
      ></OsInput>
      <OsInput
        label="姓名"
        placeholder="请输入姓名"
        value={name.trim()}
        onChange={(v) => {
          setName(v.trim());
        }}
        onBlur={checkName}
        maxLength={15}
        customStyle={{ marginTop: "20px" }}
      ></OsInput>
      <OsInput
        label="学号"
        placeholder="请输入学号"
        value={number.trim()}
        onChange={(v) => {
          setNumber(v.trim());
        }}
        onBlur={checkNumber}
        maxLength={15}
        customStyle={{ marginTop: "20px" }}
      ></OsInput>
      <OsInput
        label="班级"
        placeholder="请输入班级"
        value={classNumber.trim()}
        onChange={(v) => {
          setClassNumber(v.trim());
        }}
        onBlur={checkClassNumber}
        maxLength={15}
        customStyle={{ marginTop: "20px" }}
      ></OsInput>

      <OsButton
        type="primary"
        size="block"
        onClick={goToRegister}
        customStyle={{ marginTop: "20px" }}
      >
        注册
      </OsButton>

      <OsToast text={toastText} isShow={isShow} onClose={toastClose}></OsToast>
    </>
  );
};

export default register;
