import React, { useEffect, useState } from "react";
import { Modal, Form } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import { Link, useHistory, useLocation } from "react-router-dom";
import NoDataTable from "../../../common/noDataTable";
import "../../../_metronic/_assets/sass/components/order/index.scss";
import { IoMdDoneAll } from "react-icons/io";
import queryString from "query-string";
import { AiOutlineEdit } from "react-icons/ai";
import { MdPendingActions } from "react-icons/md";
import { ApiPost } from "../../../helpers/API/ApiData";
import Status from "./Status";
import { ErrorToast, SuccessToast } from "../../../helpers/Toast";
import moment from "moment";
let _id;
function Order() {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [data, setData] = useState();
  const [note, setNote] = useState("");
  const [receivedAmount, setReceivedAmount] = useState(0);
  const [state_receive, setState_receive] = useState(0);
  const [receiveToggle, setReceiveToggle] = useState(false);
  const [toggleNote, setToggleNote] = useState(false);
  const [status, setStatus] = useState([
    "Placed",
    "Processing",
    "Rejected",
    "Shipping",
    "Delivered",
    "Return In Progress",
    "Return",
  ]);

  const [updateMenu, setUpdateMenu] = useState(false);
  const [latestStatus, setLatestStatus] = useState(-1);
  const [user_id, setUser_id] = useState();
  const [noteVal, setNoteVal] = useState("");
  const history = useHistory();
  const columns = [
    {
      dataField: "product_details",
      text: "Product Details",
      sort: true,
      formatter: (cell, row, index) => {
        console.log(cell, row, index);
        return (
          <div className="d-flex align-items-center">
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
              <a className="text-dark-75 font-weight-bolder text-hover-primary mb-1 font-size-lg">
                {row?.prodId.name}
              </a>
            </div>
          </div>
        );
      },
    },
    {
      dataField: "price",
      text: "PTR Price",
      sort: true,
      formatter: (cell, row) => {
        console.log("row", cell);
        return <span>&#8377;{row.prodId.ptr}</span>;
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
      dataField: "total_amount",
      text: "Total Amount",
      sort: true,
      formatter: (cell, row) => {
        console.log("hello",row)
        return <span>&#8377;{row.prodId.ptr * row.qty}</span>;
      },
    },
  ];
  const changeNote = (e) => {
    setNoteVal(e.target.value);
  };
  const handleSubmitNote = async () => {
    await ApiPost("/order/update/other", {
      orderId: user_id || queryString.parse(window.location.search).id,
      note: noteVal,
      noteDate: new Date(),
    }).then((data) => {
      SuccessToast("Note Added");
      setToggleNote(!toggleNote);
      fetchData(user_id);
    });
  };
  const handleReceiveChange = async () => {
    await ApiPost("/order/update/other", {
      orderId: user_id || queryString.parse(window.location.search).id,
      recievedAmount: state_receive,
    }).then((data) => {
      setReceiveToggle(!receiveToggle);
      fetchData(user_id);
    });
  };
  const acceptOrder = async () => {
    await ApiPost("/order/update", {
      orderId: user_id,
      status: 1,
    }).then((data) => SuccessToast("Order Status Changed"));

    fetchData(user_id);
  };
  const cancleOrdert = async () => {
    let _id = queryString.parse(window.location.search).id;
    await ApiPost("/order/update", {
      orderId: _id,
      status: 2,
    }).then((data) => SuccessToast("Order Cancle SuccessFully"));

    history.push("/orders");
  };
  const fetchData = async (_id) => {
    await ApiPost("/order/get", { orderId: _id }).then((res) => {
      console.log("res-", res);
      setProducts(res?.data?.data?.orderDetails?.prods);
      setData(res?.data?.data?.orderDetails);
      setNote(res?.data?.data?.orderDetails?.note);
      setReceivedAmount(res?.data?.data?.orderDetails?.recievedAmount);
      console.log("res.res", res.data.data.orderDetails);
    });
  };

  const handleInvoice = async () => {
    await ApiPost("/order/invoice", {
      orderId: user_id,
    }).then((data) => {
      console.log(data);
      window.open(data.data.data, "_blank", "noopener,noreferrer");
    });
  };
  const handleChangeStatus = async (e) => {
    console.log(e.target.options[e.target.selectedIndex].dataset.id);
    setLatestStatus(
      Number(e.target.options[e.target.selectedIndex].dataset.id)
    );
  };
  const handleupdateStatus = async () => {
    console.log(latestStatus, user_id);
    await ApiPost("/order/update", {
      orderId: user_id,
      status: latestStatus,
    });
    history.push({
      pathname: "/order",
      search: `?id=${user_id}`,
      state: { _id: user_id },
    });
    fetchData(user_id);
    setUpdateMenu(!updateMenu);
  };

  useEffect(() => {
    setUser_id(location.state._id);
    fetchData(location.state._id);
    console.log(queryString.parse(window.location.search));
  }, []);

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
                      <div>
                        <b>
                          {" "}
                          <h4 className="text-gray-700">
                            {" "}
                            OrderId: #{data?.oId}
                          </h4>{" "}
                        </b>
                      </div>
                      <div
                        className="  btn-success invoice_btn "
                        style={{
                          fontSize: "10px",
                          padding: "10px 18px",
                          cursor: "pointer",
                        }}
                        onClick={handleInvoice}
                      >
                        INVOICE
                      </div>
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
                            &#8377;
                            {data?.orderTotal}
                          </span>
                        </div>
                        <div>
                          <span>Discount::</span>
                          <span className="text-green-500">
                            {data?.discount ? "-" + data.discount : 0}
                          </span>
                        </div>
                        <div>
                          <span>Gst::</span>
                          <span className="text-green-500">
                            {data?.gst}
                          </span>
                        </div>
                        {/* <div>
                          <span>Shipping Charge:</span>
                          <span className="text-red-600">+10</span>
                        </div> */}
                        {/* <div>
                          <span className="text-red-600">Estimate Tax:</span>
                          <span>+2</span>
                        </div> */}
                        <div className="text-danger pt-5 pb-5 border-top border-light">
                          <span>Total Bill:</span>
                          <span>
                            &#8377;
                            {data?.total}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {(data?.orderStatus == 2 || data?.orderStatus == 7) && (
                    <>
                      <div className="approved_stat">
                        <div className="text-danger">
                          This Order Is Cancle Or Rejected
                        </div>
                        <div
                          className=" btn btn-primary p-2"
                          onClick={() => {
                            history.push("/orders");
                          }}
                        >
                          Go Back To Orders
                        </div>
                      </div>
                    </>
                  )}
                  {data?.orderStatus == 0 && (
                    <div className="approved_stat">
                      <div
                        className="accept_btn btn btn-primary"
                        onClick={acceptOrder}
                      >
                        Accept
                      </div>
                      <div className="reject_btn btn btn-danger">Reject</div>
                    </div>
                  )}
                  {(data?.orderStatus != 2 && data?.orderStatus != 7) && data?.orderStatus != 0 && (
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
                              onClick={() => cancleOrdert()}
                            >
                              Cancle Order
                            </a>
                          </div>
                        </div>
                      </div>
                      {updateMenu ? (
                        <div className="d-flex w-100 justify-content-between align-items-center mt-2 border-top-light border-1">
                          <div className="text-center w-80">
                            <Form.Group>
                              <Form.Label>From</Form.Label>
                              <Form.Control
                                type="text"
                                id="packID"
                                readOnly
                                label="pack"
                                required
                                name="pack"
                                placeholder={status[data?.orderStatus]}
                              />
                            </Form.Group>
                          </div>
                          <div className="w-50 text-center">
                            <div>
                              <Form.Group>
                                <Form.Label>To</Form.Label>
                                <Form.Control
                                  as="select"
                                  placeholder="Change Status"
                                  onChange={handleChangeStatus}
                                >
                                  <option>Select Status</option>
                                  <option data-id={0}>Placed</option>
                                  <option data-id={1}>Processing</option>
                                  <option data-id={3}>Shipping</option>
                                  <option data-id={4}>Delivered</option>
                                  <option data-id={5}>
                                    Return In Progress
                                  </option>
                                  <option data-id={6}>Return</option>
                                </Form.Control>
                              </Form.Group>
                            </div>
                          </div>
                          <div className="d-flex " style={{ zIndex: "12" }}>
                            <div
                              className="p-2 btn-success text-gray-100 "
                              onClick={() => handleupdateStatus()}
                            >
                              Change
                            </div>
                            <div
                              className="p-2 btn-danger text-red-500 "
                              onClick={() => setUpdateMenu(!updateMenu)}
                            >
                              Cancle
                            </div>
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                      <div>
                        <div className="order_status_detail">
                          <div className="d-flex mb-7 ">
                            <div className="pr-3">
                              {data?.orderStatus >= 0 ? (
                                <IoMdDoneAll
                                  style={{ fontSize: "22px", color: "green" }}
                                />
                              ) : (
                                <MdPendingActions
                                  style={{ fontSize: "22px" }}
                                />
                              )}
                            </div>
                            <div>
                              <p>
                                <b>
                                  {" "}
                                  Order Placed{" "}
                                  {data?.createdAt && data?.orderStatus >= 0
                                    ? "-" +
                                      moment(data.createdAt).format(
                                        "dddd,Do MMMM YYYY"
                                      )
                                    : ""}{" "}
                                </b>
                                <br />

                                {data?.createdAt ? (
                                  <>
                                    <p>
                                      <small> An Order has been placed.</small>
                                    </p>
                                    <p className="text-gray-600">
                                      {moment(data.createdAt).format(
                                        "dddd,Do MMMM  YYYY,h:mm:ss a"
                                      )}
                                    </p>
                                  </>
                                ) : (
                                  ""
                                )}
                              </p>

                              <p>&nbsp;</p>
                            </div>
                          </div>
                          <div className="d-flex mb-7 ">
                            <div className="pr-3">
                              {data?.orderStatus >= 1 ? (
                                <IoMdDoneAll
                                  style={{ fontSize: "22px", color: "green" }}
                                />
                              ) : (
                                <MdPendingActions
                                  style={{ fontSize: "22px" }}
                                />
                              )}
                            </div>
                            <div>
                              <p>
                                <b>
                                  Processing
                                  {data?.packedDate && data?.orderStatus >= 1
                                    ? "-" +
                                      moment(data.packedDate).format(
                                        "dddd, Do MMMM YYYY"
                                      )
                                    : ""}
                                </b>
                              </p>
                              {data?.packedDate && data?.orderStatus >= 1 ? (
                                <>
                                  <br />
                                  <p>
                                    <small>Your Order Is Under Process</small>
                                  </p>
                                  <p className="text-gray-600">
                                    {data?.packedDate ? (
                                      <>
                                        <p className="text-gray-600">
                                          {moment(data.packedDate).format(
                                            "dddd,Do MMMM YYYY,h:mm:ss a"
                                          )}
                                        </p>
                                      </>
                                    ) : (
                                      ""
                                    )}
                                  </p>
                                </>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                          <div className="d-flex mb-7 ">
                            <div className="pr-3">
                              {data?.orderStatus >= 3 ? (
                                <IoMdDoneAll
                                  style={{ fontSize: "22px", color: "green" }}
                                />
                              ) : (
                                <MdPendingActions
                                  style={{ fontSize: "22px" }}
                                />
                              )}
                            </div>
                            <div>
                              <p>
                                <b>
                                  {" "}
                                  Shipping{" "}
                                  {data?.shippingDate && data?.orderStatus >= 3
                                    ? "-" +
                                      moment(data.shippingDate).format(
                                        "dddd, MMMM Do YYYY"
                                      )
                                    : ""}
                                </b>
                              </p>
                              <br />

                              {data?.shippingDate && data?.orderStatus >= 3 ? (
                                <>
                                  <p>
                                    <small> Your Order Is On The Way.</small>
                                  </p>

                                  <p className="text-gray-600">
                                    {moment(data.shippingDate).format(
                                      "dddd,Do MMMM YYYY,h:mm:ss a"
                                    )}
                                  </p>
                                </>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                          <div className="d-flex mb-7 ">
                            <div className="pr-3">
                              {data?.orderStatus >= 4 ? (
                                <IoMdDoneAll
                                  style={{ fontSize: "22px", color: "green" }}
                                />
                              ) : (
                                <MdPendingActions
                                  style={{ fontSize: "22px" }}
                                />
                              )}
                            </div>
                            <div>
                              <p>
                                <b>Delivered</b>
                              </p>
                              <br />

                              {data?.deliverdDate && data?.orderStatus >= 4 ? (
                                <>
                                  <p>
                                    <small>
                                      Your Order Is Delivered On &nbsp;
                                      {moment(data.deliverdDate).format(
                                        "dddd,Do MMMM YYYY,h:mm:ss a"
                                      )}
                                    </small>
                                  </p>
                                </>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                          <div className="d-flex mb-7 ">
                            <div className="pr-3">
                              {data?.orderStatus >= 5 ? (
                                <IoMdDoneAll
                                  style={{ fontSize: "22px", color: "green" }}
                                />
                              ) : (
                                <MdPendingActions
                                  style={{ fontSize: "22px" }}
                                />
                              )}
                            </div>
                            <div>
                              <p>
                                <b> Return In Progress</b>
                              </p>
                              <br />
                            </div>
                          </div>
                          <div className="d-flex mb-7 ">
                            <div className="pr-3">
                              {data?.orderStatus >= 6 ? (
                                <IoMdDoneAll
                                  style={{ fontSize: "22px", color: "green" }}
                                />
                              ) : (
                                <MdPendingActions
                                  style={{ fontSize: "22px" }}
                                />
                              )}
                            </div>
                            <div>
                              <p>
                                <b> Return</b>
                              </p>
                              <br />
                            </div>
                          </div>
                          <div
                            className="btn-primary p-2 "
                            style={{ width: "25%" }}
                            onClick={() => {
                              history.push("/orders");
                            }}
                          >
                            Go Back To Orders
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {/* {data?.orderStatus == 2 ? (
                    <>
                      <div className="approved_stat">
                        <div className="text-danger">
                          This Order Is Cancle Or Rejected
                        </div>
                        <div
                          className=" btn btn-primary p-2"
                          onClick={() => {
                            history.push("/orders");
                          }}
                        >
                          Go Back To Orders
                        </div>
                      </div>
                    </>
                  ) : data?.orderStatus == 0 ? (
                    <div className="approved_stat">
                      <div
                        className="accept_btn btn btn-primary"
                        onClick={acceptOrder}
                      >
                        Accept
                      </div>
                      <div className="reject_btn btn btn-danger">Reject</div>
                    </div>
                  ) : (
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
                              onClick={() => cancleOrdert()}
                            >
                              Cancle Order
                            </a>
                          </div>
                        </div>
                      </div>
                      {updateMenu ? (
                        <div className="d-flex w-100 justify-content-between align-items-center mt-2 border-top-light border-1">
                          <div className="text-center w-80">
                            <Form.Group>
                              <Form.Label>From</Form.Label>
                              <Form.Control
                                type="text"
                                id="packID"
                                readOnly
                                label="pack"
                                required
                                name="pack"
                                placeholder={status[data?.orderStatus]}
                              />
                            </Form.Group>
                          </div>
                          <div className="w-50 text-center">
                            <div>
                              <Form.Group>
                                <Form.Label>To</Form.Label>
                                <Form.Control
                                  as="select"
                                  placeholder="Change Status"
                                  onChange={handleChangeStatus}
                                >
                                  <option>Select Status</option>
                                  <option data-id={0}>Placed</option>
                                  <option data-id={1}>Processing</option>
                                  <option data-id={3}>Shipping</option>
                                  <option data-id={4}>Delivered</option>
                                  <option data-id={5}>
                                    Return In Progress
                                  </option>
                                  <option data-id={6}>Return</option>
                                </Form.Control>
                              </Form.Group>
                            </div>
                          </div>
                          <div className="d-flex " style={{ zIndex: "12" }}>
                            <div
                              className="p-2 btn-success text-gray-100 "
                              onClick={() => handleupdateStatus()}
                            >
                              Change
                            </div>
                            <div
                              className="p-2 btn-danger text-red-500 "
                              onClick={() => setUpdateMenu(!updateMenu)}
                            >
                              Cancle
                            </div>
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                      <div>
                        <div className="order_status_detail">
                          <div className="d-flex mb-7 ">
                            <div className="pr-3">
                              {data?.orderStatus >= 0 ? (
                                <IoMdDoneAll
                                  style={{ fontSize: "22px", color: "green" }}
                                />
                              ) : (
                                <MdPendingActions
                                  style={{ fontSize: "22px" }}
                                />
                              )}
                            </div>
                            <div>
                              <p>
                                <b>
                                  {" "}
                                  Order Placed{" "}
                                  {data?.createdAt && data?.orderStatus >= 0
                                    ? "-" +
                                      moment(data.createdAt).format(
                                        "dddd,Do MMMM YYYY"
                                      )
                                    : ""}{" "}
                                </b>
                                <br />

                                {data?.createdAt ? (
                                  <>
                                    <p>
                                      <small> An Order has been placed.</small>
                                    </p>
                                    <p className="text-gray-600">
                                      {moment(data.createdAt).format(
                                        "dddd,Do MMMM  YYYY,h:mm:ss a"
                                      )}
                                    </p>
                                  </>
                                ) : (
                                  ""
                                )}
                              </p>

                              <p>&nbsp;</p>
                            </div>
                          </div>
                          <div className="d-flex mb-7 ">
                            <div className="pr-3">
                              {data?.orderStatus >= 1 ? (
                                <IoMdDoneAll
                                  style={{ fontSize: "22px", color: "green" }}
                                />
                              ) : (
                                <MdPendingActions
                                  style={{ fontSize: "22px" }}
                                />
                              )}
                            </div>
                            <div>
                              <p>
                                <b>
                                  Processing
                                  {data?.packedDate && data?.orderStatus >= 1
                                    ? "-" +
                                      moment(data.packedDate).format(
                                        "dddd, Do MMMM YYYY"
                                      )
                                    : ""}
                                </b>
                              </p>
                              {data?.packedDate && data?.orderStatus >= 1 ? (
                                <>
                                  <br />
                                  <p>
                                    <small>Your Order Is Under Process</small>
                                  </p>
                                  <p className="text-gray-600">
                                    {data?.packedDate ? (
                                      <>
                                        <p className="text-gray-600">
                                          {moment(data.packedDate).format(
                                            "dddd,Do MMMM YYYY,h:mm:ss a"
                                          )}
                                        </p>
                                      </>
                                    ) : (
                                      ""
                                    )}
                                  </p>
                                </>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                          <div className="d-flex mb-7 ">
                            <div className="pr-3">
                              {data?.orderStatus >= 3 ? (
                                <IoMdDoneAll
                                  style={{ fontSize: "22px", color: "green" }}
                                />
                              ) : (
                                <MdPendingActions
                                  style={{ fontSize: "22px" }}
                                />
                              )}
                            </div>
                            <div>
                              <p>
                                <b>
                                  {" "}
                                  Shipping{" "}
                                  {data?.shippingDate && data?.orderStatus >= 3
                                    ? "-" +
                                      moment(data.shippingDate).format(
                                        "dddd, MMMM Do YYYY"
                                      )
                                    : ""}
                                </b>
                              </p>
                              <br />

                              {data?.shippingDate && data?.orderStatus >= 3 ? (
                                <>
                                  <p>
                                    <small> Your Order Is On The Way.</small>
                                  </p>

                                  <p className="text-gray-600">
                                    {moment(data.shippingDate).format(
                                      "dddd,Do MMMM YYYY,h:mm:ss a"
                                    )}
                                  </p>
                                </>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                          <div className="d-flex mb-7 ">
                            <div className="pr-3">
                              {data?.orderStatus >= 4 ? (
                                <IoMdDoneAll
                                  style={{ fontSize: "22px", color: "green" }}
                                />
                              ) : (
                                <MdPendingActions
                                  style={{ fontSize: "22px" }}
                                />
                              )}
                            </div>
                            <div>
                              <p>
                                <b>Delivered</b>
                              </p>
                              <br />

                              {data?.deliverdDate && data?.orderStatus >= 4 ? (
                                <>
                                  <p>
                                    <small>
                                      Your Order Is Delivered On &nbsp;
                                      {moment(data.deliverdDate).format(
                                        "dddd,Do MMMM YYYY,h:mm:ss a"
                                      )}
                                    </small>
                                  </p>
                                </>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                          <div className="d-flex mb-7 ">
                            <div className="pr-3">
                              {data?.orderStatus >= 5 ? (
                                <IoMdDoneAll
                                  style={{ fontSize: "22px", color: "green" }}
                                />
                              ) : (
                                <MdPendingActions
                                  style={{ fontSize: "22px" }}
                                />
                              )}
                            </div>
                            <div>
                              <p>
                                <b> Return In Progress</b>
                              </p>
                              <br />
                            </div>
                          </div>
                          <div className="d-flex mb-7 ">
                            <div className="pr-3">
                              {data?.orderStatus >= 6 ? (
                                <IoMdDoneAll
                                  style={{ fontSize: "22px", color: "green" }}
                                />
                              ) : (
                                <MdPendingActions
                                  style={{ fontSize: "22px" }}
                                />
                              )}
                            </div>
                            <div>
                              <p>
                                <b> Return</b>
                              </p>
                              <br />
                            </div>
                          </div>
                          <div
                            className="btn-primary p-2 "
                            style={{ width: "25%" }}
                            onClick={() => {
                              history.push("/orders");
                            }}
                          >
                            Go Back To Orders
                          </div>
                        </div>
                      </div>
                    </div>
                  )} */}
                </div>
              </div>
              <div class="col-4 ">
                <div className="wrapper_order_side">
                  <div className="w-100 p-2 card-1">
                    <div className="d-flex justify-content-between w-100 py-2  border-bottom border-light ">
                      <h4>Shop Details</h4>
                      <p>
                        <Link
                          to={`/retailer_detail?id=${data?.createdBy?._id}`}
                        >
                          {" "}
                          View Profile{" "}
                        </Link>
                      </p>
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
                        <span className="text-gray-800">
                          {data?.createdBy?.shopName}
                        </span>
                        <br />
                        <span className="text-gray-400">customer</span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="ml-8 text-gray-700">
                        {data?.createdBy?.email}
                      </p>
                      <p className="ml-8 text-gray-700">
                        {data?.createdBy?.phoneNumber}
                      </p>
                    </div>
                  </div>

                  <div className="w-100 card-1 p-2">
                    <div className="d-flex justify-content-between w-100 mb-2 py-2 border-bottom border-light">
                      <h4>Shipping Address</h4>
                    </div>
                    <p>{data?.addressId?.name}</p>
                    <p>
                      {data?.addressId?.storeNumber},{" "}
                      {data?.addressId?.addressLine}
                    </p>
                    <p>India-9086578</p>
                    <p>India</p>
                    <p>{data?.addressId?.mobile}</p>
                  </div>
                  <div className="w-100 card-1 p-2 payment_details">
                    <div className="d-flex justify-content-between w-100 mb-2 py-2 border-bottom border-light">
                      <h4>Payment Details Address</h4>
                    </div>
                    <div>
                      <span>Transaction:</span>&nbsp;
                      <span>#VFGHBF15874855</span>
                    </div>
                    <div>
                      <span>Payment Method:</span>&nbsp; <span>Offline</span>
                    </div>
                    <div>
                      <span>Total Amount:</span>&nbsp;
                      <span>{data?.total}</span>
                    </div>
                    <div>
                      <span>Received Amount:</span>&nbsp;
                      <span>
                        {receiveToggle ? (
                          <>
                            <input
                              type="number"
                              name="receiveAmount"
                              id="receiveAmount"
                              value={state_receive}
                              onChange={(e) => setState_receive(e.target.value)}
                              style={{ width: "8rem" }}
                            />{" "}
                            <span
                              className="btn btn-primary p-1"
                              onClick={handleReceiveChange}
                            >
                              Submit
                            </span>
                          </>
                        ) : (
                          <span>
                            {receivedAmount} &nbsp;
                            <span className="btn btn-primary p-1">
                              {" "}
                              <AiOutlineEdit
                                onClick={() => setReceiveToggle(!receiveToggle)}
                              />
                            </span>
                          </span>
                        )}
                      </span>
                    </div>
                    <div>
                      {!note ? (
                        <div
                          className="btn btn-primary p-2"
                          onClick={() => setToggleNote(!toggleNote)}
                        >
                          Add Note
                        </div>
                      ) : (
                        <>
                          <div>
                            <span>Note:</span> <span>{note}</span> &nbsp;
                            <span
                              className="btn btn-primary p-1"
                              onClick={() => {
                                setToggleNote(!toggleNote);
                                setNoteVal(note);
                              }}
                            >
                              Edit <AiOutlineEdit />{" "}
                            </span>
                          </div>{" "}
                        </>
                      )}
                      {toggleNote && (
                        <div>
                          <input
                            type="text"
                            name="note"
                            id="note"
                            placeholder="Add Note"
                            onChange={changeNote}
                            value={noteVal}
                          />{" "}
                          <span
                            className="btn btn-primary p-1"
                            onClick={handleSubmitNote}
                          >
                            Submit
                          </span>
                        </div>
                      )}
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
