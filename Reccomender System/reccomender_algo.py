#2nd attempt for reccomendation system 

# import mysql.connector
# import pandas as pd

# # Establish a connection to MySQL
# connection = mysql.connector.connect(
#     host="localhost",      # Your MySQL host, e.g., localhost
#     user="root",  # Your MySQL username
#     password="",  # Your MySQL password
#     database="movie_recommendation"  # The database you just created
# )

from sqlalchemy import create_engine
import pandas as pd
from sklearn.neighbors import NearestNeighbors

# Replace 'your_password' and 'your_database_name' with your actual password and database name
engine = create_engine('mysql+mysqlconnector://root:your_password@localhost/movie_recommendation')

# Fetch data using pandas and SQLAlchemy
def fetch_data():
    # Query the movies table
    movies_query = "SELECT * FROM movies"
    movies = pd.read_sql(movies_query, engine)
    
    # Query the ratings table
    ratings_query = "SELECT * FROM ratings"
    ratings = pd.read_sql(ratings_query, engine)
    
    return movies, ratings


"""
example test data
Movies:
   movie_id                     title                      genre
0         1  The Shawshank Redemption                      Drama
1         2             The Godfather               Crime, Drama
2         3           The Dark Knight       Action, Crime, Drama
3         4              12 Angry Men               Crime, Drama
4         5          Schindler's List  Biography, Drama, History

Ratings:
   rating_id  user_id  movie_id  rating
0          1        1         1     4.5
1          2        1         2     5.0
2          3        1         3     4.0
3          4        2         1     5.0
4          5        2         4     4.5
5          6        2         5     4.0
6          7        3         2     4.5
7          8        3         3     5.0
8          9        3         5     4.5
"""

# Fetch the data from the MySQL tables
def fetch_data():
    # Query the movies table
    movies_query = "SELECT * FROM movies"
    movies = pd.read_sql(movies_query, connection)
    
    # Query the ratings table
    ratings_query = "SELECT * FROM ratings"
    ratings = pd.read_sql(ratings_query, connection)
    
    return movies, ratings

# Fetch and print the data
movies, ratings = fetch_data()

print("Movies:")
print(movies)
print("\nRatings:")
print(ratings)

"""	
def fetch_data():
    # SQL query to get movie details
    movies_query = "SELECT movie_id, title FROM movies"
    movies = pd.read_sql(movies_query, connection)

    # SQL query to get user-movie ratings or interactions
    ratings_query = "SELECT user_id, movie_id, rating FROM ratings"
    ratings = pd.read_sql(ratings_query, connection)
    
    return movies, ratings


# Fetch the data
movies, ratings = fetch_data()

# Create a user-movie matrix
user_movie_matrix = ratings.pivot_table(index='user_id', columns='movie_id', values='rating')
user_movie_matrix.fillna(0, inplace=True)

# KNN Model for recommendations
model_knn = NearestNeighbors(metric='cosine', algorithm='brute')
model_knn.fit(user_movie_matrix)

# Recommendation function
def recommend_movies(user_id, n_recommendations=5):
    user_index = user_movie_matrix.index.get_loc(user_id)
    
    distances, indices = model_knn.kneighbors(user_movie_matrix.iloc[user_index, :].values.reshape(1, -1), n_neighbors=n_recommendations + 1)
    
    recommended_movies = []
    for i in range(1, len(distances.flatten())):
        recommended_movie_id = user_movie_matrix.columns[indices.flatten()[i]]
        movie_title = movies[movies['movie_id'] == recommended_movie_id]['title'].values[0]
        recommended_movies.append(movie_title)
    
    return recommended_movies

# Example usage
user_id = 1  # Replace with your specific user ID
recommendations = recommend_movies(user_id, n_recommendations=5)
print(f"Top movie recommendations for user {user_id}: {recommendations}")

# Close the MySQL connection
connection.close()
"""
# Function to create a user-movie matrix and return it
def create_user_movie_matrix(ratings):
    # Create the user-movie interaction matrix (pivot table)
    user_movie_matrix = ratings.pivot_table(index='user_id', columns='movie_id', values='rating')
    
    # Replace NaN values with 0 (if user has not rated a movie)
    user_movie_matrix.fillna(0, inplace=True)
    
    return user_movie_matrix

# Function to recommend movies using KNN (Collaborative Filtering)
def recommend_movies(user_id, user_movie_matrix, movies, n_recommendations=5):
    # Train the KNN model
    model_knn = NearestNeighbors(metric='cosine', algorithm='brute')
    model_knn.fit(user_movie_matrix)
    
    # Get the user's row from the matrix
    user_index = user_movie_matrix.index.get_loc(user_id)
    
    # Find the nearest neighbors (users with similar preferences)
    distances, indices = model_knn.kneighbors(user_movie_matrix.iloc[user_index, :].values.reshape(1, -1), n_neighbors=n_recommendations + 1)
    
    # Get recommended movies based on neighbors' preferences
    recommended_movies = []
    for i in range(1, len(distances.flatten())):
        # Get the movie ID from the nearest neighbor
        recommended_movie_id = user_movie_matrix.columns[indices.flatten()[i]]
        # Get the movie title using the movie_id
        movie_title = movies[movies['movie_id'] == recommended_movie_id]['title'].values[0]
        recommended_movies.append(movie_title)
    
    return recommended_movies

# Fetch the data
movies, ratings = fetch_data()

# Create the user-movie matrix
user_movie_matrix = create_user_movie_matrix(ratings)

# Specify the user_id for whom you want recommendations
user_id = 1  # Replace with any valid user ID from your ratings data

# Get movie recommendations for the specified user
recommendations = recommend_movies(user_id, user_movie_matrix, movies, n_recommendations=5)

# Print the movie recommendations
print(f"Top movie recommendations for user {user_id}: {recommendations}")

# Close the MySQL connection
connection.close()