import { connectDB } from "@/lib/dbConnect";
import { UserModal } from "@/lib/modals/UserModal";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(request) {
  try {
    // Connect to the database
    await connectDB();

    // Parse the request body
    const obj = await request.json();

    // Check if the user exists
    const user = await UserModal.findOne({ email: obj.email });
    if (!user) {
      return new Response(
        JSON.stringify({ error: true, msg: "User Not Found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Verify the password
    const isPasswordMatch = await bcrypt.compare(obj.password, user.password);
    if (!isPasswordMatch) {
      return new Response(
        JSON.stringify({ error: true, msg: "Password Is Not Valid" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_KEY,
      { expiresIn: "1h" } // Token expiration time (optional)
    );

    // Respond with user data and token
    return new Response(
      JSON.stringify({
        error: false,
        msg: "User Login Successfully",
        user,
        token,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error during login:", error);
    return new Response(
      JSON.stringify({ error: true, msg: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
