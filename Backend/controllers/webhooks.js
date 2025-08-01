import { Webhook } from 'svix';
import { User } from "../models/User.js";

export const clerkWebhooks = async (req, res) => {
  try {
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // ✅ Verify raw body from Clerk
    await whook.verify(req.body, {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"]
    });

    // ✅ Convert raw Buffer -> JSON object
    const { data, type } = JSON.parse(req.body.toString());

    switch (type) {
      case 'user.created': {
        const newUser = await User.create({
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: `${data.first_name} ${data.last_name}`,
          imageUrl: data.image_url
        });
        console.log("✅ User created:", newUser);
        res.json({ success: true });
        break;
      }

      case 'user.updated': {
        const updatedUser = await User.findByIdAndUpdate(data.id, {
          email: data.email_addresses[0].email_address,
          name: `${data.first_name} ${data.last_name}`,
          imageUrl: data.image_url
        }, { new: true });
        console.log("✅ User updated:", updatedUser);
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
    console.error("❌ Clerk Webhook Error:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};
