import { FC, HTMLProps } from "react";

type LayoutProps = HTMLProps<HTMLElement>;

const Layout: FC<LayoutProps> = ({ children, ...props }) => {
    return <article {...props}>{children}</article>;
};

export default Layout;
