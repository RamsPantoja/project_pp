import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles({
    root: {
        background: '#15639d',
        borderRadius: '1em',
        fontSize: '0.9em'
    }
})

const DropDownUser = ({userAuthEmail}) => {
    const styles = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    
    const handleClose = () => {
        setAnchorEl(null);
    };
    
    return (
        <div>
            <Button 
            aria-controls='simple-menu' 
            aria-haspopup='true' 
            size='small' 
            startIcon={<AccountCircle/>}
            classes={{root: styles.root}}
            onClick={handleClick}>{userAuthEmail}</Button>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}>
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>My account</MenuItem>
                <MenuItem onClick={handleClose}>Logout</MenuItem>
            </Menu>
        </div>
    )
}

export default DropDownUser;