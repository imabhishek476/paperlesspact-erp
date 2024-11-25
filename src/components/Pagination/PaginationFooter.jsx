import React from 'react'
import Pagination from "@mui/material/Pagination";

const PaginationFooter = ({totalPages, setPageNumber}) => {
    return (
        <div>
          <Pagination
            count={totalPages}
            onChange={(e, value) => {
              console.log(value)
              setPageNumber(value)
            }}
          />
        </div>
      );
}

export default PaginationFooter
