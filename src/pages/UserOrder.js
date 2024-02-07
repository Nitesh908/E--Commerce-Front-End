import React, {useEffect, useState} from "react";
import {validateJwt} from "../utils/serviceUtils";
import Constant from "../store/constant";
import {useNavigate} from "react-router-dom";
import {Button, Col, Image, message, Pagination, Row, Table, Tag} from "antd";
import {MinusOutlined, PlusOutlined, MinusCircleOutlined} from "@ant-design/icons";
import {
    postAddOrUpdateCart,
    postDeleteCart,
    postDeleteFailedOrder,
    postGetUserCart,
    postGetUserOrder, postMakeSigned
} from "../configs/services";
const ButtonGroup = Button.Group;

function UserOrder() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [orderList, setOrderList] = useState([])
    const [userId, setUserId] = useState(-1);
    const [totalItem,setTotalItem] = useState(0)
    const [pageSize,setPageSize] = useState(5)
    const [nthPage,setNthPage] = useState(1)
    const onShowSizeChange = (current, pageSize) => {
        setNthPage(current);setPageSize(pageSize);
    };
    const onPageAndSizeChange = (page, pageSize) => {
        setNthPage(page);setPageSize(pageSize);
    }
    useEffect(()=>{
        validateJwt().then(res=>{
            const response = JSON.parse(res.data)
            if(response.code===200 && response.object.identity===Constant.BUYER_IDENTITY) {
                console.log("user jwt=>", response.object)
                setUserId(response.object.userId);
            } else {
                navigate("/login")
            }
        }).catch(err=>{
            console.log("Validation failed, ACCESS-TOKEN does not exist locally; err",err)
            navigate("/login")
        })
    },[])

    const fetchOrders = () => {
        if(userId===-1) return;
        postGetUserOrder({userId:userId, nthPage:nthPage, pageSize:pageSize}).then(res=>{
            const response = JSON.parse(res.data)
            if(response.code===200) {
                const newObjList = response.object.orders.map((item, index) => {
                    return { key: index, ...item };
                });
                setOrderList(newObjList)
                setTotalItem(response.object.totalElement)
            }
        }).catch(err=>{

        })
    }

    useEffect(()=>{
        if(userId===-1) return;
        setLoading(true)
        fetchOrders()
        setLoading(false)
    },[userId, nthPage, pageSize])

    const deleteOrder = (record) => {
        postDeleteFailedOrder({orderId: record.orderId}).then(res=>{
            const response = JSON.parse(res.data)
            if(response.code===200) {
                message.success("Deleted");
                fetchOrders()
            }
        })
    }

    const makeSign = (record) => {
        postMakeSigned({orderId: record.orderId}).then(res=>{
            const response = JSON.parse(res.data)
            if(response.code===200) {
                message.success("Status is updated [Signed]");
                fetchOrders()
            }
        })
    }

    const columns = [
        {
            title: 'Actions',
            width: 5,
            key: 'action2',
            align: 'center',
            render: (_, record) => {
                if(record.orderStatus==="CREATE_FAILED") {
                    return (
                        <Button onClick={()=>{deleteOrder(record)}} size="small"  type="circle"  >
                    <span style={{fontSize:'20px', color:'red'}}>
                        <MinusCircleOutlined />
                    </span>
                        </Button>
                    )
                }
                else if(record.orderStatus==="DELIVERING") {
                    return (
                        <Button onClick={()=>{makeSign(record)}} size="small"  type="primary"  >
                            Sign
                        </Button>
                    )
                }

            },
        },
        {
            title: 'Cover',
            dataIndex: 'goodsImage',
            key: 'goodsImage',
            align: 'center',
            render: (imageUrl) => <Image src={imageUrl} height={90}/>,
        },
        {
            title: 'Goods Name',
            dataIndex: 'goodsName',
            key: 'goodsName',
            align: 'center',
        },
        {
            title: 'Number',
            width: 10,
            dataIndex: 'goodsNum',
            key: 'goodsNum',
            align: 'center',
        },
        {
            title: 'Total Price',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            align: 'center',
        },
        {
            title: 'Status',
            dataIndex: 'orderStatus',
            key: 'orderStatus',
            align: 'center',
            render: (_, record) => {
                let color = "#87d068"
                let text = "";
                switch (record.orderStatus) {
                    case "CREATED":
                    {
                        color = "rgba(135,208,104,0.87)";
                        text = "CREATED";
                        break;
                    }
                    case "CREATE_FAILED":
                    {
                        color = "#f50";
                        text = "CREATE FAILED";
                        break;
                    }
                    case "DELIVERING":
                    {
                        color = "#2db7f5";
                        text = "DELIVERING";
                        break;
                    }
                    case "SIGNED":
                    {
                        color = "#0db009";
                        text = "SIGNED";
                        break;
                    }
                    case "CREATING":
                    {
                        color = "#fae503";
                        text = "CREATING";
                        break;
                    }
                    default:
                        break;
                }
                return (
                    <Tag color={color}>{text}</Tag>
                )
            }
        },
        {
            title: 'Order Date',
            dataIndex: 'orderDateTime',
            key: 'orderDateTime',
            align: 'center',
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
            align: 'center',
        },

    ];

    return (
        <div>
            <h1>My Orders</h1>
            <Table
                columns={columns}
                loading={loading}
                dataSource={orderList}
                pagination={false}
            />
            <br/>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Pagination
                    showSizeChanger
                    defaultPageSize={5}
                    pageSizeOptions={[5,10,20,50,100]}
                    onShowSizeChange={onShowSizeChange}
                    onChange={onPageAndSizeChange}
                    defaultCurrent={nthPage}
                    total={totalItem}
                    showTotal={(total) => `Total ${total} items`}
                />
            </div>
        </div>
    )
}

export default UserOrder;