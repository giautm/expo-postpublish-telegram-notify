module.exports = ({ url, iosManifest, config }) => {
  const { botToken, chatIds } = config;
  const fetch = require('node-fetch');

  return Promise.all((chatIds || []).map((chatId) => {
    return fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: `${iosManifest.name} v${iosManifest.version} published to ${url}`,
      }),
    }).then((response) => response.json()).then((data) => {
      if (data.ok) {
        return data.result;
      } else {
        return Promise.reject(
          new Error(`${data.error_code} - ${data.description}`));
      }
    });
  })).then(() => 'Posted notification to Telegram!');
};
