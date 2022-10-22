const express = require('express');
const app = new express();
const pool = require("../database")
const schedule = require('node-schedule');

const job = schedule.scheduleJob('*/5 * * * * *', async function() {

    const checkAccess = async (req, res) => {
        const sql = `select user_id , attempt_at from user_login where access = 0 `;
        pool.query(sql, (err, result) => {
            if (err) throw err;
            else {
                const date = new Date();
                const currentDate = date.getDate();
                const currentHours = date.getHours();

                for (const values of result) {

                    const {
                        user_id,
                        attempt_at
                    } = values;
                    const databaseHours = attempt_at.getHours();
                    const databaseDate = attempt_at.getDate();


                    if ((currentDate - databaseDate) > 0) {

                        let timeDifference = currentHours - databaseHours;
                        if (timeDifference >= 0) {
                            console.log("entered here")
                            const sql = `update user_login
                                         set access = 1,attempts=0,attempt_at = NULL
                                         where user_id = ${ user_id } `;
                            pool.query(sql, (err, result) => {
                                if (err) throw err;
                            })

                        }


                    }

                }



            }
        })
    }

    checkAccess();
});




exports.editUser = async (req, res) => {
    const {
        id
    } = req.params;
    const {
        user_name,
        user_password
    } = req.body;
    console.log(id, user_name, user_password);
    const sql = `update user_login
                set user_name = "${ user_name }",
                user_password = "${ user_password }"
                where user_id = ${ Number(id) }`;
    pool.query(sql, (err, result) => {
        if (err) throw err;
        res.json("User Details Updated Successfully!");
    })
}



exports.deleteUser = async (req, res) => {
    const {
        id
    } = req.params;
    const sql = `delete from user_login where user_id = ${ Number(id) }`;
    pool.query(sql, (err, result) => {
        if (err) throw err;
        res.json("User Deleted Successfully");
    })
}


exports.viewUser = async (req, res) => {
    const {
        id
    } = req.params;
    const sql = `select  * from user_login where user_id  = ${Number(id)}`;
    pool.query(sql, (err, result) => {
        if (err) throw err;
        res.json(result);
    })

}



exports.userData = async (req, res) => {

    const sql = `select user_id, user_name ,user_email from user_login order by user_id asc`;
    pool.query(sql, (err, result) => {
        if (err) throw err;
        res.json(result);
    })

}

exports.addUser = async (req, res) => {
    const {
        user_name,
        user_email,
        user_password
    } = req.body;

    const sql = `select user_email from user_login where user_email = "${ user_email }"`;
    pool.query(sql, (err, result) => {
        if (err) throw err;
        else {
            if (result.length > 0) {
                res.json("Email Id ALready Exists")
            } else {
                const sql = `insert into user_login(user_name,user_email,user_password,access,attempts) 
                 values("${ user_name }","${ user_email }","${ user_password }",1,1)`;

                pool.query(sql, (err, result) =>

                    {

                        if (err) res.json(err.sqlMessage);

                        res.json("User Registered Successfully");

                        console.log(result);

                    })

            }


        }
    })

}




exports.userLogin = async (req, res) => {
    const {
        email,
        password
    } = req.body;

    const sql = `select user_password ,access from user_login where user_email = "${ email }"  `;

    await pool.query(sql, (err, result) => {
        if (err) throw err;

        else {

            if (!result[0]) {
                res.status(200).json("User Doesn't Exists");

            } else {
                const userAccess = result[0].access;
                if (userAccess) {
                    const user_Password = result[0].user_password;
                    if (password === user_Password) {
                        res.status(200).json({
                            message: "Credentials are Correct",
                            response: email
                        });
                    }
                } else {

                    console.log("here")

                    const sql = `select attempts from user_login where user_email = "${ email }"`;
                    pool.query(sql, (err, response) => {
                        if (err) throw err;

                        else {
                            const attempts = response[0].attempts;
                            if (attempts > 5) {
                                res.json("You have exceeded your attempts try after 24 hours")


                            }
                            if (attempts == 5) {
                                const sql = `update user_login 
                                 set access  = 0 
                                 where user_email = "${ email }"`

                                pool.query(sql, (err, result) => {
                                    if (err) throw err;

                                    else {


                                        const sql = `update user_login 
                                        set attempt_at  = now()
                                        where user_email = "${ email }"`

                                        pool.query(sql, (err, result) => {
                                            if (err) throw err;
                                            else {
                                                const sql = `update user_login 
                                 
                                                    set attempts  = attempts+1 
                                
                                                    where user_email = "${ email }"`

                                                pool.query(sql, (err, result) => {


                                                    if (err) throw err;



                                                    else {


                                                        res.status(200).json("Wrong Password");



                                                    }



                                                })
                                            }
                                        })



                                    }

                                })

                            }


                            if (attempts < 5) {
                                const sql = `update user_login 
                                 set attempts  = attempts+1 
                                 where user_email = "${ email }"`
                                pool.query(sql, (err, result) => {

                                    if (err) throw err;


                                    else {

                                        res.status(200).json("Wrong Password");


                                    }


                                })


                            }
                        }
                    })


                }

            }

        }


    })


}