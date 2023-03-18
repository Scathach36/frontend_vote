import { View } from "@tarojs/components";
import Taro, { usePullDownRefresh } from "@tarojs/taro";
import { OsIcon, OsList, OsSearch, OsTag } from "ossaui";
import { useEffect, useState } from "react";
import "./index.scss";

const index = () => {
  const [role, setRole] = useState<string>("");
  const [voteList, setVoteList] = useState<any[]>([]);
  const [sortedVoteList, setSortedVoteList] = useState<any[]>([]);

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

  // 首次进入、刷新触发
  useEffect(() => {
    initVoteList();
  }, []);

  // voteList数组监控
  useEffect(() => {
    const sortedList = voteList.sort((a, b) => {
      return b.endTime < a.endTime ? -1 : 1;
    });
    setSortedVoteList(sortedList);
  }, [voteList]);

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
    console.log("changed!");
    if (time !== null) {
      clearTimeout(time);
    }
    time = setTimeout(() => {
      Taro.request({
        url: "http://localhost:8080/vote/findAllByTitle",
        method: "POST",
        data: { title: value },
        success: (res) => {
          if (res.data.list) {
            setVoteList(res.data.list);
          }
        },
      });
    }, 800);
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
          <View onClick={addVote} className="btn_Add">
            <OsIcon type="add" size={36} color="#fff"></OsIcon>
          </View>
        </>
      )}
      {sortedVoteList.length > 0
        ? sortedVoteList.map((item, index) => {
            const nowTime = new Date().valueOf();
            const endTime = new Date(item.endTime).valueOf();
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
          })
        : null}
    </>
  );
};

export default index;
