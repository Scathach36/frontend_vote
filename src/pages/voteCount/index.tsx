import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { OsList, OsSearch, OsTag } from "ossaui";
import { useEffect, useState } from "react";

const VoteCount = () => {
  const [voteList, setVoteList] = useState<any[]>([]);
  const [sortedVoteList, setSortedVoteList] = useState<any[]>([]);
  const [showList, setShowList] = useState<any[]>([]);
  const data = Taro.getStorageSync("data");

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

  // voteList数组监控
  useEffect(() => {
    const sortedList = voteList.sort((a, b) => {
      return b.endTime < a.endTime ? -1 : 1;
    });
    setSortedVoteList(sortedList);
    setShowList(sortedList);
  }, [voteList]);

  useEffect(() => {
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
  }, []);

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

  return (
    <View>
      <OsSearch
        placeholder="投票标题搜索"
        onChange={(e, value) => {
          searchByTiele(e, value);
        }}
      ></OsSearch>
      {showList.length > 0
        ? showList.map((item, index) => {
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
                    // goToDetail(index);
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
    </View>
  );
};

export default VoteCount;
