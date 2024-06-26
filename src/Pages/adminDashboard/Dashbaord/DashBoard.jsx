import { CurrencyRupee, ShoppingBagSharp } from "@mui/icons-material";
import { Card, Col, Row, Typography } from "antd";
import React from "react";
import { BsHeart, BsPersonFillCheck } from "react-icons/bs";
const { Title, Text } = Typography;
import '../../../assets/css/main.css';
import EChart from "../../../Components/Charts/BarChart";
import LineChart from "../../../Components/Charts/Echarts";
const count = [
  {
    today: "Total Students",
    title: "$53,000",
    persent: "+30%",
    icon: <CurrencyRupee />,
    bnb: "bnb2",
  },
  {
    today: "Total Schools",
    title: "3,200",
    persent: "+20%",
    icon: <BsPersonFillCheck />,
    bnb: "bnb2",
  },
  {
    today: "Total Users",
    title: "+1,200",
    persent: "-20%",
    icon: <BsHeart />,
    bnb: "redtext",
  },
  {
    today: "Total Staff",
    title: "$13,200",
    persent: "10%",
    icon: <ShoppingBagSharp />,
    bnb: "bnb2",
  },
];
const DashBoard = () => {
  return (
    <div>
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
            <Card bordered={false} className="criclebox ">
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
              <EChart />
            </Card>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={14} className="mb-24">
            <Card bordered={false} className="criclebox h-full">
              <LineChart />
            </Card>
          </Col>
        </Row>
    </div>
  );
};

export default DashBoard;
