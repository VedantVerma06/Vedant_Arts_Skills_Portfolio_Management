// utils/emailTemplates.js

/**
 * Generic HTML email wrapper
 */
const baseTemplate = (title, message, footerNote = "") => `
  <div style="font-family: 'Segoe UI', sans-serif; background-color: #f4f4f4; padding: 40px;">
    <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
      
      <div style="background: linear-gradient(90deg, #000000, #444444); color: white; padding: 20px 40px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">🎨 Vedant Verma Art</h1>
        <p style="margin: 0; font-size: 14px; opacity: 0.9;">Custom Artwork • Portraits • Sketches</p>
      </div>

      <div style="padding: 30px 40px; color: #333;">
        <h2 style="font-size: 22px; color: #000;">${title}</h2>
        <p style="font-size: 16px; line-height: 1.6; margin-top: 10px;">${message}</p>
      </div>

      <div style="background: #f8f8f8; padding: 20px; text-align: center; font-size: 13px; color: #666;">
        <p>${footerNote}</p>
        <p style="margin-top: 10px;">© ${new Date().getFullYear()} Vedant Verma Art</p>
      </div>

    </div>
  </div>
`;

/**
 * Order Accepted Email
 */
exports.orderAccepted = (username, note = "") => {
  const message = `
    Hi ${username},<br><br>
    Great news! Your art commission has been <b>accepted</b> by Vedant Verma 🎨.<br><br>
    ${note ? `<b>Note from Vedant:</b> ${note}<br><br>` : ""}
    You’ll be notified again once your artwork starts and progresses.<br><br>
    Thank you for trusting my art journey! ✨
  `;
  return baseTemplate("Your Order Has Been Accepted ✅", message, "You can view your order updates anytime on the website under 'My Orders'.");
};

/**
 * Order Rejected Email
 */
exports.orderRejected = (username, reason = "No reason specified") => {
  const message = `
    Hi ${username},<br><br>
    Unfortunately, your art commission request has been <b>rejected</b> ❌.<br><br>
    <b>Reason:</b> ${reason}<br><br>
    Please feel free to reach out again with another concept in the future.
  `;
  return baseTemplate("Your Order Has Been Rejected ❌", message, "We appreciate your interest in Vedant Verma Art.");
};

/**
 * Order In Progress Email
 */
exports.orderInProgress = (username) => {
  const message = `
    Hi ${username},<br><br>
    Exciting update! Vedant has started working on your artwork 🖌️.<br><br>
    You’ll receive another email once the artwork is completed.<br><br>
    Thank you for your patience and support!
  `;
  return baseTemplate("Your Artwork Is In Progress 🖌️", message, "Track your order under 'My Orders' anytime.");
};

/**
 * Order Completed Email
 */
exports.orderCompleted = (username) => {
  const message = `
    Hi ${username},<br><br>
    Great news! Your commissioned artwork is now <b>complete</b> 🎉.<br><br>
    Vedant will contact you shortly regarding delivery or pickup details.<br><br>
    Hope you enjoy your personalized artwork as much as I enjoyed creating it!
  `;
  return baseTemplate("Your Artwork Is Complete ✅", message, "Thank you for being part of my artistic journey 💖.");
};

/**
 * Order Cancelled Email
 */
exports.orderCancelled = (username, reason = "No reason specified") => {
  const message = `
    Hi ${username},<br><br>
    Your order has been <b>cancelled</b> 🚫.<br><br>
    <b>Reason:</b> ${reason}<br><br>
    If this was unintentional, please feel free to place a new order anytime.
  `;
  return baseTemplate("Your Order Has Been Cancelled 🚫", message, "We hope to create something for you soon!");
};
