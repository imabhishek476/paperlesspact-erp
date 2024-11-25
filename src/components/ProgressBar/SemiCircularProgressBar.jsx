// import React from 'react';
// import { CircularProgress, Typography,  } from '@mui/material';
// // import {makeStyles} from '@mui/styles'
// import { styled } from '@mui/material/styles';

// const useStyles = styled((theme) => ({
//   root: {
//     position: 'relative',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     height: 150,
//     width:350
//   },
//   overlay: {
//     position: 'absolute',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     width: '100%',
//     height: '100%',
//     transform:'rotate(22deg)',
//     clipPath: 'polygon(0% 0%, 100% 0%, 100% 50%, 0% 100%)',
//     backgroundColor: theme.palette.background.paper,
//   },
// }));

// const SemiCircularProgressBar = ({ value }) => {
//   const classes = useStyles();
  

//   return (
//     <div className={classes.root }>
//       <CircularProgress
//       className='rotate-[24deg]'
//         variant="determinate"
//         value={value}
//         size={200}
//         thickness={5.5}
//         style={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 50%, 0% 100%)'}}
//       />
//       <div className={classes.overlay}>
//         <Typography variant="h6">{`${value}%`}</Typography>
//       </div>
//     </div>
//   );
// };

// export default SemiCircularProgressBar;
import React from "react";
import { styled } from '@mui/material/styles';
import {CircularProgress} from "@nextui-org/react";
const useStyles = styled((theme) => ({
    root: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: 150,
      width:350
    },
    overlay: {
      position: 'absolute',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '100%',
      transform:'rotate(22deg)',
      clipPath: 'polygon(0% 0%, 100% 0%, 100% 50%, 0% 100%)',
      backgroundColor: theme.palette.background.paper,
    },
  }));
const  SemiCircularProgressBar= ({value})=> {
     const classes = useStyles();
  
  return (
    <div className={classes.root }>
  <CircularProgress
      label="Speed"
      size="lg"
      value={70}
      color="success"
      style={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 50%, 0% 100%)'}}
      formatOptions={{ style: "unit", unit: "kilometer" }}
      showValueLabel={true}
    />
    </div>
  
  );
}
export default SemiCircularProgressBar
