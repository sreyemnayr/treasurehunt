import { useEffect, useMemo, useState } from "react";
import { intlFormatDistance, format, addDays } from "date-fns";

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

export const Timer = ({ deadline = (new Date()).getMilliseconds(), className = "" }) => {
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
        const ts = intlFormatDistance(deadline, addDays(new Date(), 2), {style: 'narrow'})

        if (ts.includes("yesterday")) {
            setTimeString(`${format(deadline, "h':'mm")} yesterday`);
            
        } else if(ts.includes("d ago")){
            setTimeString(`${format(deadline, `h':'mm BBBBB EEEE`)}`);
        } else {
            
                setTimeString(ts)
            
        }

        

    }, [time]);

    return (
        
            <div className={className}>{timeString}</div>
        
    );
};

