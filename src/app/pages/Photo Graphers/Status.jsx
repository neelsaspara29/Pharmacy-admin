import React, { useState } from 'react'
import { Modal,Form } from 'react-bootstrap'

function Status({ updateMenu, setUpdateMenu, data,_id }) {
    console.log(_id)
    const [status, setStatus] = useState(["Placed", "Packed", "Shipped", "Delivering", "Delivered"]);
    const [latestStatus, setLatestStatus] = useState(-1);
    const handleChangeStatus = async (e) => {
        console.log(e.target.options[e.target.selectedIndex].dataset.id)
        setLatestStatus(e.target.options[e.target.selectedIndex].dataset.id+1);
    }
    const handleStatusSubmit = async () => {
    
        console.log(latestStatus)
      //   await ApiPost('/order/update', {
      //     orderId: user_id,
      //     status:latestStatus,
      //   })
      //   history.push({
      //     pathname: '/order',
      //     search: "?id=" + user_id
      //  })
        setUpdateMenu(!updateMenu);
    }
  return (
    <Modal
    show={updateMenu}
    centered
    size="lg"
    onHide={() => setUpdateMenu(!updateMenu)}
    aria-labelledby="example-modal-sizes-title-lg"
    contentClassName="modaldailog"
  >
    <Modal.Header closeButton>
      <Modal.Title id="example-modal-sizes-title-lg">
        Medicine Details
      </Modal.Title>
    </Modal.Header>
    <Modal.Body className="overlay overlay-block cursor-default">
    <div className="row justify-content-between">
        <div className="col-6">
                                <Form.Label>From::</Form.Label>
                <Form.Group>
                  <Form.Control
                    as="text"
                    placeholder="select category"
                  >
                    {data?.orderStatus==1?"Placed":data?.orderStatus==2?"Packed":data?.orderStatus==3?"Shipped":data?.orderStatus==4?"Delivering":""}
                  </Form.Control>
                </Form.Group>
              </div>
              <div className="col-6">
              <Form.Group>
                  <Form.Label>To</Form.Label>
                  <Form.Control
                    as="select"
                    placeholder="Change Status"
                    onChange={handleChangeStatus}
                  >
                    <option>Select Status</option>
                    {status?.map(( data,idx) => (
                      <option data-id={idx}>{data}</option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </div>
            </div>
    </Modal.Body>
    <Modal.Footer>
      <div className="d-flex justify-content-between w-100 ">
      
        <div>
          <button
            type="button"
            
            className="btn btn-light btn-elevate mr-2"
          >
            CANCEL
          </button>

         
            <button
              onClick={handleStatusSubmit}
              className="btn btn-primary btn-elevate"
            >
              CHANGE
            </button>
          
        </div>
      </div>
    </Modal.Footer>
    </Modal>
  )
}

export default Status