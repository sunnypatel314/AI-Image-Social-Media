// 2024-05-26T21:39:58.079Z
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function dateConversion(dateString) {
  const year = dateString.slice(0, 4);
  const month = months[parseInt(dateString.slice(5, 7), 10) - 1];
  const day = dateString.slice(8, 10);

  const timeString = dateString.slice(11, 16);
  const hour =
    (parseInt(timeString.slice(0, 2), 10) % 12).toString() === "0"
      ? "12"
      : (parseInt(timeString.slice(0, 2), 10) % 12).toString();
  const minutes = timeString.slice(3, 5);
  const amOrPm = parseInt(timeString.slice(0, 2), 10) >= 12 ? "PM" : "AM";

  const timeToReturn = `${hour}:${minutes} ${amOrPm}`;
  return `${month} ${day}, ${year} ${timeToReturn}`;
}
