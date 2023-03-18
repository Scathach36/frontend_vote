import { View } from "@tarojs/components";
import Taro, { useRouter } from "@tarojs/taro";
import {
    OsButton,
  OsCheckbox,
  OsCheckboxOption,
  OsList,
  OsRadio,
  OsRadioOption,
} from "ossaui";
import { useEffect, useState } from "react";
import "./index.scss";

const VoteDetail = () => {
  const [detail, setDetail] = useState<any>();
  const [options, setOptions] = useState<any[]>([]);
  const [radioValue, setRadioValue] = useState<string>("");
  const [checkBoxValue, setCheckBoxValue] = useState<any[]>([]);
  const [disable, setDisable] = useState<boolean>(false);
  const router = useRouter();
  const id = router.params.id;

  useEffect(() => {
    Taro.request({
      url: "http://localhost:8080/vote/findById",
      method: "POST",
      data: { id: id },
      success: (res) => {
        console.log("detail", res.data.vote);
        setDetail(res.data.vote);
      },
    });

    Taro.request({
      url: "http://localhost:8080/vote/findOptionsByVoteId",
      method: "POST",
      data: { voteId: id },
      success: (res) => {
        console.log("options", res.data.list);
        setOptions(res.data.list);
      },
    });
  }, []);

  //   判断选项是否禁用
  useEffect(() => {
    if (detail) {
      const nowTime = new Date().valueOf();
      const endTime = new Date(detail.endTime).valueOf();
      setDisable(nowTime >= endTime ? true : false);
    }
  }, [detail]);

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
          ></OsList>
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
                          disabled={disable}
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
                          disabled={disable}
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
      >
        完成投票
      </OsButton>
    </>
  );
};

export default VoteDetail;
