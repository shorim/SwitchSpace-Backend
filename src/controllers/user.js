const bcrypt = require("bcryptjs");

const UserModel = require("../models/schema/user");
const registerValidator = require("../models/validations/userUpdate");

// ********************************************************************************************************* //

// update user profile
// TODO update email or not
const updateProfile = async (req, res) => {
  if (!req.userId) {
    return res.status(403).json({
      message: "You need to be a regular user to update your profile.",
    });
  }
  // validate the post form
  const validationVerdict = registerValidator.validate(req.body);
  // check whether the form is incomplete
  if (validationVerdict.error) {
    return res
      .status(400)
      .json({ message: validationVerdict.error.details[0].message });
  }
  let user = req.body;

  try {
    if (req.body.password) {
      user = Object.assign(req.body, {
        password: bcrypt.hashSync(req.body.password, 10),
      });
      console.log(req.body);
    }
    user = await UserModel.findByIdAndUpdate(req.userId, user, {
      new: true,
      runValidators: true,
    });
    return res.status(200).json({ data: user });
  } catch (err) {
    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};
// ********************************************************************************************************* //

// change current subscription tier of the user.
const userChangeSubscription = async (req, res) => {
  if (!req.userId) {
    return res.status(403).json({
      message:
        "You need to be a regular user to change your subscription tier.",
    });
  }
  if (!req.body.tier) {
    return res.json.status(404).json({ message: "missing subscription tier" });
  }
  let user;
  try {
    user = await UserModel.findByIdAndUpdate(
      req.userId,
      { tier: req.body.tier },
      { new: true, runValidators: true }
    );
    return res.status(200).json({ data: user });
  } catch (err) {
    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  updateProfile,
  userChangeSubscription,
};
