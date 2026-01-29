import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL ||'http://localhost:3000';

export type ReviewPayload = {
    movie_id?: string;
    review?: string;
    user_id?: string;
    name?: string;
    review_id?: string;
};

const MovieDataService = {
    async getAll(page: number = 0) {
        try {
            return await axios.get(`${API_URL}/api/v1/movies?page=${page}`);
        } catch (error) {
            console.error('Error fetching all movies:', error);
            throw error;
        }
    },

    async get(id: string) {
        try {
            return await axios.get(`${API_URL}/api/v1/movies/id/${id}`);
        } catch (error) {
            console.error(`Error fetching movie with id ${id}:`, error);
            throw error;
        }
    },

    async find(query: string, by = 'title', page = 0) {
        try {
            return await axios.get(`${API_URL}/api/v1/movies?${by}=${query}&page=${page}`);
        } catch (error) {
            console.error('Error finding movies:', error);
            throw error;
        }
    },

    async createReview(data: ReviewPayload) {
        try {
            return await axios.post(`${API_URL}/api/v1/movies/review`, data);
        } catch (error) {
            console.error('Error creating review:', error);
            throw error;
        }
    },

    async updateReview(data: ReviewPayload) {
        try {
            return await axios.put(`${API_URL}/api/v1/movies/review`, data);
        } catch (error) {
            console.error('Error updating review:', error);
            throw error;
        }
    },

    async deleteReview(id: string, userId: string) {
        try {
            return await axios.delete(`${API_URL}/api/v1/movies/review`, {
                data: {
                    review_id: id,
                    user_id: userId,
                },
            });
        } catch (error) {
            console.error('Error deleting review:', error);
            throw error;
        }
    },

    async getRating() {
        try {
            return await axios.get<string[]>(`${API_URL}/api/v1/movies/ratings`);
        } catch (error) {
            console.error('Error fetching ratings:', error);
            throw error;
        }
    },
};

export default MovieDataService
