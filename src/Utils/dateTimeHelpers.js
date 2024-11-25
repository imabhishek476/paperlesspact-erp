export function formatDate(dateString) {
    const monthNames = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ];
    const date = new Date(dateString);
    console.log(date,dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear().toString();
    return `${day} ${month} ${year}`;
  }
  export function formattedTime(timeString) {
    if (!timeString) {
      return "No time added";
    }
    var today = new Date(timeString);
    var hours = today.getHours();
    var minute = today.getMinutes();
    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours === 0 || hours === 12 ? 12 : hours % 12;
    const formattedMinutes = minute.toString().padStart(2,"0");
    // const timePart = timeString.split(":")[1];
    // const [hours, minutes,x] = timePart.split(":").map(Number);
    // const period = hours >= 12 ? "PM" : "AM";
    // const formattedHours = hours === 0 || hours === 12 ? 12 : hours % 12;
    // const formattedMinutes = x.toString().padStart(2,"0");
    return `${formattedHours}:${formattedMinutes} ${period}`;
  }

  export const getDayHelper = (dateString) =>{
    if(!dateString){
      return null;
    }
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, "0")}`;
} 

export function formatTimestamp(timestamp) {
  const now = new Date();
  const tsDate = new Date(timestamp);
  const diffInMilliseconds = now - tsDate;
  const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInDays >= 3) {
    return tsDate.toLocaleDateString();
  } else if (diffInDays > 0) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  } else if (diffInHours > 0) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  } else if (diffInMinutes > 0) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  } else {
    return `${diffInSeconds} second${diffInSeconds > 1 ? 's' : ''} ago`;
  }
}