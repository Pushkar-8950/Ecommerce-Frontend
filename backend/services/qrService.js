import QRCode from 'qrcode';

export const generateCertificateQR = async (certificateNumber) => {
  try {
    const frontendBase = process.env.FRONTEND_URL || 'http://localhost:5173';
    const verifyUrl = `${frontendBase}/verify/${certificateNumber}`;

    const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
      errorCorrectionLevel: 'H',
      margin: 1,
      width: 256,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    });

    return {
      qrDataUrl,
      verifyUrl,
    };
  } catch (error) {
    console.error('[QR Generation Error]', error);
    throw error;
  }
};
