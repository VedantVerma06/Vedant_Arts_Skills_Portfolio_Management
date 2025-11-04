// utils/emailTemplates.js

/**
 * Base email wrapper – gives all emails a consistent, branded look
 */
const baseTemplate = (title, body) => `
  <html>
    <head>
      <style>
        body {
          font-family: 'Segoe UI', sans-serif;
          background-color: #f6f6f6;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          overflow: hidden;
        }
        .header {
          background: linear-gradient(90deg, #222831, #393E46);
          color: white;
          text-align: center;
          padding: 20px;
          font-size: 22px;
          font-weight: 600;
        }
        .content {
          padding: 24px;
          font-size: 16px;
          color: #333;
          line-height: 1.6;
        }
        .footer {
          text-align: center;
          padding: 12px;
          font-size: 13px;
          color: #777;
        }
        a.button {
          display: inline-block;
          background: #00ADB5;
          color: #fff;
          padding: 10px 18px;
          border-radius: 6px;
          text-decoration: none;
          margin-top: 16px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">${title}</div>
        <div class="content">${body}</div>
        <div class="footer">© ${new Date().getFullYear()} Vedant Verma | Artworks</div>
      </div>
    </body>
  </html>
`;

/**
 * Order Accepted Email
 */
exports.orderAccepted = (userName, reason) =>
  baseTemplate(
    "Your Art Commission Has Been Accepted 🎨",
    `
      <p>Dear ${userName},</p>
      <p>Good news! Your commission request has been <strong>accepted</strong> by Vedant Verma.</p>
      <p>${reason ? `<em>Note from the artist:</em> ${reason}` : ""}</p>
      <p>You'll receive updates as the work progresses.</p>
    `
  );

/**
 * Order Rejected Email
 */
exports.orderRejected = (userName, reason) =>
  baseTemplate(
    "Your Commission Request Was Not Accepted 😔",
    `
      <p>Dear ${userName},</p>
      <p>We regret to inform you that your commission request was <strong>rejected</strong>.</p>
      <p>${reason ? `<em>Reason:</em> ${reason}` : ""}</p>
      <p>We truly appreciate your interest in Vedant Verma’s artwork.</p>
    `
  );

/**
 * Order Completed Email
 */
exports.orderCompleted = (userName) =>
  baseTemplate(
    "Your Artwork is Complete! 🖌️",
    `
      <p>Dear ${userName},</p>
      <p>Your commissioned artwork is now <strong>complete</strong>! 🖼️</p>
      <p>Thank you for trusting Vedant Verma for your art needs.</p>
    `
  );

/**
 * Order Cancelled Email
 */
exports.orderCancelled = (userName, reason) =>
  baseTemplate(
    "Your Order Has Been Cancelled ❌",
    `
      <p>Dear ${userName},</p>
      <p>Your order has been <strong>cancelled</strong>.</p>
      <p>${reason ? `<em>Reason:</em> ${reason}` : ""}</p>
      <p>If you have any questions, feel free to reach out to us.</p>
    `
  );
