import Taro from "@tarojs/taro";
import { OsButton, OsList, OsTag } from "ossaui";
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

  // 首次进入、刷新触发
  useEffect(() => {
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
  }, []);

  // voteList数组监控
  useEffect(() => {
    const sortedList = voteList.sort((a, b) => {
      return b.endTime > a.endTime ? -1 : 1;
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

  return (
    <>
      {role !== "0" && (
        <OsButton type="primary" size="block" icon="add" onClick={addVote}>
          创建投票
        </OsButton>
      )}
      {sortedVoteList.map((item, index) => {
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
      })}
    </>
  );
};

export default index;
