import { Webhook } from 'svix';
import User from '../models/User.js';

export const clerkWebhooks = async (req, res) => {
  console.log('📩 Clerk Webhook Triggered');

  try {
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    await whook.verify(req.body, {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"]
    });

    const bodyString = Buffer.isBuffer(req.body) ? req.body.toString() : JSON.stringify(req.body);
    const { data, type } = JSON.parse(bodyString);

    console.log(`📦 Webhook Type: ${type}`);

    switch (type) {
      case 'user.created': {
        await User.create({
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: `${data.first_name} ${data.last_name}`,
          imageUrl: data.image_url
        });
        console.log("✅ User created:", data.id);
        return res.status(200).json({ success: true });
      }

      case 'user.updated': {
        await User.findByIdAndUpdate(
          data.id,
          {
            email: data.email_addresses[0].email_address,
            name: `${data.first_name} ${data.last_name}`,
            imageUrl: data.image_url
          },
          { new: true }
        );
        console.log("✅ User updated:", data.id);
        return res.status(200).json({ success: true });
      }

      case 'user.deleted': {
        await User.findByIdAndDelete(data.id);
        console.log(`🗑️ User deleted: ${data.id}`);
        return res.status(200).json({ success: true });
      }

      default:
        console.log(`⚠️ Unhandled event type: ${type}`);
        return res.status(200).json({ success: false, message: `Unhandled event type: ${type}` });
    }
  } catch (error) {
    console.error("❌ Clerk Webhook Error:", error);

    // If it's a signature issue, tell Clerk
    if (error.message.includes("signature")) {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    // Otherwise acknowledge but log failure
    return res.status(200).json({ success: false, message: "Webhook received but processing failed" });
  }
};
