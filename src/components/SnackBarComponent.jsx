import { selectSnackState, selectSnackMessage, selectSnackStatus, closeSnackBar } from "../redux/snackBarReducer";
import Snackbar from '@material-ui/core/Snackbar'
import MuiAlert from '@material-ui/lab/Alert'
import React from 'react'
import { useDispatch, useSelector } from "react-redux";


const Alert = (props) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />
}

const SnackBarComponent = () => {
    const dispatch = useDispatch();

    const opened = useSelector(selectSnackState);
    const status = useSelector(selectSnackStatus);
    const message = useSelector(selectSnackMessage);

    const handleClose = () => {
        dispatch(closeSnackBar());
    }

    return (
        <Snackbar open={opened} autoHideDuration={6000} onClose={handleClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
            <Alert onClose={handleClose} severity={status} sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
    )
}

export default SnackBarComponent
