export const formatTimestamp = (isoString: string) => {
    let date = new Date(isoString);

    if (isNaN(date.getTime())) {
        date = new Date();
    }
    return date.toLocaleTimeString(); 
};