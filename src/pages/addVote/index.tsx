import {
  OsButton,
  OsDatePicker,
  OsIcon,
  OsInput,
  OsList,
  OsPicker,
  OsSwitch,
  OsToast,
} from "ossaui";
import { useEffect, useState } from "react";
import "./index.scss";
import moment from "moment";
import Taro from "@tarojs/taro";

const AddVote = () => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [optionsArr, setOptionsArr] = useState<string[]>([""]);
  const [dateComplete, setDateComplete] = useState<string>(
    moment().add(5, "minutes").format("YYYY-MM-DD HH:mm")
  );
  const [multi, setMulti] = useState<boolean>(false);
  const [anonymous, setAnonymous] = useState<boolean>(false);
  const [range, setRange] = useState<string[]>([]);
  const [vNormal, setVNormal] = useState<any>(0);
  const [classNumber, setClassNumber] = useState<string>("");
  const [show, setShow] = useState<boolean>(false);
  const [text, setText] = useState<string>("");

  useEffect(() => {
    const data = Taro.getStorageSync("data");
    const role = data.role;
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

  useEffect(() => {
    setClassNumber(range[vNormal]);
  }, [range, vNormal]);

  //   添加选项
  const addOption = () => {
    setOptionsArr([...optionsArr, ""]);
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
    options[index] = value;
    setOptionsArr(options);
  };

  //   添加投票
  const addVote = () => {
    // 内容校验
    if (title.length == 0) {
      setShow(true);
      setText("未输入标题！");
      return;
    }
    if (optionsArr.length == 0) {
      setShow(true);
      setText("至少要有一个选项！");
      return;
    }
    optionsArr.forEach((item) => {
      if (item.length == 0) {
        setShow(true);
        setText("选项不能为空！");
        return;
      }
    });
    if (classNumber.length == 0) {
      setShow(true);
      setText("未选择班级！");
      return;
    }

    const dataVote = {
      title,
      description,
      multi: multi ? 1 : 0,
      anonymous: anonymous ? 1 : 0,
      createBy: Taro.getStorageSync("data").name,
      endTime: dateComplete + ":00",
      classNumber,
    };
    Taro.request({
      url: "http://localhost:8080/vote/saveVote",
      method: "POST",
      data: dataVote,
    }).then((res) => {
      const dataOptions: any[] = [];
      optionsArr.forEach((item) => {
        const option = {
          voteId: res.data.id,
          description: item,
        };
        dataOptions.push(option);
      });
      Taro.request({
        url: "http://localhost:8080/vote/saveAllOptions",
        method: "POST",
        data: dataOptions,
      }).then((res) => {
        if (res.data.code == 200) {
          setShow(true);
          setText("创建新投票成功! 1秒后返回页面");
          setTimeout(() => {
            Taro.navigateBack();
          }, 1000);
        }
      });
    });
  };

  return (
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
                value={item}
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
      </view>

      <OsButton
        type="primary"
        size="large"
        shape="square"
        onClick={addVote}
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
  );
};

export default AddVote;
