import axios from 'axios';
import config from '../config/config.js';

export const sendWhatsAppMessage = async (phone, message) => {
  try {
    const formattedPhone = phone.startsWith('+') ? phone.substring(1) : phone;

    const payload = {
      messaging_product: 'whatsapp',
      to: formattedPhone,
      type: 'text',
      text: {
        body: message,
      },
    };

    const response = await axios.post(
      `${config.whatsapp.apiUrl}/${config.whatsapp.phoneNumberId}/messages`,
      payload,
      {
        headers: {
          'Authorization': `Bearer ${config.whatsapp.apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('WhatsApp API error:', error.response?.data || error.message);
    throw new Error('Failed to send WhatsApp message');
  }
};