import { Webhook } from 'svix';
import User from '../models/User.js';
import Stripe from 'stripe';
import Purchase from '../models/Purchase.js';
import Course from '../models/Course.js';

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


// This function will handle webhook events from Stripe
export const stripeWebhooks = async (request, response) => {
  const sig = request.headers['stripe-signature'];
  let event;
  const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY)
  try {
    // Stripe requires the raw body, make sure you're using express.raw() middleware for this route
    event = Stripe.webhooks.constructEvent(
      request.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return response.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
      case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;
      const session = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntentId
      })

      const {purchaseId} = session.data[0].metadata;
      const purchaseData = await Purchase.findById(purchaseId);
      const userData = await User.findById(purchaseData.userId);
      const courseData = await Course.findById(purchaseData.courseId.toString());
      courseData.enrolledStudents.push(userData);
      await courseData.save();

      userData.enrolledCourses.push(courseData._id);
      await userData.save();

      purchaseData.status = 'completed'
      await purchaseData.save();
      break;
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;
      const session = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntentId
      })
      const {purchaseId} = session.data[0].metadata;
      const purchaseData = await Purchase.findById(purchaseId);
      purchaseData.status = 'failed'
      await purchaseData.save();
      break;
    }

    // Add more event types here as needed
    default: {
      console.log(`⚠️ Unhandled event type: ${event.type}`);
    }
  }

  // Respond to Stripe to acknowledge receipt of the event
  response.status(200).json({ received: true });
};