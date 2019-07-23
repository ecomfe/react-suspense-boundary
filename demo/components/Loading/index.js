import Loading from 'react-loading';

export default () => (
    <div style={{display: 'flex', justifyContent: 'space-around', alignItems: 'center', minHeight: 400}}>
        <Loading type="bubbles" width={120} height={120} color="#007cd2" />
    </div>
);
