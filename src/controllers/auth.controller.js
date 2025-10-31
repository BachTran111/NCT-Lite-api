import AuthService from "../services/auth.service.js";
import { OK } from "../handler/success-response.js";

class AuthController {
  register = async (req, res, next) => {
    try {
      const { username, password, role } = req.body;
      const user = await AuthService.register(username, password, role);
      res.status(201).json(
        new OK({
          message: "User registered successfully",
          metadata: user,
        })
      );
    } catch (err) {
      next(err);
    }
  };

  login = async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const { token, role } = await AuthService.login(username, password);
      res.status(200).json(
        new OK({
          message: "Login successful",
          metadata: { token, role },
        })
      );
    } catch (err) {
      next(err);
    }
  };

  // Lấy thông tin user hiện tại từ token
  me = async (req, res, next) => {
    try {
      const user = req.user;
      res.status(200).json(
        new OK({
          message: "User info",
          metadata: user,
        })
      );
    } catch (err) {
      next(err);
    }
  };
}

export default new AuthController();
