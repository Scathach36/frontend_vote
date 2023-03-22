import { View } from "@tarojs/components";
import Taro, { useRouter } from "@tarojs/taro";
import moment from "moment";
import {
  OsButton,
  OsCheckbox,
  OsCheckboxOption,
  OsDatePicker,
  OsIcon,
  OsInput,
  OsList,
  OsModal,
  OsPicker,
  OsRadio,
  OsRadioOption,
  OsSwitch,
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
  const [showBase, setShowBase] = useState<boolean>(false);
  const [canEdit, setCanEdit] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [optionsArr, setOptionsArr] = useState<any[]>([""]);
  const [dateComplete, setDateComplete] = useState<string>(
    moment().add(5, "minutes").format("YYYY-MM-DD HH:mm")
  );
  const [multi, setMulti] = useState<boolean>(false);
  const [anonymous, setAnonymous] = useState<boolean>(false);
  const [range, setRange] = useState<string[]>([]);
  const [vNormal, setVNormal] = useState<any>(0);
  const [classNumber, setClassNumber] = useState<string>("");
  const [modalTitle, setModalTitle] = useState<string>("");
  const [modalContent, setModalContent] = useState<string>("");
  const router = useRouter();
  const data = Taro.getStorageSync("data");
  const id = router.params.id; //投票id

  useEffect(() => {
    const role = data.role;
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
    if (role == 2) {
      Taro.request({
        url: "http://localhost:8080/class/getClass",
        method: "GET",
      }).then((res) => {
        setRange(res.data.data.classNumber);
      });
    } else {
      Taro.request({
        url: "http://localhost:8080/class/findClass",
        method: "POST",
        data: { number: data.number },
      }).then((res) => {
        setRange(res.data.data.classNumber);
      });
    }
  }, []);

  //   判断选项是否禁用
  useEffect(() => {
    if (detail) {
      const nowTime = new Date().valueOf();
      const endTime = new Date(detail.endTime).valueOf();

      setTitle(detail.title);
      setDescription(detail.description);
      setAnonymous(detail.anonymous == 1 ? true : false);
      setMulti(detail.multi == 1 ? true : false);
      setDateComplete(moment(detail.endTime).format("YYYY-MM-DD HH:mm"));

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

  useEffect(() => {
    setClassNumber(range[vNormal]);
  }, [range, vNormal]);

  useEffect(() => {
    setOptionsArr(options);
  }, [options]);

  useEffect(() => {
    if (canEdit) {
      const list = [...range];
      const index = list.findIndex((item) => {
        return item == detail.classNumber;
      });
      setVNormal(index);
    }
  }, [canEdit]);

  //   添加选项
  const addOption = () => {
    setOptionsArr([...optionsArr, { voteId: detail.id, description: "" }]);
  };

  //   删除选项
  const deleteOption = (index) => {
    let options = [...optionsArr];
    options.splice(index, 1);
    setOptionsArr(options);
  };

  //   选项变更
  const onChangeOptions = (index, value) => {
    let options = optionsArr;
    options[index].description = value;
    setOptionsArr(options);
  };

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

  //   投票和选项修改
  const updateVoteAndOptions = () => {
    const options = optionsArr;

    if (!title) {
      setShowBase(false);
      setText("请输入标题！");
      setShow(true);
      return;
    }
    if (options.length < 2) {
      setShowBase(false);
      setText("至少要有2个选项！");
      setShow(true);
      return;
    } else {
      options.forEach((item) => {
        if (!item.description) {
          setShowBase(false);
          setText("选项内容不能为空！");
          setShow(true);
          return;
        }
      });
    }

    const voteData = {
      id: detail.id,
      title,
      description,
      multi: multi ? 1 : 0,
      anonymous: anonymous ? 1 : 0,
      endTime: dateComplete + ":00",
      createBy: detail.createBy,
      classNumber,
    };
    Taro.request({
      url: "http://localhost:8080/vote/saveVote",
      method: "POST",
      data: voteData,
      success: (res) => {
        if (res.statusCode == 200) {
          Taro.request({
            url: "http://localhost:8080/vote/updateOptions",
            method: "POST",
            data: options,
            success: (res) => {
              if (res.statusCode == 200) {
                setShowBase(false);
                setText("投票信息修改成功！");
                setShow(true);
              }
            },
          });
        }
      },
    });
  };

  const modalConfirm = () => {
    if (canEdit) {
      updateVoteAndOptions();
    } else {
      deleteVote();
    }
  };

  return (
    <>
      {canEdit ? (
        <>
          <OsInput
            placeholder="投票标题"
            placeholderStyle="color: #7f7f7f; font-size: 22px; font-weight: 600"
            value={title}
            onChange={(v) => {
              setTitle(v);
            }}
          ></OsInput>
          <OsInput
            type="textarea"
            placeholder="补充描述（选填）"
            placeholderStyle="color: #7f7f7f;"
            value={description}
            onChange={(v) => {
              setDescription(v);
            }}
          ></OsInput>

          {optionsArr.map((item, index) => {
            return (
              <>
                <view className="option">
                  <OsIcon
                    type="close-native"
                    customStyle={{ background: "#FF5252", borderRadius: "50%" }}
                    size={32}
                    className="icon_Delete"
                    onClick={() => {
                      deleteOption(index);
                    }}
                  ></OsIcon>
                  <OsInput
                    label="   "
                    placeholder="选项"
                    disabledClear={true}
                    value={item.description}
                    onChange={(value) => {
                      onChangeOptions(index, value);
                    }}
                  ></OsInput>
                </view>
              </>
            );
          })}

          <view className="container_AddOption">
            <OsList
              type="custom"
              desc="添加选项"
              descColor="#FF5252"
              onClick={addOption}
            >
              <OsIcon
                type="add"
                size={22}
                color="#FF5252"
                customStyle={{ marginRight: "10px" }}
              ></OsIcon>
            </OsList>
          </view>

          <view>
            <OsDatePicker
              type="complete"
              value={dateComplete}
              start={moment().format("YYYY-MM-DD")}
              onConfirm={(e) => {
                setDateComplete(e.detail.value);
              }}
            >
              <OsList title="截止日期" desc={dateComplete}></OsList>
            </OsDatePicker>
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
            <OsList title="多选投票">
              <OsSwitch checked={multi} onChange={setMulti}></OsSwitch>
            </OsList>
            <OsList title="匿名投票">
              <OsSwitch checked={anonymous} onChange={setAnonymous}></OsSwitch>
            </OsList>
            <OsList title="编辑">
              <OsSwitch checked={canEdit} onChange={setCanEdit}></OsSwitch>
            </OsList>
          </view>

          <OsButton
            type="primary"
            size="large"
            shape="square"
            onClick={() => {
              setModalTitle("修改投票");
              setModalContent("确定要修改投票吗？");
              setShowBase(true);
            }}
            customStyle={{ margin: "20px auto" }}
          >
            完成
          </OsButton>

          <OsToast
            isShow={show}
            text={text}
            onClose={() => {
              setShow(false);
            }}
          ></OsToast>
        </>
      ) : (
        <View>
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

          {data.role != 0 && (
            <>
              <OsList title="编辑" type="custom">
                <OsSwitch checked={canEdit} onChange={setCanEdit}></OsSwitch>
              </OsList>
            </>
          )}

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
                onClick={() => {
                  setModalTitle("删除投票");
                  setModalContent("确定要删除该投票吗？");
                  setShowBase(true);
                }}
              >
                删除投票
              </OsButton>
            </View>
          )}
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
        title={modalTitle}
        cancelText="取消"
        confirmText="确定"
        content={modalContent}
        isShow={showBase}
        onCancel={() => setShowBase(false)}
        onClose={() => setShowBase(false)}
        onConfirm={() => modalConfirm()}
      ></OsModal>
    </>
  );
};

export default VoteDetail;
