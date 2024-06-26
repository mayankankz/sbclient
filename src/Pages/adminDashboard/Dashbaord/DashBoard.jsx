import { CurrencyRupee, School, ShoppingBagSharp } from "@mui/icons-material";
import { Card, Col, Row, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { BsHeart, BsPersonFillCheck } from "react-icons/bs";
const { Title, Text } = Typography;
import '../../../assets/css/main.css';
import EChart from "../../../Components/Charts/BarChart";
import LineChart from "../../../Components/Charts/Echarts";
import { TfiUser } from "react-icons/tfi";
import { AiOutlineUser, AiOutlineUserAdd } from "react-icons/ai";
import { toast } from "react-toastify";
import { getadminData } from "../../../service/student";
import Loader from "../../../Components/Loader/Loader";

const DashBoard = () => {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  const count = [
    {
      today: "Total Students",
      title: data.counts ? data.counts.studentCount : 0,
      icon: <AiOutlineUserAdd />,
      bnb: "bnb2",
    },
    {
      today: "Total Schools",
      title: data.counts ? data.counts.schoolsCount : 0,
      icon: <School />,
      bnb: "bnb2",
    },
    {
      today: "Total Users",
      title: data.counts ? data.counts.schoolsCount : 0,
      icon: <AiOutlineUser />,
      bnb: "redtext",
    },
    {
      today: "Total Staff",
      title: "4",
      icon: <TfiUser />,
      bnb: "bnb2",
    },
  ];

  useEffect(() => {
    async function getData() {
      try {
        setIsLoading(true);
        const dashboard = await getadminData();
        console.log(dashboard.data);
        setData(dashboard);
      } catch (error) {
        toast.error('Something went wrong.');
      } finally {
        setIsLoading(false);
      }
    }
    getData();
  }, []);

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <Row className="rowgap-vbox" gutter={[24, 0]}>
            {count.map((c, index) => (
              <Col
                key={c.today}
                xs={24}
                sm={24}
                md={12}
                lg={6}
                xl={6}
                className="mb-24"
              >
                <Card bordered={false} className="criclebox">
                  <div className="number">
                    <Row align="middle" gutter={[24, 0]}>
                      <Col xs={18}>
                        <span>{c.today}</span>
                        <Title level={3}>
                          {c.title} <small className={c.bnb}>{c.persent}</small>
                        </Title>
                      </Col>
                      <Col xs={6}>
                        <div className="icon-box">{c.icon}</div>
                      </Col>
                    </Row>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>

          <Row gutter={[24, 0]}>
            <Col xs={24} sm={24} md={12} lg={12} xl={10} className="mb-24">
              <Card bordered={false} className="criclebox h-full">
                {data.data && data.data.length > 0 && (
                  <EChart
                    labels={data.data.map(d => d.name.slice(0,15))}
                    data={data.data.map(d => parseInt(d.value))}
                  />
                )}
              </Card>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={14} className="mb-24">
              <Card bordered={false} className="criclebox h-full">
                <LineChart labels={data.studentsChart.map(d => d.name)}
                data={data.studentsChart.map(d => parseInt(d.value))} />
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default DashBoard;
