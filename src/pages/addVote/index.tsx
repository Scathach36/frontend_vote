import { OsButton, OsDatePicker, OsIcon, OsInput, OsList, OsPicker } from "ossaui";
import { useState } from "react";
import "./index.scss";
import moment from "moment";

const AddVote = () => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [optionsArr, setOptionsArr] = useState<string[]>([""]);
  const [dateComplete, setDateComplete] = useState(moment());

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
