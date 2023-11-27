import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { createCustomError } from "../errors/customError.js";
import connection from "../database.js";

//SIGNUP USER
export const signUp = async (req, res, next) => {
  let flag = 0;
  try {
    const { password, email, username } = req.body;
    if (!email || !password) {
      return next(createCustomError("Please provide all values", 400));
    }

    const salt = await bcrypt.genSalt(5);
    const hashedPassword = await bcrypt.hash(password, salt);

    connection.query(
      `SELECT DISTINCT username FROM user WHERE uemail = "${email}" `,
      (err, results) => {
        if (err) throw err;
        if (results.length !== 0) {
          flag = 1;
          return next(createCustomError("Email already exists", 400));
        } else {
          connection.query(
            `INSERT INTO user ( username, upassword, uemail) VALUES ("${username}", "${hashedPassword}", "${email}")`,
            (err, results) => {
              if (err) {
                console.log(err);
                throw err;
              }
              console.log("Hello");

              res.status(200).json({ results });
            }
          );
        }
      }
    );
  } catch (error) {
    next(error);
  }
};

//LOGIN USER
export const login = async (req, res, next) => {
  try {
    console.log("hello");
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
      return next(createCustomError("Please provide all values", 400));
    }

    connection.query(
      `SELECT * FROM user WHERE username = "${username}" `,
      (err, results) => {
        console.log(results);
        if (err) throw err;
        if (results.length === 0) {
          return next(createCustomError("User has not registered", 400));
        } else {
          console.log(results[0].upassword);
          bcrypt.compare(password, results[0].upassword, (err1, result) => {
            if (!result) {
              return res.status(400).json({ msg: "Incorrect password" });
            } else {
              const userid = results[0].userid;
              const token = jwt.sign({ userid }, "project_mate", {
                expiresIn: "1h",
              });
              console.log(token);

              res.cookie("userid", userid, {
                path: "/",
                maxAge: 1000 * 60 * 60 * 24,
              });
              res.cookie("token", token, {
                path: "/",
                maxAge: 1000 * 60 * 60 * 24,
              });
              res.status(200).json({ token });
            }
          });
        }
      }
    );
  } catch (error) {
    next(error);
  }
};
//LOGOUT USER
export const logoutUser = async (req, res, next) => {
  try {
    console.log("guuuuu");
    res.cookie("userid", "", { path: "/" });
    res.cookie("token", "", { path: "/" });
    res.status(200).json({});
    if (err) throw err;
  } catch (err) {
    next(err);
  }
};

//UPDATE USER
export const updateUser = async (req, res, next) => {
  try {
    const { id: _id } = req.params;
    const { password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    connection.query(
      `SELECT * FROM members WHERE Uname = "${_id}" `,
      (err, results) => {
        if (err) throw err;
        if (results.length === 0) {
          return next(createCustomError("User does not exist", 400));
        } else {
          connection.query(
            `UPDATE members SET Password = "${hashedPassword}" WHERE Uname="${_id}"`,
            (err, result4) => {
              if (err) throw err;
              res.status(200).json({
                msg: "Updated successfully",
                Uid: _id,
              });
            }
          );
        }
      }
    );
  } catch (error) {
    next(error);
  }
};

//DELETE USER
export const deleteUser = async (req, res, next) => {
  try {
    const { id: _id } = req.params;
    const { email, password } = req.body;
    if (!email || !password) {
      return next(createCustomError("Please provide all values", 400));
    }

    connection.query(
      `SELECT * FROM members WHERE Uname = "${_id}" `,
      (err, results) => {
        if (err) throw err;
        if (results.length === 0) {
          return next(createCustomError("User does not exist", 400));
        } else {
          bcrypt.compare(password, results[0].Password, (err1, result) => {
            if (err1) throw err1;
            if (!result) {
              return res.status(400).json({ msg: "Incorrect password" });
            } else {
              connection.query(
                `DELETE FROM members WHERE Uname="${email}"`,
                (err, result4) => {
                  if (err) throw err;
                  res.status(200).json({
                    msg: "Deleted Successfully",
                  });
                }
              );
            }
          });
        }
      }
    );
  } catch (error) {
    next(error);
  }
};
