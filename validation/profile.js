const validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateProfileInput(data) {
  let errors = {};

  data.handle = !isEmpty(data.handle) ? data.handle : "";
  data.status = !isEmpty(data.status) ? data.status : "";
  data.skills = !isEmpty(data.skills) ? data.skills : "";

  if (!validator.isLength(data.handle, { min: 2, max: 40 })) {
    console.log("In handle length");
    errors.handle = "Handle needs to be between 2 and 40 characters";
  }

  if (validator.isEmpty(data.handle)) {
    console.log("In handle empty");
    errors.handle = "Profile handle is required";
  }

  if (validator.isEmpty(data.status)) {
    console.log("In status empty");
    errors.status = "Status is required";
  }

  if (validator.isEmpty(data.skills)) {
    console.log("In skills empty");
    errors.skills = "Skills are required";
  }

  if (!isEmpty(data.youtube)) {
    if (!validator.isURL(data.website)) {
      errors.youtube = "Not a valid URL";
    }
  }
  if (!isEmpty(data.website)) {
    if (!validator.isURL(data.website)) {
      errors.website = "Not a valid URL";
    }
  }
  if (!isEmpty(data.facebook)) {
    if (!validator.isURL(data.website)) {
      errors.facebook = "Not a valid URL";
    }
  }
  if (!isEmpty(data.linkedin)) {
    if (!validator.isURL(data.website)) {
      errors.linkedin = "Not a valid URL";
    }
  }
  if (!isEmpty(data.twitter)) {
    if (!validator.isURL(data.website)) {
      errors.twitter = "Not a valid URL";
    }
  }
  if (!isEmpty(data.instagram)) {
    if (!validator.isURL(data.website)) {
      errors.instagram = "Not a valid URL";
    }
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
