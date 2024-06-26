const eChart = {
    series: [
      {
        name: "Sales",
        data: [450, 200, 100, 220, 500, 100, 400, 230, 500],
        color: "#fff",
      },
    ],
  
    options: {
      chart: {
        type: "bar",
        width: "100%",
        height: "auto",
  
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          borderRadius: 5,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 1,
        colors: ["transparent"],
      },
      grid: {
        show: true,
        borderColor: "#ccc",
        strokeDashArray: 2,
      },
      xaxis: {
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
        labels: {
          show: true,
          align: "right",
          minWidth: 0,
          maxWidth: 160,
          style: {
            colors: [
              "#fff",
              "#fff",
              "#fff",
              "#fff",
              "#fff",
              "#fff",
              "#fff",
              "#fff",
              "#fff",
              "#fff",
            ],
          },
        },
      },
      yaxis: {
        labels: {
          show: true,
          align: "right",
          minWidth: 0,
          maxWidth: 160,
          style: {
            colors: [
              "#fff",
              "#fff",
              "#fff",
              "#fff",
              "#fff",
              "#fff",
              "#fff",
              "#fff",
              "#fff",
              "#fff",
            ],
          },
        },
      },
  
      tooltip: {
        y: {
          formatter: function (val) {
            return "$ " + val + " thousands";
          },
        },
      },
    },
  };
  
  import ReactApexChart from "react-apexcharts";
  import { Row, Col, Typography } from "antd";
 
  
  function EChart() {
    const { Title, Paragraph } = Typography;
  
    const items = [
      {
        Title: "3,6K",
        user: "Users",
      },
      {
        Title: "2m",
        user: "Clicks",
      },
      {
        Title: "$772",
        user: "Sales",
      },
      {
        Title: "82",
        user: "Items",
      },
    ];
  
    return (
      <>
        <div id="chart">
          <ReactApexChart
            className="bar-chart"
            options={eChart.options}
            series={eChart.series}
            type="bar"
            height={'100%'}
          />
        </div>
        
      </>
    );
  }
  
  export default EChart;
  
  