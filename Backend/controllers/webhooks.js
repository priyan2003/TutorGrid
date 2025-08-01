export const clerkWebhooks = async (req, res) => {
  try {
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // ✅ Verify raw body
    await whook.verify(req.body, {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"]
    });

    // ✅ Parse raw buffer after verification
    const { data, type } = JSON.parse(req.body);

    switch (type) {
      case 'user.created':
        await User.create({
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: `${data.first_name} ${data.last_name}`,
          imageUrl: data.image_url
        });
        res.json({});
        break;

      case 'user.updated':
        await User.findByIdAndUpdate(data.id, {
          email: data.email_addresses[0].email_address,
          name: `${data.first_name} ${data.last_name}`,
          imageUrl: data.image_url
        });
        res.json({});
        break;

      case 'user.deleted':
        await User.findByIdAndDelete(data.id);
        res.json({});
        break;

      default:
        res.json({ success: false, message: `Unhandled event type: ${type}` });
    }
  } catch (error) {
    console.error("❌ Clerk Webhook Error:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};
