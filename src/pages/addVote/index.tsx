import { OsButton, OsIcon, OsInput, OsList, OsPicker } from "ossaui";
import { useState } from "react";
import "./index.scss";

const AddVote = () => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [optionsArr, setOptionsArr] = useState<string[]>([""]);
  //   添加选项
  const addOption = () => {
    setOptionsArr([...optionsArr, ""]);
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
        <OsButton
          type="default"
          color="#FF5252"
          bgColor="#fff"
          icon="add"
          size="block"
          onClick={addOption}
        >
          添加选项
        </OsButton>
      </view>
      <OsButton type="primary" size="block" onClick={addVote}>
        完成
      </OsButton>
    </>
  );
};

export default AddVote;
