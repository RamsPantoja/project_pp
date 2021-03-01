import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { signOut } from 'next-auth/client'
import styles from './styles/DropDownUser.module.css';
import MenuIcon from '@material-ui/icons/Menu';
import { useRouter } from 'next/router';

const DropDownUser = ({userAuthEmail}) => {
    const router = useRouter();
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
            <div className={styles.displayButtonNoMovil}>
                <Button 
                aria-controls='simple-menu' 
                aria-haspopup='true' 
                size='small'
                startIcon={<AccountCircle/>}
                onClick={handleClick}>{userAuthEmail}</Button>
            </div>
            <div className={styles.displayButtonInMovil}>
                <Button 
                aria-controls='simple-menu' 
                aria-haspopup='true' 
                size='small'
                startIcon={<MenuIcon/>}
                className={styles.displayButton}
                onClick={handleClick}>Menu</Button>
            </div>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}>
                <MenuItem onClick={() => router.push(`/account/profile`, undefined, {shallow: true})}>Cuenta</MenuItem>
                <MenuItem onClick={handleSignOut}>Cerrar sesión</MenuItem>
            </Menu>
        </div>
    )
}

export default DropDownUser;