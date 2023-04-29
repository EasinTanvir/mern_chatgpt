import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import StorageIcon from "@mui/icons-material/Storage";
import { useDispatch, useSelector } from "react-redux";
import PersonIcon from "@mui/icons-material/Person";
import { Button as Buttons } from "react-bootstrap";
import { Menu, MenuButton, MenuList, MenuItem, Button } from "@chakra-ui/react";
import { Log_Out } from "../store/actions";

const Navbars = () => {
  const [small, setSmaill] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const logOutHandler = () => {
    dispatch(Log_Out());
  };

  const checkScreenSize = () => {
    setSmaill(window.innerWidth < 992);
  };

  useEffect(() => {
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);
  return (
    <div className="headers">
      <div className="containers">
        <div className="logo">
          {small && (
            <div className="extra">
              <nav className="my-navs">
                <ul>
                  <div className="menu">
                    <div className="ui simple dropdown item">
                      <StorageIcon
                        style={{ fontSize: "23px" }}
                        className="my-icon"
                      />

                      <div className="menu">
                        <div className="item ">
                          <Link to="/" className="active">
                            <li>Chat</li>
                          </Link>
                        </div>
                        <div className="item ">
                          <Link to="/pricing">
                            <li>Pricing</li>
                          </Link>
                        </div>
                        <div className="item ">
                          <Link to="/terms">
                            <li>Terms</li>
                          </Link>
                        </div>
                        <div className="item">
                          <Link to="/policy">
                            <li>Policy</li>
                          </Link>
                        </div>
                        <div className="item">
                          <Link to="/contract">
                            <li>Contract</li>
                          </Link>
                        </div>
                        <div className="item">
                          <Link to="/twitter">
                            <li>Twitter</li>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </ul>
              </nav>
            </div>
          )}

          <div className="logo-main">
            <img src="/test.png" alt="" />
            <h4>DR.MEGA</h4>
          </div>
        </div>
        <div className="list-items">
          {!small && (
            <ul>
              <li>
                <Link className="active" to="/">
                  Chat
                </Link>
              </li>
              <li>
                <Link bas to="/pricing">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/terms"> Terms</Link>
              </li>
              <li>
                <Link to="/policy"> Policy</Link>
              </li>
              <li>
                <Link to="/coontract"> Contracts</Link>
              </li>
              <li>
                <Link to="/twitter"> Twitter</Link>
              </li>
            </ul>
          )}
          {user.token ? (
            <div className="chakra">
              <Menu>
                <MenuButton as={Button} colorScheme="white">
                  <div
                    style={{ backgroundColor: "#0080ff" }}
                    className="ellepse"
                  >
                    <PersonIcon />
                  </div>
                </MenuButton>
                <MenuList>
                  <Button
                    style={{ color: "gray" }}
                    variant="secondary"
                    disabled={true}
                  >
                    {user.email}
                  </Button>
                  <MenuItem minH="40px">
                    <Link to="/">Manage Billing</Link>
                  </MenuItem>
                  <MenuItem minH="40px">
                    <Buttons onClick={logOutHandler} className="w-100">
                      LogOut
                    </Buttons>
                  </MenuItem>
                </MenuList>
              </Menu>
            </div>
          ) : (
            <div className="btns">
              <Link to="/login">
                <button>LOGIN / SIGNUP</button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbars;
