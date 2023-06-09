import React, { useEffect, useState } from "react";
import Taro, { useRouter } from "@tarojs/taro";
import { View } from "@tarojs/components";
//@ts-ignore
import * as echarts from "../../components/ec-canvas/echarts";
import "./index.scss";
import { OsList, OsToast } from "ossaui";

const initChart = (canvas, width, height) => {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height,
  });
  canvas.setChart(chart);
  return chart;
};

const Echarts = () => {
  const router = useRouter();
  const [options, setOptions] = useState<any[]>([]);
  const [detail, setDetail] = useState<any>();
  const [histogramX, setHistogramX] = useState<string[]>([]);
  const [histogramData, setHistogramData] = useState<number[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [tickets, setTickets] = useState<any[]>([]);
  const [voterList, setVoterList] = useState<any[]>([]);

  const id = router.params.id;

  // 柱状图初始化
  const initHistogram = (canvas, width, height) => {
    const chart = initChart(canvas, width, height);
    const option = {
      xAxis: {
        data: histogramX,
      },
      yAxis: {},
      series: [
        {
          type: "bar",
          data: histogramData,
        },
      ],
    };
    chart.setOption(option);
    return chart;
  };
  const ecHistogram = {
    onInit: initHistogram,
  };

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
    Taro.request({
      url: "http://localhost:8080/vote/findTicketsByVoteId",
      method: "POST",
      data: { id: Number(id) },
      success: (res) => {
        setTickets(res.data.list);
      },
    });
  }, []);

  useEffect(() => {
    let hisData: number[] = [];
    let hisX: string[] = [];
    let totalTickets = 0;
    options.forEach((item) => {
      totalTickets += item.number;
      hisData.push(item.number);
      hisX.push(item.description);
    });

    setTotal(totalTickets);
    setHistogramData(hisData);
    setHistogramX(hisX);
  }, [options]);

  useEffect(() => {
    let voters: any[] = [];
    let votersArr: string[] = [];
    options.forEach((option, index) => {
      voters[index] = [];
      tickets.forEach((ticket) => {
        if (option.id == ticket.optionId) {
          voters[index].push(ticket.username);
        }
      });
    });

    voters.forEach((item, index) => {
      if (item.length == 0) {
        votersArr[index] = "无";
      } else {
        votersArr[index] = "";
        item.forEach((voter, voterIndex) => {
          voterIndex == 0
            ? (votersArr[index] += voter)
            : (votersArr[index] = votersArr[index] + " " + voter);
        });
      }
    });

    setVoterList(votersArr);
  }, [tickets, options]);

  return (
    <>
      {detail && (
        <>
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
          <OsList title={"总票数：" + total + "票"}></OsList>
        </>
      )}
      {options.length > 0 && (
        <>
          {options.map((item, index) => {
            return (
              <>
                {detail && detail.anonymous == 1 && (
                  <OsList
                    title={index + 1 + "." + item.description}
                    desc={"票数：" + item.number + "票"}
                  ></OsList>
                )}
                {detail && detail.anonymous == 0 && (
                  <>
                    <OsList
                      title={index + 1 + "." + item.description}
                      desc={"票数：" + item.number + "票"}
                      rightIcon="arrows"
                      subTitle={"参与者：" + voterList[index]}
                    ></OsList>
                  </>
                )}
              </>
            );
          })}
        </>
      )}
      <View className="echarts">
        {histogramData.length > 0 && histogramX.length > 0 && (
          <ec-canvas
            id="mychart-histogram-test"
            canvas-id="myHistogram"
            ec={ecHistogram}
          ></ec-canvas>
        )}
      </View>
    </>
  );
};

export default Echarts;
