import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import dotenv from "dotenv";

dotenv.config();
const SECRET = process.env.JWT_SECRET || "super_secret_key";

class AuthService {
  async register(username, password, role = "USER") {
    // Kiểm tra tham số đầu vào
    if (typeof username !== "string" || typeof password !== "string")
      throw new Error("Invalid username or password format");

    const exists = await User.findOne({ username: username.trim() });
    console.log("check exists:", exists);
    if (exists) throw new Error("Username already exists");

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({
      username: username.trim(),
      password: hashed,
      role,
    });

    await user.save();

    return { id: user._id, username: user.username, role: user.role };
  }

  async login(username, password) {
    const user = await User.findOne({ username });
    if (!user) throw new Error("Invalid username or password");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error("Invalid username or password");

    const token = jwt.sign({ id: user._id, role: user.role }, SECRET, {
      expiresIn: "1h",
    });

    return { token, role: user.role };
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, SECRET);
    } catch {
      throw new Error("Invalid or expired token");
    }
  }
}

export default new AuthService();
