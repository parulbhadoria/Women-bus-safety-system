import emailjs from "@emailjs/browser";

const SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID as string;
const TEMPLATE_ID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID as string;
const PUBLIC_KEY = process.env.REACT_APP_EMAILJS_PUBLIC_KEY as string;

export const sendSOSEmail = async (
  userName: string,
  busNumber: string,
  emergencyContactEmail: string,
  latitude: number,
  longitude: number
) : Promise<{ success: boolean }> => {
  const locationLink = `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=18/${latitude}/${longitude}`;
  const time = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  const templateParams = {
    to_email: emergencyContactEmail,
    user_name: userName,
    bus_number: busNumber,
    time,
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    location_link: locationLink,
  };
  try {
    await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
    return { success: true };
  } catch (error) {
    console.error("EmailJS error:", error);
    return { success: false };
  }
};

export const sendBoardingEmail = async (
  userName: string,
  busNumber: string,
  emergencyContactEmail: string,
  busLatitude: number,
  busLongitude: number
) : Promise<{ success: boolean }> => {
  const locationLink = `https://www.openstreetmap.org/?mlat=${busLatitude}&mlon=${busLongitude}#map=18/${busLatitude}/${busLongitude}`;
  const time = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  const templateParams = {
    to_email: emergencyContactEmail,
    user_name: userName,
    bus_number: busNumber,
    time,
    latitude: busLatitude.toString(),
    longitude: busLongitude.toString(),
    location_link: locationLink,
  };
  try {
    await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
    return { success: true };
  } catch (error) {
    console.error("EmailJS boarding email error:", error);
    return { success: false };
  }
};
