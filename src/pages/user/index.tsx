import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { OsButton, OsInput, OsList, OsModal, OsPicker, OsToast } from "ossaui";
import { useEffect, useState } from "react";

const user = () => {
  const [showBase, setShowBase] = useState(false);
  const [range, setRange] = useState<string[]>([]);
  const [vNormal, setVNormal] = useState<any>(0);
  const [newUser, setNewUser] = useState<boolean>(false);
  const [classNumber, setClassNumber] = useState<string>("");
  const [studentNumber, setStudentNumber] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [show, setShow] = useState<boolean>(false);
  const [text, setText] = useState<string>("");

  const userInfo = Taro.getStorageSync("userInfo");
  const data = Taro.getStorageSync("data");

  useEffect(() => {
    setClassNumber(range[vNormal]);
  }, [range]);

  // 退出系统
  const quit = () => {
    setShowBase(false);
    Taro.clearStorageSync();
    Taro.redirectTo({ url: "/pages/login/index" });
  };

  // 首次进入、刷新触发
  useEffect(() => {
    Taro.request({
      url: "http://localhost:8080/class/getClass",
      method: "GET",
    }).then((res) => {
      setRange(res.data.data.classNumber);
    });
  }, []);

  // 绑定信息
  const bindUserInfo = () => {
    if (!studentNumber || !name) {
      setText("内容不能为空！");
      setShow(true);
    } else {
      const data = {
        id: Taro.getStorageSync("data").id,
        name,
        number: studentNumber,
        classNumber,
      };
      Taro.request({
        url: "http://localhost:8080/user/bindUser",
        method: "POST",
        data,
        success: (res) => {
          console.log(res);
          if (res.data.code == 200) {
            Taro.removeStorageSync("new");
            const data = Taro.getStorageSync("data");
            Taro.removeStorageSync("data");
            Taro.setStorageSync("data", {
              id: data.id,
              role: data.role,
              name,
              number: studentNumber,
              classNumber,
            });
            setText("用户信息绑定成功！");
            setShow(true);
            setNewUser(false);
          } else {
            setText(res.data.msg);
            setShow(true);
          }
        },
      });
    }
  };

  // 判断是否为新注册的微信用户
  useEffect(() => {
    const isNew = Taro.getStorageSync("new");
    if (isNew) {
      setNewUser(true);
    }
  }, []);

  return (
    <>
      <View>
        {/* 头像 */}
        <View style={{ display: "flex", justifyContent: "center" }}>
          {userInfo ? (
            userInfo.avatarUrl.length == 0 ? (
              <View style={{ position: "relative" }}>
                <image
                  style={{
                    width: "180rpx",
                    height: "180rpx",
                    borderRadius: "50%",
                    backgroundColor: "aqua",
                  }}
                ></image>
                <View
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    fontSize: "48rpx",
                    fontWeight: "800",
                  }}
                >
                  {userInfo.nickName[0]}
                </View>
              </View>
            ) : (
              <View>
                <image
                  src={userInfo.avatarUrl}
                  style={{
                    width: "180rpx",
                    height: "180rpx",
                    borderRadius: "50%",
                  }}
                ></image>
              </View>
            )
          ) : (
            <View style={{ display: "flex", justifyContent: "center" }}>
              <View style={{ position: "relative" }}>
                <image
                  style={{
                    width: "180rpx",
                    height: "180rpx",
                    borderRadius: "50%",
                    backgroundColor: "aqua",
                  }}
                ></image>
                <View
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    fontSize: "48rpx",
                    fontWeight: "800",
                  }}
                >
                  {Taro.getStorageSync("data").name[0]}
                </View>
              </View>
            </View>
          )}
        </View>

        {/* 用户名 */}
        <View
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "12rpx",
          }}
        >
          {userInfo.nickName || Taro.getStorageSync("data").name}
        </View>
      </View>
      {!data.name || !data.number ? (
        <OsButton
          customStyle={{ marginTop: "32rpx" }}
          type="primary"
          size="block"
          onClick={() => setNewUser(true)}
        >
          绑定信息
        </OsButton>
      ) : null}
      <OsButton
        customStyle={{ marginTop: "32rpx" }}
        type="primary"
        size="block"
        onClick={() => setShowBase(true)}
      >
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

      <OsToast
        isShow={show}
        text={text}
        onClose={() => setShow(false)}
      ></OsToast>

      <OsModal
        confirmText="确定"
        closeable={false}
        closeOnClickMask={true}
        isShow={newUser}
        onCancel={() => setNewUser(false)}
        onClose={() => setNewUser(false)}
        onConfirm={bindUserInfo}
        className="custom-demo"
      >
        <View>
          <OsList title="信息绑定"></OsList>
          <OsPicker
            range={range}
            value={vNormal}
            onConfirm={(index) => {
              setClassNumber(range[vNormal]);
              setVNormal(index);
            }}
          >
            <OsList title="班级" desc={range[vNormal]}></OsList>
          </OsPicker>
          <OsInput
            label="学号"
            placeholder="请输入学号"
            placeholderStyle="color: #7f7f7f;"
            value={studentNumber}
            onChange={(v) => {
              setStudentNumber(v);
            }}
          ></OsInput>
          <OsInput
            label="姓名"
            placeholder="请输入姓名"
            placeholderStyle="color: #7f7f7f;"
            value={name}
            onChange={(v) => {
              setName(v);
            }}
          ></OsInput>
        </View>
      </OsModal>
    </>
  );
};

export default user;
