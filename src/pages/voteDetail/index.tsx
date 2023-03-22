import { View } from "@tarojs/components";
import Taro, { useRouter } from "@tarojs/taro";
import {
  OsButton,
  OsCheckbox,
  OsCheckboxOption,
  OsList,
  OsModal,
  OsRadio,
  OsRadioOption,
  OsTag,
  OsToast,
} from "ossaui";
import { useEffect, useState } from "react";
import "./index.scss";

const VoteDetail = () => {
  const [detail, setDetail] = useState<any>();
  const [options, setOptions] = useState<any[]>([]);
  const [radioValue, setRadioValue] = useState<number>(0);
  const [checkBoxValue, setCheckBoxValue] = useState<number[]>([]);
  const [disable, setDisable] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(false);
  const [text, setText] = useState<string>("");
  const [showBase, setShowBase] = useState(false);
  const router = useRouter();
  const data = Taro.getStorageSync("data");
  const id = router.params.id; //投票id

  useEffect(() => {
    Taro.request({
      url: "http://localhost:8080/vote/findById",
      method: "POST",
      data: { id: id },
      success: (res) => {
        setDetail(res.data.vote);
      },
    });

    Taro.request({
      url: "http://localhost:8080/vote/findOptionsByVoteId",
      method: "POST",
      data: { voteId: id },
      success: (res) => {
        setOptions(res.data.list);
      },
    });
  }, []);

  //   判断选项是否禁用
  useEffect(() => {
    if (detail) {
      //   console.log(detail);
      const nowTime = new Date().valueOf();
      const endTime = new Date(detail.endTime).valueOf();

      // 判断时间是否过期
      if (nowTime >= endTime) {
        setDisable(true);
        return;
      }
      // 判断自己是否为创建者
      if (detail.createBy == data.name) {
        setDisable(true);
        return;
      }
      // 判断是否已经投过
      Taro.request({
        url: "http://localhost:8080/vote/existsByUserId",
        method: "POST",
        data: { userId: data.id, voteId: id },
        success: (res) => {
          setDisable(res.data.exist);

          if (res.data.exist) {
            const list = res.data.list;

            // 单选情况
            if (detail.multi == 0) {
              options.forEach((item, index) => {
                if (item.id == list[0].optionId) {
                  setRadioValue(index);
                }
              });
            }
            // 多选情况
            if (detail.multi == 1) {
              let checkList: number[] = [];
              list.forEach((listItem) => {
                options.forEach((item, index) => {
                  if (item.id == listItem.optionId) {
                    checkList.push(index);
                  }
                });
              });
              setCheckBoxValue(checkList);
            }
          }
        },
      });
    }
  }, [detail]);

  //   添加tickets
  const addTickets = () => {
    let saveList: any[] = [];

    // 单选情况
    if (detail.multi == 0) {
      const index: number = radioValue;
      saveList.push({
        voteId: id,
        optionId: options[index].id,
        userId: data.id,
        username: data.name,
      });
    }

    // 多选情况
    if (detail.multi == 1) {
      checkBoxValue.forEach((item) => {
        saveList.push({
          voteId: id,
          optionId: options[item].id,
          userId: data.id,
          username: data.name,
        });
      });
    }

    if (saveList.length == 0) {
      setText("请至少选择一个选项！");
      setShow(true);
      return;
    } else if (saveList[0].length == 0) {
      setText("请至少选择一个选项！");
      setShow(true);
      return;
    }

    Taro.request({
      url: "http://localhost:8080/vote/saveAllTickets",
      method: "POST",
      data: saveList,
      success: (res) => {
        if (res.statusCode == 200) {
          setText("投票成功！1s后返回页面");
          setShow(true);
          setTimeout(() => {
            Taro.navigateBack();
          }, 1000);
        } else {
          setText(res.errMsg);
          setShow(true);
        }
      },
    });
  };

  //   删除投票
  const deleteVote = () => {
    Taro.request({
      url: "http://localhost:8080/vote/deleteVoteById",
      method: "POST",
      data: [{ id: detail.id }],
      success: (res) => {
        if (res) {
          setText(res.data.msg);
          setShowBase(false);
          setShow(true);
          setTimeout(() => {
            Taro.navigateBack();
          }, 800);
        }
      },
      fail: (res) => {
        console.log(res);
      },
    });
  };

  return (
    <>
      {detail ? (
        <View>
          <OsList
            title={detail.title}
            desc={
              (detail.multi == 0 ? "单选" : "多选") +
              (detail.anonymous == 0 ? "" : "  匿名投票")
            }
          >
            {disable ? (
              <OsTag type="primary" color="#66CC66">
                已参与
              </OsTag>
            ) : (
              <OsTag type="primary" color="error">
                未参与
              </OsTag>
            )}
          </OsList>
          {detail.description ? (
            <OsList title="补充描述" subTitle={detail.description}></OsList>
          ) : null}
        </View>
      ) : null}

      {/* 投票选项部分 */}
      {options.length > 0 ? (
        <>
          <View style={{ marginTop: "15px", backgroundColor: "#fff" }}>
            {detail.multi == 0 ? (
              <>
                {options.length > 0 ? (
                  <OsRadio customStyle={{ paddingLeft: "10px" }}>
                    {options.map((item, index) => {
                      return (
                        <OsRadioOption
                          value={radioValue}
                          optionValue={index}
                          onClick={setRadioValue}
                          readonly={disable}
                        >
                          {item.description}
                        </OsRadioOption>
                      );
                    })}
                  </OsRadio>
                ) : null}
              </>
            ) : (
              <>
                {options.length > 0 ? (
                  <OsCheckbox customStyle={{ paddingLeft: "10px" }}>
                    {options.map((item, index) => {
                      return (
                        <OsCheckboxOption
                          value={checkBoxValue}
                          optionValue={index}
                          onClick={setCheckBoxValue}
                        >
                          {item.description}
                        </OsCheckboxOption>
                      );
                    })}
                  </OsCheckbox>
                ) : null}
              </>
            )}
          </View>
        </>
      ) : null}

      {/* 截止时间、创建人信息 */}
      {detail ? (
        <View style={{ marginTop: "15px" }}>
          <OsList title="发起人" desc={detail.createBy}></OsList>
          <OsList title="截止时间" desc={detail.endTime}></OsList>
        </View>
      ) : null}

      <OsButton
        type="primary"
        size="large"
        shape="square"
        customStyle={{ margin: "20px auto" }}
        disabled={disable}
        onClick={addTickets}
      >
        完成投票
      </OsButton>

      {data.role != 0 && (
        <View
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <OsButton
            type="default"
            size="large"
            color="#DD1A21"
            bgColor="#FFF"
            onClick={() => setShowBase(true)}
          >
            删除投票
          </OsButton>
        </View>
      )}

      <OsToast
        isShow={show}
        text={text}
        onClose={() => {
          setShow(false);
        }}
      ></OsToast>

      <OsModal
        title="删除投票"
        cancelText="取消"
        confirmText="确定"
        content="确定要删除该投票吗？"
        isShow={showBase}
        onCancel={() => setShowBase(false)}
        onClose={() => setShowBase(false)}
        onConfirm={() => deleteVote()}
      ></OsModal>
    </>
  );
};

export default VoteDetail;
