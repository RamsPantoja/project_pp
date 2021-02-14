import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { signOut } from 'next-auth/client'

const DropDownUser = ({userAuthEmail}) => {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    
    const handleSignOut = () => {
        setAnchorEl(null);
        signOut({callbackUrl:'http://localhost:3000/'});
    };
    
    const handleClose = () => {
        setAnchorEl(null);
    }

    return (
        <div>
            <Button 
            aria-controls='simple-menu' 
            aria-haspopup='true' 
            size='small'
            startIcon={<AccountCircle/>}
            onClick={handleClick}>{userAuthEmail}</Button>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}>
                <MenuItem>Cuenta</MenuItem>
                <MenuItem onClick={handleSignOut}>Cerrar sesión</MenuItem>
            </Menu>
        </div>
    )
}

export default DropDownUser;