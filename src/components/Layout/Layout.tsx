import { Box } from "@chakra-ui/react";
import { useGetLoginInfo } from "@elrondnetwork/dapp-core/hooks/account";
import { useGetAccountInfo } from "@elrondnetwork/dapp-core/hooks/account/useGetAccountInfo";
import Login from "components/Login/Login";

import { useAppSelector } from "hooks/useRedux";
import { ReactNode, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import {
  openLogin,
  selectIsLoginModal,
  setUserAddress,
} from "redux/dapp/dapp-slice";
import Navbar from "../Navbar/Navbar";
interface IProps {
  children: ReactNode | undefined;
}

const Layout = () => {
  const dispatch = useDispatch();
  const isLoginModal: boolean = useAppSelector(selectIsLoginModal);
  const { address } = useGetAccountInfo();

  const { isLoggedIn } = useGetLoginInfo();

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(openLogin(false));
    }
  }, [isLoggedIn, dispatch]);

  useEffect(() => {
    dispatch(
      setUserAddress(process.env.NEXT_PUBLIC_CONNECTED_ADDRESS || address)
    );
  }, [address, dispatch]);

  return (
    <Box pb="20">
      <Navbar />
      <Login isLoginOpen={isLoginModal} />
      <Outlet />
    </Box>
  );
};

export default Layout;
