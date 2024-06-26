

import ReactApexChart from "react-apexcharts";
import { Typography } from "antd";
import { MinusOutlined } from "@ant-design/icons";

function LineChart({labels,data}) {
  const { Title, Paragraph } = Typography;
  const lineChart = {
    series: [
      
      {
        name: "Studnets",
        data: data,
        offsetY: 0,
      },
    ],
  
    options: {
      chart: {
        width: "100%",
        height: 350,
        type: "area",
        toolbar: {
          show: false,
        },
      },
  
      legend: {
        show: false,
      },
  
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
        colors:['#EB3E35']
      },
  
      yaxis: {
        labels: {
          style: {
            fontSize: "14px",
            fontWeight: 600,
            colors: ["#EB3E35"],
          },
        },
      },
  
      xaxis: {
        labels: {
          style: {
            fontSize: "14px",
            fontWeight: 600,
            colors: labels,
          },
        },
        categories: [
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
        ],
      },
  
      tooltip: {
        y: {
          formatter: function (val) {
            return val;
          },
        },
      },
    },
  };
  return (
    <>
      <div className="linechart">
        <div>
          <Title level={5}>Students Last 6 Month</Title>
          
        </div>
       
      </div>

      <ReactApexChart
        className="full-width"
        options={lineChart.options}
        series={lineChart.series}
        type="area"
        height={350}
        width={"100%"}
      />
    </>
  );
}

export default LineChart;
