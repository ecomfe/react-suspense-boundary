import styled from '@emotion/styled';
import {FaReact, FaGithub} from 'react-icons/fa';

const Layout = styled.header`
    display: flex;
    align-items: center;
    padding: 10px 40px 20px;
    box-shadow: 0 2px 8px #f1f1f1;
    margin-bottom: 20px;
    position: sticky;
    top: 0;
    z-index: 9;
    background-color: #fff;
`;

const Title = styled.h1`
    flex: 1;
    display: flex;
    margin: 0;
    align-items: center;
    font-size: 30px;
    font-weight: bold;
    color: #666;
`;

const Logo = styled(FaReact)`
    width: 30px;
    height: 30px;
    margin-right: 10px;
    color: #61dafb;
`;

const Link = styled.a`
    display: flex;
    align-items: center;
    font-size: 18px;
    color: #666;
`;

export default function Header() {
    return (
        <Layout>
            <Title>
                <Logo />
                React Suspense Boundary
            </Title>
            <nav>
                <Link href="https://github.com/ecomfe/react-suspense-boundary">
                    <FaGithub style={{marginRight: '.3em'}} />Github
                </Link>
            </nav>
        </Layout>
    );
}
