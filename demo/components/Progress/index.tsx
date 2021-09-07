import {useResource} from 'react-suspense-boundary';

const timeout = (time: number) => new Promise(resolve => setTimeout(resolve, time));

const randomValue = (() => {
    // Make it error first
    const counter = {current: 0};

    return async () => {
        await timeout(1500);
        counter.current++;
        if (counter.current % 2 === 0) {
            return Math.floor(Math.random() * 100);
        }
        throw new Error('API Error');
    };
})();

export default function Progress() {
    const [progress] = useResource(randomValue, undefined);

    return (
        <>
            <div style={{display: 'flex', height: 60}}>
                <div style={{width: `${progress}%`, backgroundColor: '#ce4b99'}} />
                <div style={{flex: 1, backgroundColor: '#d2d3d4'}} />
            </div>
            <p style={{textAlign: 'center'}}>
                Already finished {progress}% of total work!
            </p>
        </>
    );
}
