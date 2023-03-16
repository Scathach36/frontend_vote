import {
  OsButton,
  OsDatePicker,
  OsIcon,
  OsInput,
  OsList,
  OsPicker,
  OsSwitch,
} from "ossaui";
import { useState } from "react";
import "./index.scss";
import moment from "moment";

const AddVote = () => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [optionsArr, setOptionsArr] = useState<string[]>([""]);
  const [dateComplete, setDateComplete] = useState<string>(
    moment().format("YYYY-MM-DD HH:mm")
  );
  const [multi, setMulti] = useState<boolean>(false);
  const [anonymous, setAnonymous] = useState<boolean>(false);
  const [range, setRange] = useState<string[]>([]);
  const [vNormal, setVNormal] = useState(0);
  const [classNumber, setClassNumber] = useState<string>("");

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
    console.log(optionsArr);
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
          onConfirm={() => setClassNumber(range[vNormal])}
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
    </>
  );
};

export default AddVote;
