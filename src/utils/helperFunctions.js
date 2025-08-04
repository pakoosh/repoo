export const convertUtcToLocal = (data) => {
    const date = new Date(data);

    const day = String(date.getDate()).padStart(2, '0');

    // Array of month names to get MMM format
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthIndex = date.getMonth();
    const month = monthNames[monthIndex];

    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    // Get AM/PM format
    const amPM = hours >= 12 ? 'PM' : 'AM';

    // Convert hours to 12-hour format
    const hours12 = hours % 12 || 12; // Handle midnight (0 hours)

    const item = `${day}-${month}-${year} ${hours12}:${minutes}:${seconds} ${amPM}`;

    return item;
};

export function formatDate(timestamp) {
    // Create a Date object from the timestamp
    let date = new Date(timestamp);

    // Extract UTC components
    let day = String(date.getUTCDate()).padStart(2, '0');
    let month = date.toLocaleString('default', { month: 'short' });
    let year = date.getUTCFullYear();
    let hours = String(date.getUTCHours()).padStart(2, '0');
    let minutes = String(date.getUTCMinutes()).padStart(2, '0');
    let seconds = String(date.getUTCSeconds()).padStart(2, '0');

    // Determine AM/PM
    let period = hours >= 12 ? 'PM' : 'AM';
    if (hours > 12) hours -= 12;  // Convert to 12-hour format
    if (hours === 0) hours = 12;  // Midnight hour case

    // Format the final string
    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds} ${period}`;
}

export function camelToSentenceCase(str) {
    // Add a space before each uppercase letter except the first one
    const result = str.replace(/([A-Z])/g, ' $1');
    // Convert the entire string to lowercase and then capitalize the first letter
    return result.charAt(0).toUpperCase() + result.slice(1).toLowerCase();
}


export const formattedDate = (rawDate) => {
    if (rawDate == null) return '';

    const date = new Date(rawDate);
    if (isNaN(date.getTime())) return ''; // Checks if the date is invalid

    return date.toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
    });
}
