// function to convert string to number if its a valid number
export function convertToNumber(str: string | number) {
    const num = parseInt(str.toString(), 10);
    if (!num || isNaN(num)) {
        return false;
    }
    return num;
}