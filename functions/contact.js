require('dotenv').config();

exports.handler = (event, _context, callback) => {
  const mailgun = require('mailgun-js');
  const mg = mailgun({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN
  });

  const data = JSON.parse(event.body);

  const orderItems = []

  for (const orderItem in data.order){
    if(data.order[orderItem] > 0){
      orderItems.push(`${(orderItem.charAt(0).toUpperCase() + orderItem.slice(1)).split("_").join(" ")}: ${data.order[orderItem]}`)
    }
  }

  const price = data.price
  const tax = (data.price * 0.07)
  const total = (price + tax)
  

  const emailData = {
    from: `${data.name} <${data.email}>`,
    to: `Benjamin Winchester <benjamin.m.winchester@googlemail.com>`,
    subject: `Green Spork - Order Confirmation for ${data.name}`,
    text: `The following order has been sent by ${data.name} at ${data.email} / ${data.phone}.\n\n${orderItems.join("\n")}\n\nSpecial Instructions: ${data.specialInstructions}\n\nPrice: ${price.toFixed(2)}\nTax: ${tax.toFixed(2)}\nTotal: ${total.toFixed(2)}`
  };

  mg.messages().send(emailData, (error, body) => {
    if (error) {
      console.error(error);
      return;
    }

    callback(null, {
      statusCode: 200,
      body: JSON.stringify(body)
    });
  });
};
