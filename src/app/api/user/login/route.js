export async function POST(request) {
  await connectDB();
  const obj = await request.json();

  const user = await UserModal.findOne({ email: obj.email });
  if (!user) {
    return new Response(
      JSON.stringify({ error: true, msg: "User Not Found" }),
      { status: 404 }
    );
  }

  const isPasswordMatch = await bcrypt.compare(obj.password, user.password);
  if (!isPasswordMatch) {
    return new Response(
      JSON.stringify({ error: true, msg: "Password Is Not Valid" }),
      { status: 400 }
    );
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_KEY
  );

  return new Response(
    JSON.stringify({
      error: false,
      msg: "User Login Successfully",
      user,
      token,
    }),
    { status: 200 }
  );
}
