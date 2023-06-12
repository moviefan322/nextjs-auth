import { Fragment } from "react";

import MainNavigation from "./main-navigation";

interface LayoutProps {
  children: JSX.Element;
}

function Layout({ children }: LayoutProps): JSX.Element {
  return (
    <Fragment>
      <MainNavigation />
      <main>{children}</main>
    </Fragment>
  );
}

export default Layout;
