import { Webhook } from 'svix';
import User from '../models/User.js';

export const clerkWebhooks = async (req, res) => {
  try {
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // ✅ VERIFY SIGNATURE using raw buffer (req.body is Buffer)
    await whook.verify(req.body, {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"]
    });

    // ✅ Parse payload AFTER verifying
    const payloadString = req.body.toString(); // convert buffer to string
    const { data, type } = JSON.parse(payloadString);

    // ✅ Handle events
    switch (type) {
      case 'user.created': {
        const userData = {
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: `${data.first_name} ${data.last_name}`,
          imageUrl: data.image_url,
        };
        await User.create(userData);
        console.log("✅ User created:", userData);
        res.json({ success: true });
        break;
      }

      case 'user.updated': {
        const userData = {
          email: data.email_addresses[0].email_address,
          name: `${data.first_name} ${data.last_name}`,
          imageUrl: data.image_url,
        };
        await User.findByIdAndUpdate(data.id, userData);
        console.log("✅ User updated:", data.id);
        res.json({ success: true });
        break;
      }

      case 'user.deleted': {
        await User.findByIdAndDelete(data.id);
        console.log(`🗑️ User deleted: ${data.id}`);
        res.json({ success: true });
        break;
      }

      default:
        console.log(`⚠️ Unhandled event type: ${type}`);
        res.json({ success: false, message: `Unhandled event type: ${type}` });
    }
  } catch (error) {
    console.error("❌ Clerk Webhook Error:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};
