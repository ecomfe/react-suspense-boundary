import {ComponentProps, ReactNode} from 'react';
import {NavLink} from 'react-router-dom';
import styled from '@emotion/styled';
import {css} from '@emotion/css';
import {FaExternalLinkAlt} from 'react-icons/fa';

const linkClassName = css`
    display: flex;
    align-items: center;
    font-size: 16px;
    padding: 0 20px;
    line-height: 3;

    &:hover {
        background-color: #b4d7ff;
        color: #333;
    }
`;

const linkActiveClassName = css`
    background-color: #007cd2;
    color: #fff;
`;

const dynamicLinkClassName = ({isActive}: {isActive: boolean}) => {
    return `${linkClassName} ${isActive ? linkActiveClassName : ''}`;
};

interface Props extends ComponentProps<typeof NavLink> {
    external?: boolean;
}

function NavItem(props: Props) {
    return <NavLink className={dynamicLinkClassName} {...props} />;
}

const ExternalHint = styled(FaExternalLinkAlt)`
    width: 12px;
    height: 12px;
    margin-left: 4px;
`;

interface ExternalProps {
    to: string;
    children: ReactNode;
}

NavItem.External = function ExternalNavItem({to, children}: ExternalProps) {
    return (
        <a
            className={linkClassName}
            target="_blank"
            rel="noopener noreferrer"
            href={to}
        >
            {children}
            <ExternalHint />
        </a>
    );
};

export default NavItem;
