import Navbars from "./Navbars";
import { ChakraProvider } from "@chakra-ui/react";

const Layout = ({ children }) => {
  return (
    <div className="mains">
      <ChakraProvider>
        <Navbars />
      </ChakraProvider>
      <main>{children}</main>
    </div>
  );
};

export default Layout;
