const mysql = require('mysql');
const dotenv = require('dotenv');
let instance = null;
dotenv.config();

const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DB_PORT
});

connection.connect((err) => {
    if (err) {
        console.log(err.message);
    }
     console.log('db ' + connection.state);
});


class DbService {
    static getDbServiceInstance() {
        return instance ? instance : new DbService();
    }

    async getAllData() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT id, fName, lName, email, password FROM user;";
                connection.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });
            console.log('Data from database:', response); // Add this line for debugging
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async insertNewName(fName, lName, email, password) {
        try {
            const insertId = await new Promise((resolve, reject) => {
                const query = "INSERT INTO user (fName, lName, email, password) VALUES (?,?,?,?);";
                connection.query(query, [fName, lName, email, password], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.insertId);
                })
            });
            return {
                id : insertId,
                fName : fName,
                lName : lName,
                email : email,
                password : password
            };
        } catch (error) {
            console.log(error);
        }
    }

    async deleteRowById(id) {
        try {
            id = parseInt(id, 10); 
            const response = await new Promise((resolve, reject) => {
                const query = "DELETE FROM user WHERE id = ?";
    
                connection.query(query, [id] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                })
            });
    
            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async updateNameById(id, fName, lName, email, password) {
        try {
            id = parseInt(id, 10); 
            const response = await new Promise((resolve, reject) => {
                const query = "UPDATE user SET fName = ?, lName = ?, email = ?, password = ? WHERE id = ?";
    
                connection.query(query, [fName, lName, email, password, id] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                })
            });
    
            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async getDataById(id) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM user WHERE id = ?";
                connection.query(query, [id], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results[0]);
                })
            });
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async query(sql, params) {
        return new Promise((resolve, reject) => {
            connection.query(sql, params, (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }
    

    async getUserByEmail(email) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM user WHERE email = ?;";
                connection.query(query, [email], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results[0]); // Return the first matching record (or undefined if none found)
                });
            });
            return response;
        } catch (error) {
            console.log(error);
            return null;
        }
    }


    async searchByName(fName, lName) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM user WHERE fName = ? AND lName = ?;";

                connection.query(query, [fName, lName], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });

            return response;
        } catch (error) {
            console.log(error);
        }
    }


    async fetchMovie(id) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT filepath, imgpath FROM movies WHERE movie_id = ?";
                connection.query(query, [id], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results[0]);
                })
            });
            return response;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }



    async deleteMovie(id) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "DELETE FROM movies WHERE movie_id = ?";
                connection.query(query, [id], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                })
            });
            return response === 1;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async query(sql, params) {
        try {
            const response = await new Promise((resolve, reject) => {
                connection.query(sql, params, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                });
            });
            return response;
        } catch (error) {
            console.error('Database query error:', error);
            throw error;
        }
    }

    async updateMovie(id, updateFields) {
        try {
          const keys = Object.keys(updateFields).filter(key => updateFields[key] !== null);  // Ignore null fields
          const values = keys.map(key => updateFields[key]);
          const query = `UPDATE movies SET ${keys.map(key => `${key} = ?`).join(', ')} WHERE movie_id = ?`;
          
          values.push(id);  // Add movie ID to the values array
          
          const result = await this.query(query, values);
          return result.affectedRows > 0;
        } catch (error) {
          console.error('Error updating movie:', error);
          throw error;
        }
      }
      
      async getMovieById(id) {
        try {
          const query = "SELECT * FROM movies WHERE movie_id = ?";
          const result = await this.query(query, [id]);
          return result[0];  // Return the first result
        } catch (error) {
          console.error('Error getting movie by ID:', error);
          throw error;
        }
      }


      async fetchMovieInfo(title) {
        try {
          const query = "SELECT * FROM movies WHERE title = ?";
          const result = await this.query(query, [title]);
          return result[0];  // Return the first result
        } catch (error) {
          console.error('Error getting movie info by ID:', error);
          throw error;
        }

      }


      async fetchMovieInfoById(id) {
        try {
          const query = "SELECT * FROM movies WHERE movie_id = ?";
          const result = await this.query(query, [id]);
          return result[0];  // Return the first result
        } catch (error) {
          console.error('Error getting movie info by ID:', error);
          throw error;
        }

      }

}



module.exports = DbService;