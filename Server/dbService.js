//const mysql = require('mysql');

const mysql2 = require('mysql2/promise'); 
const mysql = require('mysql/'); 
const dotenv = require('dotenv');
let instance = null;
dotenv.config();


const connection = mysql.createPool({
    connectionLimit: 10, // Adjust the limit as needed
    host: process.env.HOST,
    user: 'root',
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DB_PORT
});

connection.getConnection((err, connection) => {
    if (err) {
        console.error(err.message);
        return;
    }
    console.log('db ' + connection.state);
    connection.release(); // Release the connection back to the pool
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








    async findUserByEmail(email) {
        try {
            const result = await this.query(
                'SELECT id, fName, lName, Email FROM user WHERE Email = ?',
                [email]
            );
            return result[0];
        } catch (error) {
            console.error('Error finding user by email:', error);
            throw error;
        }
    }
    
    async saveMessage(senderId, receiverId, message) {
        try {
            const result = await this.query(
                'INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)',
                [senderId, receiverId, message]
            );
            return result;
        } catch (error) {
            console.error('Error saving message:', error);
            throw error;
        }
    }
    
    async getMessages(userId1, userId2) {
        try {
            const result = await this.query(
                `SELECT m.*, 
                 s.fName as sender_name, 
                 r.fName as receiver_name 
                 FROM messages m 
                 JOIN user s ON m.sender_id = s.id 
                 JOIN user r ON m.receiver_id = r.id 
                 WHERE (sender_id = ? AND receiver_id = ?) 
                 OR (sender_id = ? AND receiver_id = ?) 
                 ORDER BY timestamp ASC`,
                [userId1, userId2, userId2, userId1]
            );
            return result;
        } catch (error) {
            console.error('Error getting messages:', error);
            throw error;
        }
    }


    async updateRating(interaction_id, rating) {
        // Check if the rating is valid
        if (rating < 0 || rating > 5) {
            return Promise.resolve({ success: false, message: 'Rating has to be between 0 and 5!' });
        }

        return new Promise((resolve, reject) => {
            const query = "UPDATE ratings SET rating = ? WHERE interaction_id = ?;";
            connection.query(query, [rating, interaction_id], (err, result) => {
                if (err) {
                    reject(new Error(err.message));
                } else {
                    resolve({ success: true, message: 'Rating updated successfully' });
                }
            })
        });
    }

    async getRatingByUserIdAndMovieId(userId, movieId) {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM ratings WHERE user_id = ? AND movie_id = ?;";
            console.log(`Executing query: ${query} with values [${userId}, ${movieId}]`);
            connection.query(query, [userId, movieId], (err, result) => {
                if (err) {
                    reject(new Error(err.message));
                } else if (result.length > 0) {
                    resolve(result[0]);
                } else {
                    resolve(null);
                }
            });
        });
    }
    

    async insertRating(userId, movieId, rating) {
        // Check if the rating is valid
        if (rating < 0 || rating > 5) {
            return Promise.resolve({ success: false, message: 'Rating has to be between 0 and 5!' });
        }

        // Check if the user ID and movie ID are valid
        if (!userId || !movieId) {
            return Promise.resolve({ success: false, message: 'User ID and movie ID are required' });
        }

        return new Promise((resolve, reject) => {
            const query = "INSERT INTO ratings (user_id, movie_id, rating) VALUES (?,?,?);";
            connection.query(query, [userId, movieId, rating], (err, result) => {
                if (err) {
                    reject(new Error(err.message));
                } else {
                    resolve({ success: true, message: 'Rating submitted successfully' });
                }
            })
        });
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









      async createForum(forumName, creatorId) {
        try {
            const rows = await new Promise((resolve, reject) => {
                connection.query(
                    'INSERT INTO forums (forum_name, creator_id) VALUES (?, ?)',
                    [forumName, creatorId],
                    (error, results) => {
                        if (error) {
                            return reject(error);
                        }
                        resolve(results);
                    }
                );
            });
    
            return rows.insertId;
        } catch (error) {
            console.error('Database error in createForum:', error);
            throw new Error('Error creating forum: ' + error.message);
        }
    }


    async getForum(forumId) {
        try {
            const searchValue = forumId || 0;
    
            const rows = await new Promise((resolve, reject) => {
                connection.query(
                    'SELECT f.*, u.fName, u.lName, u.email FROM forums f JOIN user u ON f.creator_id = u.id WHERE f.forum_id = ?',
                    [searchValue],
                    (error, results) => {
                        if (error) {
                            return reject(error);
                        }
                        resolve(results);
                    }
                );
            });
    
            return rows[0] || null;
        } catch (error) {
            console.error('Database error in getForum:', error);
            throw new Error('Error getting forum: ' + error.message);
        }
    }


    async  searchForums(searchTerm) {
        try {
            const searchValue = searchTerm || '';
    
            const rows = await new Promise((resolve, reject) => {
                connection.query(
                    'SELECT f.*, u.fName, u.lName FROM forums f JOIN user u ON f.creator_id = u.id WHERE f.forum_name LIKE ?',
                    [`%${searchValue}%`],
                    (error, results) => {
                        if (error) {
                            return reject(error);
                        }
                        resolve(results);
                    }
                );
            });
    
            return Array.isArray(rows) ? rows : [];
        } catch (error) {
            console.error('Database error in searchForums:', error);
            throw new Error('Error searching forums: ' + error.message);
        }
    }
    async deleteForum (forumId, userId) {
        try {
            const [result] = await connection.query(
                'DELETE FROM forums WHERE forum_id = ? AND creator_id = ?',
                [forumId, userId]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    // Forum posts operations
    async createPost(forumId, userId, content, imagePath = null) {
        try {
            const result = await new Promise((resolve, reject) => {
                connection.query(
                    'INSERT INTO forum_posts (forum_id, user_id, content, image_path) VALUES (?, ?, ?, ?)',
                    [forumId, userId, content, imagePath],
                    (error, results) => {
                        if (error) {
                            return reject(error);
                        }
                        resolve(results);
                    }
                );
            });
            
            return result.insertId;
        } catch (error) {
            console.error('Database error in createPost:', error);
            throw new Error('Error creating post: ' + error.message);
        }
    }
    

    async getForumPosts(forumId) {
        try {
            const searchValue = forumId || 0;

            const rows = await new Promise((resolve, reject) => {
                connection.query(
                    `SELECT p.*, u.fName, u.lName, u.email 
                     FROM forum_posts p 
                     JOIN user u ON p.user_id = u.id 
                     WHERE p.forum_id = ? 
                     ORDER BY p.created_at DESC`,
                    [searchValue],
                    (error, results) => {
                        if (error) {
                            return reject(error);
                        }
                        resolve(results);
                    }
                );
            });

            return Array.isArray(rows) ? rows : [];
        } catch (error) {
            console.error('Database error in getForumPosts:', error);
            throw new Error('Error getting forum posts: ' + error.message);
        }
    }

    async deletePost (postId, forumId) {
        try {
            const searchValue = postId || 0;
            const forumValue = forumId || 0;

            const rows = await new Promise((resolve, reject) => {
                connection.query(
                    'DELETE FROM forum_posts WHERE post_id = ? AND forum_id = ?',
                    [searchValue, forumValue],
                    (error, results) => {
                        if (error) {
                            return reject(error);
                        }
                        resolve(results);
                    }
                );
            });

            return rows.affectedRows > 0;
        } catch (error) {
            console.error('Database error in deletePost:', error);
            throw new Error('Error deleting post: ' + error.message);
        }
    }




}



module.exports = DbService;