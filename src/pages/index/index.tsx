import { View } from "@tarojs/components";
import Taro, { usePullDownRefresh } from "@tarojs/taro";
import {
  OsCheckbox,
  OsCheckboxOption,
  OsIcon,
  OsInput,
  OsList,
  OsModal,
  OsPicker,
  OsSearch,
  OsSwitch,
  OsTag,
  OsToast,
} from "ossaui";
import { useEffect, useState } from "react";
import "./index.scss";

const index = () => {
  const [role, setRole] = useState<string>("");
  const [voteList, setVoteList] = useState<any[]>([]);
  const [sortedVoteList, setSortedVoteList] = useState<any[]>([]);
  const [showList, setShowList] = useState<any[]>([]);
  const [canDelete, setCanDelete] = useState<boolean>(false);
  const [checkBoxValue, setCheckBoxValue] = useState<number[]>([]);
  const [showBase, setShowBase] = useState<boolean>(false);
  const [newUser, setNewUser] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(false);
  const [text, setText] = useState<string>("");
  const [range, setRange] = useState<string[]>([]);
  const [vNormal, setVNormal] = useState<any>(0);
  const [classNumber, setClassNumber] = useState<string>("");
  const [studentNumber, setStudentNumber] = useState<string>("");
  const [name, setName] = useState<string>("");

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

  // 数组初始化
  const initVoteList = () => {
    const data = Taro.getStorageSync("data");
    const role = data.role;
    setRole(data.role);
    const classNumber = data.classNumber;
    // 学生获取投票列表
    if (role == 0) {
      Taro.request({
        url: "http://localhost:8080/vote/findAllByClassNumber",
        method: "POST",
        data: { classNumber },
        success: (res) => {
          if (res.data.list) {
            setVoteList(res.data.list);
          }
        },
      });
    }
    // 教师获取投票列表
    if (role == 1) {
      Taro.request({
        url: "http://localhost:8080/vote/findAllByCreate",
        method: "POST",
        data: { createBy: data.name },
        success: (res) => {
          if (res.data.list) {
            setVoteList(res.data.list);
          }
        },
      });
    }
    // 管理员获取投票列表
    if (role == 2) {
      Taro.request({
        url: "http://localhost:8080/vote/getVote",
        method: "GET",
        success: (res) => {
          if (res.data) {
            setVoteList(res.data);
          }
        },
      });
    }
  };

  usePullDownRefresh(() => {
    initVoteList();
  });

  useEffect(() => {
    setClassNumber(range[vNormal]);
  }, [range]);

  // 首次进入、刷新触发
  useEffect(() => {
    initVoteList();
    Taro.request({
      url: "http://localhost:8080/class/getClass",
      method: "GET",
    }).then((res) => {
      setRange(res.data.data.classNumber);
    });
  }, []);

  // voteList数组监控
  useEffect(() => {
    const sortedList = voteList.sort((a, b) => {
      return b.endTime < a.endTime ? -1 : 1;
    });
    setSortedVoteList(sortedList);
    setShowList(sortedList);
  }, [voteList]);

  // 判断是否为新注册的微信用户
  useEffect(() => {
    const isNew = Taro.getStorageSync("new");
    if (isNew) {
      setNewUser(true);
    }
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

  //添加新投票
  const addVote = () => {
    Taro.navigateTo({ url: "/pages/addVote/index" });
  };

  // 跳转投票详情页面
  const goToDetail = (index) => {
    Taro.navigateTo({
      url: "/pages/voteDetail/index?id=" + sortedVoteList[index].id,
    });
  };

  // 标题查询
  let time: any = null;
  const searchByTiele = (e, value) => {
    const reg = new RegExp(value);
    let newList: any[] = [];
    if (time !== null) {
      clearTimeout(time);
    }
    time = setTimeout(() => {
      sortedVoteList.forEach((item) => {
        if (reg.test(item.title)) {
          newList.push(item);
        }
      });
      setShowList(newList);
    }, 800);
  };

  // 投票批量删除
  const deleteVotes = () => {
    console.log("checkBoxValue", checkBoxValue);
    Taro.request({
      url: "http://localhost:8080/vote/deleteAllByIds",
      method: "POST",
      data: { ids: checkBoxValue },
      success: (res) => {
        if (res.statusCode == 200) {
          setShowBase(false);
          setText(res.data.msg);
          setShow(true);
        }
      },
    });
  };

  return (
    <>
      <OsSearch
        placeholder="投票标题搜索"
        onChange={(e, value) => {
          searchByTiele(e, value);
        }}
      ></OsSearch>
      {role !== "0" && (
        <>
          {canDelete ? (
            <View onClick={() => setShowBase(true)} className="btn_Delete">
              √
            </View>
          ) : (
            <View onClick={addVote} className="btn_Add">
              <OsIcon type="add" size={36} color="#fff"></OsIcon>
            </View>
          )}
          <OsList title="批量删除" customStyle={{ marginBottom: "10px" }}>
            <OsSwitch checked={canDelete} onChange={setCanDelete}></OsSwitch>
          </OsList>
          <OsList title="模板"></OsList>
        </>
      )}
      <OsCheckbox>
        {" "}
        {showList.length > 0
          ? showList.map((item, index) => {
              const nowTime = new Date().valueOf();
              const endTime = new Date(item.endTime).valueOf();
              if (!canDelete) {
                return (
                  <>
                    <OsList
                      title={item.title}
                      subTitle={
                        item.description.length > 18
                          ? item.description.substring(0, 17) + "..."
                          : item.description
                      }
                      type="custom"
                      rightIcon="arrows"
                      onClick={() => {
                        goToDetail(index);
                      }}
                    >
                      {nowTime >= endTime ? (
                        <OsTag type="primary" color="error">
                          已截止
                        </OsTag>
                      ) : (
                        <OsTag type="primary" color="#66CC66">
                          进行中
                        </OsTag>
                      )}
                    </OsList>
                  </>
                );
              } else {
                return (
                  <OsCheckboxOption
                    value={checkBoxValue}
                    optionValue={item.id}
                    onClick={setCheckBoxValue}
                    customStyle={{
                      backgroundColor: "#fff",
                      paddingLeft: "6px",
                    }}
                  >
                    {item.title}
                  </OsCheckboxOption>
                );
              }
            })
          : null}
      </OsCheckbox>

      <OsModal
        title="确认删除"
        cancelText="取消"
        confirmText="确定"
        content={"确定要删除 " + checkBoxValue.length + " 个投票吗？"}
        isShow={showBase}
        onCancel={() => setShowBase(false)}
        onClose={() => setShowBase(false)}
        onConfirm={() => deleteVotes()}
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

export default index;
