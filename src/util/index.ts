// function to convert string to number if its a valid number
export function convertToNumber(str: string | number) {
    const num = parseInt(str.toString(), 10);
    if (!num || isNaN(num)) {
        return false;
    }
    return num;
}

// return true if value is null or empty or undefined
export function checkIfEmpty(value: string) {
    if (value === undefined || value == null || /^\s*$/.test(value)) {
        return true;
    }
    return false;
}


// get current unix time stamp
export function getCurrentUnixTimeStamp() {
    return Math.floor(Date.now() / 1000)
}