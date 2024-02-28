import pool from "../../config/config.js";
import query from "../../utils/query.js";

export const otpsendUsername = (req, res) => {
    pool.getConnection(async (err, conn) => {
      if (err) {
        console.log(err);
        res.status(500).send("Server Error");
      } else {
        var otp = Math.random() * (1000000 - 99999) + 99999;
        var random = parseInt(otp);
        var a = random.toString();
        console.log(a);
        var username = req.body.username;
        var clientPort = 465;
        var clientSmtp = "smtp.hostinger.com";
        var useSmtp = clientSmtp ? clientSmtp : "smtp.hostinger.com";
        var usePort = clientPort ? clientPort : 465;
        var mailData = {
          from: {
            name: "New Inquiry From Dwellfox.com",
            address: "donotreply@bumbbl.com",
          },
          to: username,
          subject: "Otp for forget password is: ",
          html: `<!DOCTYPE html>
          <html>
          <head>
             <meta charset="utf-8" />
             <title>A simple, clean, and responsive HTML invoice template</title>
             <style>
                h1, h2, h3, h4, h5, h6, p {
                   font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
                }
                .invoice-box {
                   max-width: 700px;
                   margin: auto;
                   border-radius: 13px;
                   border: 1px solid #1B2644;
                   box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
                   font-size: 16px;
                   line-height: 24px;
                   color: #555;
                }
                .tabledata tr th {
                   /* border: 1px solid #000; */
                   font-size: 18px;
                   padding: 10px;
                   color: #000;
                   font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
                }
                .tabledata tr td {
                   border: 1px solid #BCCCFF;
                   padding: 10px;
                   font-size: 16px;
                   color: #000;
                   font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
                }
                .invoice-box table {
                   width: 100%;
                   line-height: inherit;
                   text-align: left;
                }
                .invoice-box table td {
                   /* padding: 5px; */
                   vertical-align: top;
                }
                /* .invoice-box table tr td:nth-child(2) {
                      text-align: right;
                   } */
                .invoice-box table tr.top table td {
                   padding-bottom: 20px;
                }
                .invoice-box table tr.top table td.title {
                   font-size: 45px;
                   line-height: 45px;
                   color: #333;
                }
                /* .invoice-box table tr.information table td {
                      padding-bottom: 40px;
                   } */
                .invoice-box table tr.heading td {
                   background: #eee;
                   border-bottom: 1px solid #ddd;
                   font-weight: bold;
                }
                .invoice-box table tr.details td {
                   padding-bottom: 20px;
                }
                .invoice-box table tr.item td {
                   border-bottom: 1px solid #eee;
                }
                .invoice-box table tr.item.last td {
                   border-bottom: none;
                }
                .invoice-box table tr.total td:nth-child(2) {
                   border-top: 2px solid #eee;
                   font-weight: bold;
                }
                @media only screen and (max-width: 600px) {
                   .invoice-box table tr.top table td {
                      width: 100%;
                      display: block;
                      text-align: center;
                   }
                   .invoice-box table tr.information table td {
                      width: 100%;
                      display: block;
                      text-align: center;
                   }
                }
                /** RTL **/
                .invoice-box.rtl {
                   direction: rtl;
                   font-family: Tahoma, 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
                }
                .invoice-box.rtl table {
                   text-align: right;
                }
                .invoice-box.rtl table tr td:nth-child(2) {
                   text-align: left;
                }
                .tb_header {
                   background-color: #000;
                   color: #fff;
                   border: 1px solid #000;
                   font-weight: 500;
                }
                .all_details {
                   text-align: right;
                   /* border: 1px solid #000; */
                   border-collapse: collapse;
                }
                .boldcolor {
                   font-weight: bold;
                   color: #000;
                   text-align: right;
                }
             </style>
          </head>
          <body>
             <div class="invoice-box">
                <table cellpadding="0" cellspacing="0">
                   <tr class="top">
                      <td colspan="2">
                         <table style="background-color:#1B2644;border-radius: 13px 13px 0 0;">
                            <tr>
                                <td style="text-align: center; padding-top: 20px;">
                                  <!-- <img src="logo.png" alt=""> -->
                                  <img src="logo.png" alt="">
                               </td>
                            </tr>
                         </table>
                      </td>
                   </tr>
                </table>
                <table cellpadding="0" cellspacing="0" style="padding: 0 50px;">
                   <tr class="top">
                      <td colspan="2">
                         <table style=" margin-bottom: 0; margin-top: 10px;">
                            <tr>
                               <td style="vertical-align: middle; color: #000;">
                                  <h4 style="margin-bottom: 10px;">${username}</h4>
                                  <h3 style="margin-bottom: 10px;">Your Verification Code is</h3>
                                  <h2 style="margin-bottom: 10px;">${a}</h2>
                              </td>
                               <td style="text-align: end; padding-top: 20px;">
                                  <img src="Login-amico.png" />
                               </td>
                            </tr>
                         </table>
                      </td>
                   </tr>
                </table>
                <table style="padding: 0px 50px; ">
                   <tr>
                      <td style="color:#000">
                         <p style=" margin-top: 0;">Please enter this code in the designated field on our website/app to complete the verification process. This step is crucial in protecting your account from unauthorized access and securing your personal information.
                          If you did not request this verification code, please ignore this email. </p>
                         <h3 style="margin-bottom: 0; font-weight: 500;">Best regards,</h3>
                         <h3 style="margin-top: 5px;">P & G Truckers Team</h3>
                      </td>
                   </tr>
                </table>
             </body>
          </html>`,
        };
        conn.query(
          `UPDATE identities SET otp=${a} WHERE username ="${username}"`,
          function (err) {
            if (err) {
              res.send({ result: err });
            } else {
              res.send({ result: "Successfully Sent!!!" });
            }
          }
        );
        const transporter = nodemailer.createTransport({
          port: usePort, // true for 465, false for other ports
          host: useSmtp,
          auth: {
            user: "donotreply@bumbbl.com",
            pass: "Bumbbl@4321#2D",
          },
          secure: true,
        });
        transporter.sendMail(mailData, function (err, info) {
          if (err) {
            console.log(err);
            res.send(`{"message":"Sending Failed!"}`);
          } else {
            res.send(`{"message":"Successfully Sent!"}`);
          }
        });
        pool.releaseConnection(conn);
      }
    });
  };

  
