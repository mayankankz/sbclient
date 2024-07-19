
  
  import ReactApexChart from "react-apexcharts";
  import { Row, Col, Typography } from "antd";
 
  
  function EChart({labels,data}) {
    const { Title, Paragraph } = Typography;
  debugger
    const eChart = {
      series: [
        {
          name: "Students",
          data: data,
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
          categories: labels,
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
              return val;
            },
          },
        },
      },
    };
  
    return (
      <>
        <div id="chart">
          <ReactApexChart
            className="bar-chart"
            options={eChart.options}
            series={eChart.series}
            type="bar"
            
          />
          <div className="chart-vistior">
       
        <Paragraph className="lastweek">
          Students count in every school.
        </Paragraph>
       
      </div>
        </div>
        
      </>
    );
  }
  
  export default EChart;
  
  