import axios from "axios";
import { WHATSAPP_TOKEN, WHATSAPP_PHONE_ID } from "../config/whatsapp.js";

const API_BASE = "https://graph.facebook.com/v20.0";

export async function sendWhatsAppText(toNumber, message) {
  try {
    const url = `${API_BASE}/${WHATSAPP_PHONE_ID}/messages`;

    const data = {
      messaging_product: "whatsapp",
      to: toNumber, // must be in 91XXXXXXXXXX format
      type: "text",
      text: { body: message },
    };

    const res = await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    return res.data;
  } catch (err) {
    console.error("WhatsApp API Error:", err.response?.data || err.message);
    throw err;
  }
}