export const verifyOtp = (req, res) => {

    const { otp, email } = req.body; // Assuming the phone number and OTP are sent in the request body
  
    // Check if the OTP is valid for the given email
    const query = "SELECT * FROM identities WHERE otp = ? AND username = ?";
  
    pool.query(query, [otp, email], (error, results) => {
      if (error) {
        console.error("Error verifying OTP:", error);
        res.status(500).json({ status: "500", error: "Error verifying OTP" });
      } else {
        if (results.length > 0) {
          // Valid OTP
          // You can add additional logic here, like checking OTP expiration time
          res.status(200).json({ status: "200", message: "send success" });
        } else {
          // Invalid OTP
          res.status(401).json({ status: "401", message: "otp invalid" });
        }
      }
    });
  };

  
export const resetPassword = (req, res) => {
    const { username, newPassword, confirmPassword } = req.body;
    // Check if the new password and confirm password match
    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .json({
          status: "400",
          error: "New password and confirm password do not match !",
        });
    }
    // Check if the email exists in the database
    const selectQuery = "SELECT * FROM identities WHERE username = ?";
    pool.query(selectQuery, [username], (selectError, selectResults) => {
      if (selectError) {
        console.error("Error executing select query:", selectError);
        return res
          .status(500)
          .json({ status: "500", error: "Error resetting password" });
      }
      // If the email does not exist, return an error
      if (selectResults.length === 0) {
        return res.status(404).json({ status: "404", error: "User not found !" });
      }
      // Update the password in the database for the given user
      const updateQuery = "UPDATE identities SET password = ? WHERE username = ?";
      pool.query(
        updateQuery,
        [newPassword, username],
        (updateError, updateResults) => {
          if (updateError) {
            console.error("Error resetting password:", updateError);
            return res
              .status(500)
              .json({ status: "500", error: "Error resetting password" });
          }
          res
            .status(200)
            .json({ status: "200", message: "Password reset successfully" });
        }
      );
    });
  };
  
// Change Password API Endpoint
export const changePassword = (req, res) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Please provide both username and newPassword" });
    }
  
    // Check if the user exists (you can adjust this query based on your schema)
    const checkUserQuery = "SELECT * FROM identities WHERE username = ?";
    pool.query(checkUserQuery, [username], (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Error checking user" });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Update the user's password
      const updatePasswordQuery =
        "UPDATE identities SET password = ? WHERE username = ?";
      pool.query(updatePasswordQuery, [password, username], (err) => {
        if (err) {
          return res.status(500).json({ message: "Error updating password" });
        }
  
        res.json({ message: "Password updated successfully" });
      });
    });
  };