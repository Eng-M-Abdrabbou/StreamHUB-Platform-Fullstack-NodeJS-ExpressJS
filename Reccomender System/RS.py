from flask import Flask, request, jsonify
from sqlalchemy import create_engine
import pandas as pd
from sklearn.neighbors import NearestNeighbors

# Initialize Flask app
app = Flask(__name__)

# Establish SQLAlchemy connection
engine = create_engine('mysql+mysqlconnector://root:@localhost/streamhubdb3')

# Fetch the data from the MySQL tables using SQLAlchemy
def fetch_data():
    movies_query = "SELECT * FROM movies"
    movies = pd.read_sql(movies_query, engine)
    
    ratings_query = "SELECT * FROM ratings"
    ratings = pd.read_sql(ratings_query, engine)
    
    return movies, ratings

# Function to create a user-movie matrix and return it
def create_user_movie_matrix(ratings):
    user_movie_matrix = ratings.pivot_table(index='user_id', columns='movie_id', values='rating')
    user_movie_matrix.fillna(0, inplace=True)
    return user_movie_matrix

# Function to recommend movies using KNN
def recommend_movies(user_id, user_movie_matrix, movies, n_recommendations=5):
    model_knn = NearestNeighbors(metric='cosine', algorithm='brute')
    model_knn.fit(user_movie_matrix)

    user_index = user_movie_matrix.index.get_loc(user_id)
    distances, indices = model_knn.kneighbors(user_movie_matrix.iloc[user_index, :].values.reshape(1, -1), n_neighbors=n_recommendations + 1)

    recommended_movies = []
    for i in range(1, len(distances.flatten())):
        recommended_movie_id = user_movie_matrix.columns[indices.flatten()[i]]
        movie_title = movies[movies['movie_id'] == recommended_movie_id]['title'].values[0]
        recommended_movies.append(movie_title)
    
    return recommended_movies

# API endpoint to get recommendations
@app.route('/recommend', methods=['POST'])
def recommend():
    data = request.get_json()
    user_id = data.get('user_id')

    # Fetch the data
    movies, ratings = fetch_data()

    # Create the user-movie matrix
    user_movie_matrix = create_user_movie_matrix(ratings)

    # Get movie recommendations for the specified user
    recommendations = recommend_movies(user_id, user_movie_matrix, movies, n_recommendations=5)

    # Return the recommendations as JSON
    return jsonify(recommendations)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

