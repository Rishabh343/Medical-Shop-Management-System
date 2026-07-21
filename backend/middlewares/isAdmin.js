export const isAdmin = (req, res, next) => {
  if (req.user.role !== "Admin") {
    return res.status(403).json({
      message: "Only admin allowed",
    });
  }

  next();
};

