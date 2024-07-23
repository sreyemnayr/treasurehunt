import { useEffect, useMemo, useState } from "react";
import { intlFormatDistance } from "date-fns";

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

export const Timer = ({ deadline = (new Date()).getMilliseconds() }) => {
    // const parsedDeadline = useMemo(() => Date.parse(deadline), [deadline]);
    const [time, setTime] = useState(deadline - Date.now());
    const [timeString, setTimeString] = useState('');

    useEffect(() => {
        const interval = setInterval(
            () => setTime(deadline - Date.now()),
            1000,
        );

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        setTimeString(intlFormatDistance(deadline, new Date()));
    }, [time]);

    return (
        
            <p>{timeString}</p>
        
    );
};

