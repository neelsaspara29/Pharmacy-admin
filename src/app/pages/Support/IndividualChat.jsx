import React, {  useEffect, useState } from "react";
import { ApiGet, ApiGet_admin } from "../../../helpers/API/ApiData";
import { append_child } from "./handleFunction";
import { io } from "socket.io-client";

let socket;

function IndividualChat({ props }) {

  //all state defination start hear
  const [massage, setMessage] = useState("");
  const [chatMassage, setChatMassage] = useState([]);
  //state defination over hear

  //globle data for componenrt
  let admin_data = JSON.parse(localStorage.getItem("userinfo"));
  //globle data end




  ///SUPPORTIVE FUNCTIO0N START HEAR

  const handlesend = (massage) => {
    if (massage) {
      append_child( "admin", "Admin", massage, "");
      setMessage("");
      socket.emit(`send_message`, {
        roomId: props.roomId,
        senderId: admin_data._id,
        receiverId: props.senderId,
        message: massage,
      });
      var div = document.getElementById(`kt_chat_content`);
      div.scrollTop = div.scrollHeight;
    }
  };

  const getChat = async (id) => {
    let object = await ApiGet_admin(`user/message?roomId=${id}`);
    object.data.data.reverse();
    var div = document.getElementById(`appendhear`);
    if (div) {
      div.innerHTML = "";
    }

    setChatMassage(object.data.data);
  };
  ///SUPPORTIVE FUNCTION END HEAR



  //// ALL USEFFECT FUNCTION START HEAR
  useEffect(() => {
    socket  = (io("https://api.elpixie.com/"));
    return () => {
      socket.disconnect()
    }
  }, [props.senderId]);

  useEffect(() => {
    getChat(props.roomId);
  }, [props.senderId]);

  useEffect(() => {
    var div = document.getElementById(`kt_chat_content`);
    div.scrollTop = div.scrollHeight;
  }, [chatMassage]);

  useEffect(() => {
    socket && socket.emit("join_room", {
        roomId: props.roomId,
        userid: admin_data._id,
        receiverId: props.senderId,
      });
    socket && socket.on("receive_message", (data) => {
        if (data.senderId != admin_data._id) {
          append_child( "client", props.client_name, data.message, props.client_profile_image);
          var div = document.getElementById(`kt_chat_content`);
          div && (div.scrollTop = div.scrollHeight);
        }
      });
  }, [props.senderId]);
 //// ALL USEFFECT FUNCTION Ed HEAR
  

  return (
    <>
      {props.senderId && (
        <div
          class="flex-row-fluid ml-lg-8 chat_field"
          id={`kt_chat_content`}
        >
          <div class="card card-custom">
            <div class="card-header align-items-center px-4 py-3">
              <div class="text-left flex-grow-1">
                <div class="dropdown dropdown-inline"></div>
              </div>
              <div class="text-center flex-grow-1">
                <div class="text-dark-75 font-weight-bold font-size-h5">
                  {props.client_name}
                </div>
                <div></div>
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
                <div class="messages" id="show_old_data">
                  {chatMassage?.length &&
                    chatMassage.map((data) => {
                      if (data.receiverId == admin_data._id) {
                        return (
                          <div class="d-flex flex-column mb-5 align-items-start">
                            <div class="d-flex align-items-center">
                              <div class="symbol symbol-circle symbol-40 mr-3">
                                {props.client_profile_image ? (
                                  <img
                                    alt="Pic"
                                    src={props.client_profile_image}
                                    style={{ width: "50px" }}
                                  />
                                ) : (
                                  <div class="profile">
                                    <span>{props.client_name[0]}</span>
                                  </div>
                                )}
                              </div>
                              <div>{props.client_name}</div>
                            </div>
                            <div class="mt-2 rounded p-5 bg-light-success text-dark-50 font-weight-bold font-size-lg text-left max-w-400px">
                              {data.message}
                            </div>
                          </div>
                        );
                      } else {
                        return (
                          <div class="d-flex flex-column mb-5 align-items-end">
                            <div class="d-flex align-items-center">
                              <div>You</div>
                              <div class="symbol symbol-circle symbol-40 ml-3">
                                <div class="profile">
                                  <span>A</span>
                                </div>
                              </div>
                            </div>
                            <div class="mt-2 rounded p-5 bg-light-primary text-dark-50 font-weight-bold font-size-lg text-right max-w-400px">
                              {data.message}
                            </div>
                          </div>
                        );
                      }
                    })}
                </div>
                <div
                  className="messages"
                  id={`appendhear`}
                ></div>
              </div>
            </div>

            <div class="card-footer align-items-center send_box">
              <textarea
                class="form-control border-0 p-0"
                rows="2"
                placeholder="Type a message"
                value={massage}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key == "Enter") handlesend(massage);
                }}
              ></textarea>
              <div class="d-flex align-items-center justify-content-between mt-5">
                <div class="mr-3">
                  <a href="#" class="btn btn-clean btn-icon btn-md mr-1">
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
                    onClick={() => handlesend(massage)}
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default IndividualChat;
