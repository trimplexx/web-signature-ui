import React, { useState, useEffect } from 'react';
import { Collapse, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { Link, NavLink as RRNavLink } from 'react-router-dom';
import './NavMenu.css';
import DarkModeToggle from './DarkModeToggle';
import axios from 'axios';
import ConnectionUrl from "../ConnectionUrl";
import {errorNotify, successNotifyStorage} from "../ToastNotifications";

const NavMenu = () => {
    const [collapsed, setCollapsed] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);


    useEffect(() => {
        const successNotificationContent = localStorage.getItem('successNotifyStorage');
        const errorNotificationContent = localStorage.getItem('errorNotification');
        if (successNotificationContent) {
            successNotifyStorage();
            localStorage.removeItem('successNotifyStorage');
        }
        if (errorNotificationContent) {
            errorNotify();
            localStorage.removeItem('errorNotification');
        }
    }, []);


    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.post(ConnectionUrl.connectionUrlString + 'api/Auth/VerifyToken', {
                Token: token
            })
                .then(response => {
                    setIsLoggedIn(true);
                })
                .catch(error => {
                    localStorage.setItem('errorNotification', 'Nastąpiło wylogowanie!');
                    localStorage.removeItem('token');
                    setIsLoggedIn(false);
                    window.location.reload(true);
                });
        }
    }, []);

    const toggleNavbar = () => {
        setCollapsed(!collapsed);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.setItem('errorNotification', 'Nastąpiło wylogowanie!');
        setIsLoggedIn(false);
        window.location.reload(true);
    };

    return (
        <header>
            <Navbar
                className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow dark:bg-gray-800"
                container
                light
            >
                <div className="navbar-brand dark:text-white" tag={Link} to="/">
                    <NavbarBrand className="dark:text-white" tag={Link} to="/">
                        WebSignature
                    </NavbarBrand>
                    <DarkModeToggle />
                </div>
                <NavbarToggler onClick={toggleNavbar} className="mr-2" />
                <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!collapsed} navbar>
                    <ul className="navbar-nav flex-grow justify-content-end dark:">
                        <NavItem>
                            <NavLink tag={RRNavLink} className="dark:text-white" exact to="/">
                                Home
                            </NavLink>
                        </NavItem>
                        {isLoggedIn ? (
                            <React.Fragment>
                                <UncontrolledDropdown nav inNavbar>
                                    <DropdownToggle nav caret>
                                        Funkcje
                                    </DropdownToggle>
                                    <DropdownMenu right>
                                        <DropdownItem>
                                            <Link to="/KeyGeneration">
                                                Generowanie kluczy
                                            </Link>
                                        </DropdownItem>
                                        <DropdownItem>
                                            <Link to="/DataEncryption">
                                                Szyfrowanie danych
                                            </Link>
                                        </DropdownItem>
                                        <DropdownItem>
                                            <Link to="/CreatingSignature">
                                                Tworzenie podpisu
                                            </Link>
                                        </DropdownItem>
                                        <DropdownItem>
                                            <Link to="/SignatureVerification">
                                                Weryfikacja podpisu
                                            </Link>
                                        </DropdownItem>
                                    </DropdownMenu>
                                </UncontrolledDropdown>
                                <NavItem>
                                    <NavLink
                                        tag={RRNavLink}
                                        className="dark:text-white"
                                        to="/Edit"
                                    >
                                        Moje dane
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink
                                        tag={RRNavLink}
                                        className="dark:text-white"
                                        to="/ChangePassword"
                                    >
                                        Zmiana hasła
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink
                                        tag={RRNavLink}
                                        className="dark:text-white"
                                        to="#"
                                        onClick={handleLogout}
                                    >
                                        Wyloguj
                                    </NavLink>
                                </NavItem>
                            </React.Fragment>
                        ) : (
                            <NavItem>
                                <NavLink
                                    tag={RRNavLink}
                                    className="dark:text-white"
                                    to="/login"
                                >
                                    Zaloguj się
                                </NavLink>
                            </NavItem>
                        )}
                    </ul>
                </Collapse>
            </Navbar>
        </header>
    );
};

export default NavMenu;