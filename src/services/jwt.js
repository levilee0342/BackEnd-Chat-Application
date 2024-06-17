import jwt from "jsonwebtoken";
const generateToken = (obj, securityKey = "", expiresIn = "30d") => {
  console.log(expiresIn);
  return jwt.sign(
    { id: obj.id, ...obj },
    process.env.JWT_SECRET + securityKey,
    {
      expiresIn,
    }
  );
};
export { generateToken };
