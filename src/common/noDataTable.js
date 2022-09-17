import React from 'react'
import img from "../media/No data-bro.svg"


const NoDataTable = () => {
    return (
        <div>
            {/* <h5>no more data</h5> */}
            <img src={img} style={{ width: "100%", height: "500px" }} alt="No Data" />
        </div>
    )
}

export default NoDataTable