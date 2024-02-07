import {validateIdentification} from "../utils/serviceUtils";
import {useDispatch} from "react-redux";
import {setCount, loginStatus, logoutStatus} from "../features/userSlice";
import {
    ShoppingCartOutlined,
    UserOutlined,
    ScheduleOutlined
} from '@ant-design/icons';
import React, {useEffect, useState} from "react";
import {Outlet, Link, useNavigate} from "react-router-dom";
import "./MainLayout.css"
import {Layout, Menu, theme, Input, Space, Col, Row, message, Dropdown, Button} from 'antd';
import UserIcon from "../components/UserIcon";
import {postAccessToken} from "../configs/services";
import Constant from "../store/constant";
const { Search } = Input;
const { Header, Content, Footer } = Layout;



const MainLayout = () => {
    // const {
    //     token: { colorBgContainer },
    // } = theme.useToken();

    const [identity, setIdentity] = useState("-1")
    const navigate = useNavigate();
    const dispatch = useDispatch()
    useEffect(() => {
       
        postAccessToken().then(res=>{
            const response = JSON.parse(res.data)
            console.log("JTW response=>", response)
            setIdentity(response.object.identity)
            dispatch(loginStatus(response.object))
        }).catch(err=>{
            console.log("本地无身份或身份过期, err:", err)
            dispatch(logoutStatus())
        })
    }, []);
    const items = [
        {
            key: '1',
            label: (
                <span onClick={()=>{navigate("sellerOrder")}}>Orders</span>
            ),
        }
    ];
    const itemsCart = [
        {
            key: '2',
            label: (
                <span onClick={()=>{navigate("cart")}}>Cart</span>
            ),
        }
    ];
    const searchGoods = (value) => {
        navigate("/all",{ state: { search: value }})
    }
    return (
        <Layout>
            <Header
                style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    height: '60px'
                }}
            >
                <Row className="headline">
                    <Col span={6}>
                        <span className="headlineText" onClick={()=>{navigate("/")}}>E-Galaxy</span>
                    </Col>
                    <Col span={1}>
                    </Col>
                    <Col span={10}>
                        <Search
                            placeholder="Search input item"
                            onSearch={searchGoods}
                            className="search"
                        />
                    </Col>
                    <Col span={1}>
                    </Col>
                    <Col span={2}>
                        <Link to={`all`}>
                            {/* <span className="linkText">Goods</span> */}
                        </Link>
                    </Col>
                    <Col span={2}>
                        {/*<span className="linkIcon"><UserOutlined /></span>*/}
                        <div className="linkIcon">
                            <UserIcon/>
                        </div>

                    </Col>
                    <Col span={2}>
                        {
                            identity===Constant.SELLER_IDENTITY?
                                <>
                                    <span key="1" className="linkIcon" onClick={()=>{navigate("sellerOrder")}}>
                                        <Dropdown menu={{items}} placement="bottom" arrow={{ pointAtCenter: true }}>
                                          <ScheduleOutlined>
                                        </ScheduleOutlined>
                                        </Dropdown>

                                    </span>
                                </>
                                :
                                <>
                                    <span key="2" className="linkIcon" onClick={()=>{navigate("cart")}} >
                                        <ShoppingCartOutlined />
                                    </span>
                                </>
                        }
                        {/*<span className="linkIcon" onClick={()=>{navigate("cart")}}><ShoppingCartOutlined /></span>*/}
                    </Col>
                </Row>
            </Header>
            <Content className="site-layout">
                <div className="container">
                    <Outlet/>
                </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>
     ©2023 Created by <a href="https://bitfusion.in" target="_blank">Group_1</a>
</Footer>

        </Layout>
    );
};
export default MainLayout;