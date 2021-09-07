import {CSSProperties} from 'react';
import ReactLoading from 'react-loading';

interface Props {
    style?: CSSProperties;
}

export default function Loading({style}: Props) {
    return (
        <div style={{display: 'flex', justifyContent: 'space-around', alignItems: 'center', minHeight: 240, ...style}}>
            <ReactLoading type="bubbles" width={120} height={120} color="#007cd2" />
        </div>
    );
}
