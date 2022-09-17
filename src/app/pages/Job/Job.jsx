import React, { useState } from "react";
import { Dropdown, Form, Modal, Pagination } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import { useHistory } from "react-router-dom";
import { toAbsoluteUrl } from "../../../_metronic/_helpers";
import SVG from "react-inlinesvg";
import { useEffect } from "react";
import { ErrorToast } from "../../../helpers/Toast";
import { ApiPost } from "../../../helpers/API/ApiData";

function Job() {
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const [modal, setModal] = useState(false);
  const [currentpage, setcurrentpage] = useState(1);
  const [pagesize, setpagesize] = useState(10);
  const [searchData, setsearchData] = React.useState([]);
  const [searching, setsearching] = useState("");
  const [status, setStatus] = useState("");
  const [data, setData] = useState([]);

  const columns = [
    {
      dataField: "title",
      text: "Title",
      sort: true,
    },
    {
      dataField: "user",
      text: "User Name",
      sort: true,
      formatter: (cell, row) => {
        return (
          <div>
            {row?.user[0]?.firstName} {row?.user[0]?.lastName}
          </div>
        );
      },
    },
    {
      dataField: "view",
      text: "view",
      headerStyle: {
        textAlign: "center",
      },
      formatter: () => {
        return (
          <div className="d-flex justify-content-center">
            <a title="Edit customer" className="btn btn-primary">
              View
            </a>
          </div>
        );
      },
    },
    {
      dataField: "action",
      text: "Action",
      headerStyle: {
        textAlign: "center",
      },
      formatter: () => {
        return (
          <div className="d-flex justify-content-center">
            <a
              title="Edit customer"
              className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3"
            >
              <span className="svg-icon svg-icon-md svg-icon-primary">
                <SVG
                  src={toAbsoluteUrl(
                    "/media/svg/icons/Communication/Write.svg"
                  )}
                />
              </span>
            </a>
            <a
              title="Delete customer"
              className="btn btn-icon btn-light btn-hover-danger btn-sm"
            >
              <span className="svg-icon svg-icon-md svg-icon-danger">
                <SVG
                  src={toAbsoluteUrl("/media/svg/icons/General/Trash.svg")}
                />
              </span>
            </a>
          </div>
        );
      },
    },
  ];
  //   const data = [
  //     {
  //       id: 1,
  //       title: "job1",
  //       name: "user1",
  //     },
  //     {
  //       id: 2,
  //       title: "job2",
  //       name: "user2",
  //     },
  //     {
  //       id: 3,
  //       title: "job3",
  //       name: "user3",
  //     },
  //   ];
  const fetchData = async (page, limit, bookingStatus, search) => {
    let body = {
      page,
      limit,
      // search,
    };
    await ApiPost("/job/get", body)
      .then((res) => {
        console.log("get_booking", res);
        setData(res.data?.data?.job_data);
        // settotalpage(res.data.data.state.page_limit);
        // setcurrentpage(res.data.data.state.page);
        // setpagesize(res.data.data.state.limit);
      })
      .catch(async (err) => {
        ErrorToast(err?.message);
      });
  };
  useEffect(() => {
    fetchData(currentpage, pagesize, status, searching);
  }, []);
  return (
    <>
      <div
        class="subheader py-2 py-lg-6  subheader-transparent "
        id="kt_subheader"
      >
        <div class=" container  d-flex align-items-center justify-content-between flex-wrap flex-sm-nowrap">
          <div class="d-flex align-items-center flex-wrap mr-1">
            <div class="d-flex align-items-baseline flex-wrap mr-5">
              <ul class="breadcrumb breadcrumb-transparent breadcrumb-dot font-weight-bold p-0 my-2 font-size-sm">
                <li class="breadcrumb-item">
                  <a
                    class="text-muted"
                    onClick={() => history.push("/dashboard")}
                  >
                    Home
                  </a>
                </li>
                <li class="breadcrumb-item">
                  <a class="text-muted">Job</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div
        class="content d-flex flex-column flex-column-fluid h-100"
        id="kt_content"
      >
        <div class="card card-custom">
          <div class="card-header flex-wrap border-0 pt-6 pb-0 w-100">
            <div class="card-title ">
              <h3 class="card-label">Job</h3>
            </div>
          </div>

          <div className={`card h-80  d-flex `}>
            {/* Body */}
            <div className=" card-body">
              <div class="mb-5">
                <div class="row align-items-center">
                  <div class="col-lg-12 col-xl-12">
                    <div class="row align-items-center">
                      <div class="col-md-3 my-2">
                        <div class="input-icon">
                          <input
                            type="text"
                            class="form-control"
                            name="searchText"
                            placeholder="Search by name"
                            id="kt_datatable_search_query"
                            // value={searching}
                            // onChange={(e) => handlesearch(e)}
                          />
                          <span>
                            <i class="flaticon2-search-1 text-muted"></i>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <BootstrapTable
                wrapperClasses="table-responsive"
                bordered={false}
                classes="table table-head-custom table-vertical-center overflow-hidden"
                bootstrap4
                // remote
                keyField="id"
                data={data}
                columns={columns}
                // pagination={paginationFactory(options)}
                // defaultSorted={defaultSorted}
                // noDataIndication={() => <NoDataTable />}
                // filter={filterFactory()}
                // headerClasses="header-class"
              />
              <div class="d-flex justify-content-between  pt-10">
                <div className="my-2">
                  <Pagination
                    // count={totalpage}
                    // page={currentpage}
                    // onChange={handleChange}
                    variant="outlined"
                    shape="rounded"
                    className="pagination_"
                  />
                </div>
                <div class="my-2">
                  <div class="d-flex align-items-center pagination-drpdown">
                    <select
                      class="form-control pagination-drpdown1 dropdownPage"
                      id="kt_datatable_search_status"
                      //   onChange={(e) => handleonchnagespagination(e)}
                      //   value={pagesize}
                    >
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={30}>30</option>
                      <option value={50}>50</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* {open && (
            <Post_Edit
              open={open}
              setOpen={setOpen}
              rowID={rowID}
              setRowID={setRowID}
              fetchDatas={fetchData}
              SetState={setState}
              currentpage={currentpage}
              pagesize={pagesize}
              state={state}
              searching={searching}
              sort={sort}
            />
          )} */}
          <Modal
            show={modal}
            centered
            onHide={() => setModal(!modal)}
            aria-labelledby="example-modal-sizes-title-lg"
          >
            <Modal.Header closeButton></Modal.Header>
            <Modal.Body>
              <span>
                Are you sure you want to delete this Post permanently?
              </span>
            </Modal.Body>
            <Modal.Footer>
              <div>
                <button
                  type="button"
                  onClick={() => setModal(!modal)}
                  className="btn btn-light btn-elevate"
                >
                  Cancel
                </button>
                <> </>
                <button
                  type="button"
                  //   onClick={() => deleteTheory(Id)}
                  className="btn btn-primary btn-elevate"
                >
                  Delete
                </button>
              </div>
            </Modal.Footer>
          </Modal>
          <Modal
            show={open}
            centered
            size="lg"
            // onHide={() => setOpen(!open)}
            aria-labelledby="example-modal-sizes-title-lg"
          >
            <Modal.Body>
              <div className="col-lg-12">
                <Form.Group md="12">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    type="textarea"
                    placeholder="Enter Message...."
                    label="message"
                    id="message"
                    required
                    name="message"
                    // value={rowID?.description}
                  />
                </Form.Group>
              </div>
              {/* {rowID?.bookingStatus === 4 && (
                <div className="col-lg-12">
                  <Form.Group md="12">
                    <Form.Label>Images</Form.Label>
                    <div className="grid-container">
                      {rowID?.image.map((img) => (
                        <div className="grid-item">
                          <img
                            className="rounded m-2"
                            width={"150px"}
                            height={"100px"}
                            src={img}
                          />
                        </div>
                      ))}
                    </div>
                  </Form.Group>
                </div>
              )} */}
            </Modal.Body>
            <Modal.Footer>
              <div>
                <button
                  type="button"
                  //   onClick={() => setOpen(!open)}
                  className="btn btn-light btn-elevate"
                >
                  Cancel
                </button>
                <> </>
              </div>
            </Modal.Footer>
          </Modal>
          {/* {open2 && <View_Post open2={open2} setOpen2={setOpen2} user={user} />} */}
        </div>
      </div>
    </>
  );
}

export default Job;
