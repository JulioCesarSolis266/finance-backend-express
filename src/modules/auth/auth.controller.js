import authService from "./auth.service.js";

export const register = async (req, res) => {
  try {
    const user = await authService.register(req.body);
    return res.status(201).json(user);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const userLogged = await authService.login(req.body);
    return res.status(200).json(userLogged);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};
