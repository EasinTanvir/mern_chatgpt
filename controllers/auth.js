const USER = require("../models/auth");
const GUSER = require("../models/googleauth");
const bcrypt = require("bcryptjs");
const HttpError = require("../helper/HttpError");
const jwt = require("jsonwebtoken");

const createUser = async (req, res, next) => {
  const { email, password } = req.body;

  let exisitingUser;

  try {
    exisitingUser = await USER.findOne({ email });
  } catch (err) {
    const errors = new HttpError("find existing user failed", 500);
    return next(errors);
  }

  if (exisitingUser) {
    const errors = new HttpError(
      "An account with that email already exists. Please try another email.",
      500
    );
    return next(errors);
  }

  if (password.trim().length < 6) {
    const errors = new HttpError(
      "Password should be at least 6 characters.",
      500
    );
    return next(errors);
  }

  let hashPass;

  try {
    hashPass = await bcrypt.hash(password, 12);
  } catch (err) {
    const errors = new HttpError("hash password failed", 500);
    return next(errors);
  }

  let user;

  try {
    user = await USER.create({ ...req.body, password: hashPass });
  } catch (err) {
    const errors = new HttpError("create user failed", 500);
    return next(errors);
  }

  // let token;
  // try {
  //   token = jwt.sign({ id: user._id, token: token }, process.env.TOKEN_KEY, {
  //     expiresIn: "24h",
  //   });
  // } catch (err) {
  //   const errors = new HttpError("create token failed", 500);
  //   return next(errors);
  // }

  res.status(200).json({
    id: user._id,
    email: user.email,
  });
};
const signIn = async (req, res, next) => {
  const { email, password } = req.body;

  let user;

  try {
    user = await USER.findOne({
      email,
    });
  } catch (err) {
    const errors = new HttpError("find user failed", 500);
    return next(errors);
  }

  if (!user) {
    const errors = new HttpError(
      "We could not find an account with that email. Try another email, or create a new account.",
      500
    );
    return next(errors);
  }

  let hashPass;

  try {
    hashPass = await bcrypt.compare(password, user.password);
  } catch (err) {
    const errors = new HttpError("compare  password failed", 500);
    return next(errors);
  }

  if (!hashPass) {
    const errors = new HttpError(
      "Incorrect password. Your email is correct, but try another password.",
      500
    );
    return next(errors);
  }

  let token;
  try {
    token = jwt.sign({ id: user._id, token: token }, process.env.TOKEN_KEY, {
      expiresIn: "24h",
    });
  } catch (err) {
    const errors = new HttpError("create token failed", 500);
    return next(errors);
  }

  res.status(200).json({
    id: user._id,
    email: user.email,
    token: token,
  });
};

const googleSignIn = async (req, res, next) => {
  const { userId, email } = req.body;
  let findUser;

  let user;
  try {
    findUser = await GUSER.find({ userId: userId });
  } catch (err) {
    console.log(err);
  }

  if (findUser.length === 0) {
    try {
      user = await GUSER.create({ email, userId });
    } catch (err) {
      const errors = new HttpError("create user failed", 500);
      return next(errors);
    }
  } else {
    try {
      user = await GUSER.findOne({ userId: userId });
    } catch (err) {
      const errors = new HttpError("find user failed", 500);
      return next(errors);
    }
  }

  let token;
  try {
    token = jwt.sign({ id: user.userId, token: token }, process.env.TOKEN_KEY, {
      expiresIn: "24h",
    });
  } catch (err) {
    const errors = new HttpError("create token failed", 500);
    return next(errors);
  }

  res.status(200).json({
    id: user.userId,
    email: user.email,
    token: token,
  });
};

module.exports = {
  createUser,
  signIn,
  googleSignIn,
};
