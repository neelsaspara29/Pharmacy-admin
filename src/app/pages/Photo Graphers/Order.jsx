import React, { useEffect, useState } from "react";
import { Modal, Form } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import { Link, useHistory } from "react-router-dom";
import NoDataTable from "../../../common/noDataTable";
import "../../../_metronic/_assets/sass/components/order/index.scss";
import { IoMdDoneAll } from 'react-icons/io';
import queryString from 'query-string'

import { MdPendingActions } from 'react-icons/md';
import { ApiPost } from "../../../helpers/API/ApiData";
import Status from "./Status";
let _id ;
function Order() {
   _id=queryString.parse(window.location.search).id;
  const [products, setProducts] = useState([])
  const [data, setData] = useState()
  const [approvedStatus, setApprovedStatus] = useState(false);
  
  const [orderStatus, setOrderStatus] = useState(1)

  const [updateMenu, setUpdateMenu] = useState(false);
  const [latestStatus, setLatestStatus] = useState(-1);
  const [user_id, setUser_id] = useState();
  const history = useHistory();
  const columns = [
    {
      dataField: "product_details",
      text: "Product Details",
      sort: true,
      formatter: (cell, row, index) => {
        console.log(cell, row, index);
        return  <div className="d-flex align-items-center">
        <div className="symbol symbol-50 symbol-light mr-2">
          <img
            src={
              row?.prodId?.mainImage
                ? row.prodId?.mainImage
                : "https://img.icons8.com/clouds/100/000000/user.png"
            }
            width={30}
            height={30}
            className="img-fluid"
            style={{ objectFit: "cover", width: "30px", height: "30px" }}
          />
        </div>
        <div>
          <a
            className="text-dark-75 font-weight-bolder text-hover-primary mb-1 font-size-lg"
          >
            {row?.prodId.name}
          </a>
        </div>
      </div>;
      },
    },
    {
      dataField: "price",
      text: "Item Price",
      sort: true,
      formatter: (cell, row) => {
        console.log("row", cell);
        return <span>&#8377;{ row.prodId.mrp}</span>;
      },
    },
    {
      dataField: "quantity",
      text: "Quantity",
      sort: true,
      formatter: (cell, row) => {
        return <span>{row.qty}</span>;
      },
    },
    {
      dataField: "discount",
      text: "Discount",
      sort: true,
      formatter: (cell, row) => {
        return <span></span>;
      },
    },
    {
      dataField: "total_amount",
      text: "Total Amount",
      sort: true,
      formatter: (cell, row) => {
        return <span>&#8377;{row.prodId.mrp*row.qty}</span>;
      },
    },
  ];
  // let data = [
  //   {
  //     product_details: "Product",
  //     price: "$10",
  //     quantity: "10",
  //     discount: "",
  //     total_amount: "$1000",
  //   },
  //   {
  //     product_details: "Product",
  //     price: "$10",
  //     quantity: "10",
  //     discount: "",
  //     total_amount: "$1000",
  //   },
  //   {
  //     product_details: "Product",
  //     price: "$10",
  //     quantity: "10",
  //     discount: "",
  //     total_amount: "$1000",
  //   },
  //   {
  //     product_details: "Product",
  //     price: "$10",
  //     quantity: "10",
  //     discount: "",
  //     total_amount: "$1000",
  //   },
  //   {
  //     product_details: "Product",
  //     price: "$10",
  //     quantity: "10",
  //     discount: "",
  //     total_amount: "$1000",
  //   },
  // ];
  const acceptOrder =async () => {
    let _id=queryString.parse(window.location.search).id;
    await ApiPost("/order/update", {
      orderId: _id,
      status:1
    })
    
    fetchData(_id);
  }
  const fetchData =async (_id) => {
    await ApiPost('/order/get', { orderId: _id }).then((res) => {
      setProducts(res?.data?.data?.orderDetails.prods)
      setData(res?.data?.data?.orderDetails)
      console.log("res.res",res.data.data.orderDetails)
    })
  }
  
const handleInvoice = async() => {
  await ApiPost('/order/invoice', {
    orderId:_id
  }).then((data) => {
    console.log(data)
    window.open(data.data.data, '_blank', 'noopener,noreferrer');
  })
}

  useEffect(() => {
    fetchData(queryString.parse( window.location.search).id);
    console.log(queryString.parse( window.location.search));
  
   
  }, [])
  

  return (
    <>
      <div
        class="content  d-flex flex-column flex-column-fluid  h-100"
        id="kt_content"
      >
        <div class="card card-custom">
          <div class="container">
            <div class="row justify-content-center">
              <div class="col-8">
                <div className="order_left">
                  <div className="order_left_order_summery">
                    <div className="d-flex justify-content-between align-items-center p-2 w-100">
                      <div><b> <h4 className="text-gray-700"> ORDER #vLd234</h4> </b></div>
                      <div className=" btn-success invoice_btn " style={{fontSize:"10px",padding:"10px 18px"}} onClick={handleInvoice}>INVOICE</div>
                    </div>
                    <BootstrapTable
                      wrapperClasses="table-responsive"
                      bordered={false}
                      classes="table table-head-custom table-vertical-center overflow-hidden"
                      bootstrap4
                      keyField="id"
                      data={products}
                      columns={columns}
                      noDataIndication={() => <NoDataTable />}
                    />
                    <div className="sub_total">
                      <div className="sub_total_cat mr-2">
                        <div>
                          <span>Sub Total:</span>
                          <span>
                          &#8377;{
                              products.reduce((total, data)=>{
                              return total+data.prodId.mrp*data.qty;
                              },0)
                          }
                          </span>
                        </div>
                        <div>
                          <span>Discount::</span>
                          <span>{ data?.discount?data.discount:0}</span>
                        </div>
                        <div>
                          <span>Shipping Charge:</span>
                          <span className="text-red-600">+10</span>
                        </div>
                        <div>
                          <span>Estimate Tax:</span>
                          <span className="text-red-600">+2</span>
                        </div>
                        <div className="text-danger pt-5 pb-5 border-top border-light">
                          <span>Total Bill:</span>
                          <span>&#8377;{
                            products.reduce((total, data)=>{
                              return total+data.prodId.mrp*data.qty;
                              },0)- (  products.reduce((total, data)=>{
                                return total+data.prodId.mrp*data.qty;
                                },0))*(data?.discount)/100+10+2
                          }</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {
                    data?.orderStatus!=0 ?
                      <div className="order_status_main">
                    <div>
                      <div class="card-header flex-wrap order_status">
                        <div class="card-title">
                          <h3 class="card-label">Order Status</h3>
                        </div>

                        <div class="card-toolbar">
                          <Link
                            class="btn update_status_btn  text-gray-100 font-weight-bolder p-3"
                            onClick={() => setUpdateMenu(!updateMenu)}
                          >
                            Update Status
                          </Link>
                          <a
                            className="cancle_btn  text-danger  font-weight-bolder p-3"
                            // onClick={() => setModal(true)}
                          >
                            Cancle Order
                          </a>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="order_status_detail">
                        <div className="d-flex mb-7 ">
                          <div className="pr-3">
                                {data?.orderStatus>=1 ? <IoMdDoneAll style={{ fontSize: "22px", color: 'green' }} /> : <MdPendingActions style={{ fontSize: "22px" }}/>} 
                          </div>
                          <div>
                            <p>
                              <b> Order Placed -Wed 15,Dec 2021</b>
                            </p>
                            <br />
                            <p>
                              {" "}
                              <small> An Order has been placed.</small>
                            </p>
                            <p className="text-gray-600">
                              wed, 15 Dec 20221- 5.34PM
                            </p>
                            <p>&nbsp;</p>
                            <p>
                              <b> Seller has proccessed your order </b>
                            </p>
                            <p className="text-gray-600">
                              Thu, 16 Dec 2021- 5:48AM
                            </p>
                          </div>
                        </div>
                        <div className="d-flex mb-7 ">
                          <div className="pr-3">
                                {data?.orderStatus>=2 ? <IoMdDoneAll style={{ fontSize: "22px", color: 'green' }} /> : <MdPendingActions style={{ fontSize: "22px" }}/>} 
                          </div>
                          <div>
                            <p>
                              <b> Packed -Wed 16,Dec 2021</b>
                            </p>
                            <br />
                            <p>
                              
                              <small> Your Item has been picked up by courier partner</small>
                            </p>
                            <p className="text-gray-600">
                              wed, 15 Dec 20221- 5.34PM
                            </p>
                           
                          </div>
                        </div>
                        <div className="d-flex mb-7 ">
                          <div className="pr-3">
                                {data?.orderStatus>=3 ? <IoMdDoneAll style={{ fontSize: "22px", color: 'green' }} /> : <MdPendingActions style={{ fontSize: "22px" }}/>} 
                          </div>
                          <div>
                            <p>
                              <b> Shipping -Wed 16,Dec 2021</b>
                            </p>
                            <br />
                            <p>
                              {" "}
                              <small> RQL Logistics-MDFC1515154</small>
                              <br />
                              <small> Your item has been shipped.</small>
                            </p>
                            <p className="text-gray-600">
                              wed, 18 Dec 20221- 5.34PM
                            </p>
                           
                          </div>
                        </div>
                        <div className="d-flex mb-7 ">
                          <div className="pr-3">
                                {data?.orderStatus>=4 ? <IoMdDoneAll style={{ fontSize: "22px", color: 'green' }} /> : <MdPendingActions style={{ fontSize: "22px" }}/>} 
                          </div>
                          <div>
                            <p>
                              <b> Out Of Delivery</b>
                            </p>
                            <br />
                           
                           
                          </div>
                        </div>
                        <div className="d-flex mb-7 ">
                          <div className="pr-3">
                                {data?.orderStatus>=5 ? <IoMdDoneAll style={{ fontSize: "22px", color: 'green' }} /> : <MdPendingActions style={{ fontSize: "22px" }}/>} 
                          </div>
                          <div>
                            <p>
                              <b> Delivered</b>
                            </p>
                            <br />
                         
                          </div>
                        </div>
                       
                      </div>
                    </div>
                    </div> :
                      <div className="approved_stat">
                        <div className="accept_btn btn btn-primary" onClick={acceptOrder}>Accept</div>
                        <div className="reject_btn btn btn-danger">Reject</div>
                    </div>
                  
                  }
                </div>
              </div>
              <div class="col-4 ">
                <div className="wrapper_order_side">
                  <div className="w-100 p-2 card-1">
                    <div className="d-flex justify-content-between w-100 py-2  border-bottom border-light ">
                      <h4>Shop Details</h4>
                      <p>View Profile</p>
                    </div>
                    <div className="d-flex mt-2">
                      <img
                        src="/assets/media/stock-600x400/img-6.jpg"
                        width={40}
                        height={40}
                        alt=""
                        className="mr-1"
                      />
                      <div>
                        <span className="text-gray-800"> Iron Man</span>
                        <br />
                        <span className="text-gray-400">customer</span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="ml-8 text-gray-700">shubham@gmail.com</p>
                      <p className="ml-8 text-gray-700">+129086578</p>
                    </div>
                  </div>
                
                    <div className="w-100 card-1 p-2">
                      <div className="d-flex justify-content-between w-100 mb-2 py-2 border-bottom border-light">
                        <h4 >Billing Address</h4>
                      </div>
                      <p>Shubham</p>
                      <p>+(911)12345667</p>
                      <p>216 joya park india</p>
                      <p>India-9086578</p>
                      <p>India</p>
                    </div>
                    <div className="w-100 card-1 p-2">
                      <div className="d-flex justify-content-between w-100 mb-2 py-2 border-bottom border-light">
                        <h4 >Shipping Address</h4>
                      </div>
                      <p>Shubham</p>
                      <p>+(911)12345667</p>
                      <p>216 joya park india</p>
                      <p>India-9086578</p>
                      <p>India</p>
                    </div>
                    <div className="w-100 card-1 p-2 payment_details">
                      <div className="d-flex justify-content-between w-100 mb-2 py-2 border-bottom border-light">
                        <h4 >Payment Details Address</h4>
                    </div>
                    <div>
                      <span>Transaction:</span>&nbsp;<span>#VFGHBF15874855</span>
                    </div>
                    <div>

                      <span>Payment Method:</span>&nbsp; <span>Debit Card</span>
                    </div>
                    <div>

                      <span>Card Holder Name:</span>&nbsp;<span>Joseph Parker</span>
                    </div>
                    <div>

                      <span>Card Name:</span>&nbsp;<span>xxxx xxxx xxxx 1234</span>
                    </div>
                    <div>

                      <span>Total Amount:</span>&nbsp;<span>$415.88</span>
                    </div>
                    </div>
                  
                   
                  </div>
                
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <Status updateMenu={updateMenu} setUpdateMenu={setUpdateMenu} _id={queryString.parse( window.location.search).id} data={data} /> */}
    </>
  );
}

export default Order;
