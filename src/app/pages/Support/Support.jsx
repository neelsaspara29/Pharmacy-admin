import React, { useEffect, useState } from "react";
import { ApiGet, ApiGet_admin } from "../../../helpers/API/ApiData";
import "../../../_metronic/_assets/sass/pages/Support/index.scss";
import IndividualChat from "./IndividualChat";

function Support() {
  const [pop, setPop] = useState(false);
  const [chatlistdata, setChatlistdata] = useState([]);
  const [data, setdata] = useState({
    senderId: "",
    roomId: "",
    client_name: "",
    client_profile_image: "",
  });

  const getRoom = async () => {
    try {
      let obj = await ApiGet_admin("user/room");
      let data = obj?.data?.data;
      setChatlistdata(data);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getRoom();
  }, []);

  return (
    <>
      <div
        class="content  d-flex flex-column flex-column-fluid"
        id="kt_content"
        style={{ height: "750px" }}
      >
        <div className="d-flex flex-column-fluid">
          <div className=" container main ">
            <div className="d-flex flex-row">
              <div
                className="flex-row-auto offcanvas-mobile w-350px w-xl-400px sidebar"
                id="kt_chat_aside"
              >
                <div className="card card-custom" style={{ height: "750px" }}>
                  <div className="card-body" style={{ padding: "1em 2.25em" }}>
                    <div className="input-group input-group-solid">
                      <div className="input-group-prepend">
                        <span className="input-group-text"></span>
                      </div>
                    </div>

                    <div className="mt-7 scroll scroll-pull">
                      {chatlistdata.map((data) => {
                        return (
                          <div className="d-flex align-items-center justify-content-between mb-7">
                            <div className="d-flex align-items-center">
                              <div className="symbol symbol-circle symbol-50 mr-3">
                                {data.user.profile_image ? (
                                  <img
                                    alt="Pic"
                                    src={data.user.profile_image}
                                    style={{ width: "50px" }}
                                  />
                                ) : (
                                  <div class="profile">
                                    <span>{data.user.firstName[0]}</span>
                                  </div>
                                )}
                              </div>
                              <div
                                className="d-flex flex-column"
                                style={{
                                  textTransform: "capitalize",
                                  fontSize: "14px",
                                }}
                                onClick={() => {
                                  setdata({
                                    senderId: data?.user?._id,
                                    roomId: data._id,
                                    client_name:
                                      data.user.firstName +
                                      " " +
                                      data.user.lastName,
                                    client_profile_image:
                                      data?.user?.profile_image,
                                  });
                                  setPop(true);
                                }}
                              >
                                {data.user.firstName} {data.user.lastName}
                                <span className="text-muted font-weight-bold font-size-sm">
                                  User of HealthSarv
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* <---       Dummy ChatArea  -----> */}
              {!pop && (
                <div
                  class="flex-row-fluid ml-lg-8 chat_field"
                  id="kt_chat_content"
                >
                  <div class="card card-custom" style={{ height: "80vh" }}>
                    <div class="card-header align-items-center px-4 py-3">
                      <div class="text-left flex-grow-1">
                        <button
                          type="button"
                          class="btn btn-clean btn-sm btn-icon btn-icon-md d-lg-none"
                          id="kt_app_chat_toggle"
                        ></button>
                      </div>

                      <div class="text-right flex-grow-1">
                        <div class="dropdown dropdown-inline">
                          <button
                            type="button"
                            class="btn btn-clean btn-sm btn-icon btn-icon-md"
                            data-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="false"
                          ></button>
                        </div>
                      </div>
                    </div>

                    <div class="card-body">
                      <div
                        class="scroll scroll-pull"
                        data-mobile-height="350"
                        id="scrolltop"
                      >
                        <div class="messages" id="show_old_data"></div>
                        <div className="messages" id="appendhear"></div>
                      </div>
                    </div>

                    <div class="card-footer align-items-center send_box">
                      <textarea
                        class="form-control border-0 p-0"
                        rows="2"
                        placeholder="Type a message"
                      ></textarea>
                      <div class="d-flex align-items-center justify-content-between mt-5">
                        <div class="mr-3">
                          <a
                            href="#"
                            class="btn btn-clean btn-icon btn-md mr-1"
                          >
                            <i class="flaticon2-photograph icon-lg"></i>
                          </a>
                          <a href="#" class="btn btn-clean btn-icon btn-md">
                            <i class="flaticon2-photo-camera  icon-lg"></i>
                          </a>
                        </div>
                        <div>
                          <button
                            type="button"
                            class="btn btn-primary btn-md text-uppercase font-weight-bold chat-send py-2 px-6"
                          >
                            Send
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* <---       Original ChatArea  -----> */}
              {pop && data && <IndividualChat props={data} />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Support;
