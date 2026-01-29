import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import MovieDataService from "../service/api";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";

import dayjs from "dayjs";

type User = {
    name: string;
    id: string;
};

type Review = {
    _id: string;
    name: string;
    user_id: string;
    date: string;
    review: string;
};

type MovieType = {
    _id?: string;
    title: string;
    rated?: string;
    poster?: string;
    plot?: string;
    reviews: Review[];
};

type MovieProps = {
    user: User | null;
};

const Movie = ({ user }: MovieProps) => {
    const { id } = useParams<{ id: string }>();

    const [movie, setMovie] = useState<MovieType>({
        title: "",
        rated: "",
        poster: "",
        plot: "",
        reviews: [],
    });

    useEffect(() => {
        if (!id) return;
        let alive = true;

        (async () => {
            try {
                const response = await MovieDataService.get(id);
                if (!alive) return;

                setMovie(response.data as MovieType);
            } catch (e) {
                console.error("Failed to fetch movie:", e);
            }
        })();

        return () => {
            alive = false;
        };
    }, [id]);

    const deleteReview = async (reviewId: string, index: number) => {
        if (!user) return;

        try {
            await MovieDataService.deleteReview(reviewId, user.id);

            setMovie((prev) => ({
                ...prev,
                reviews: prev.reviews.filter((_, i) => i !== index),
            }));
        } catch (e) {
            console.error("Failed to delete review:", e);
        }
    };

    if (!movie.title) {
        return (
            <div className="App">
                <Container>
                    <p>Loading movie...</p>
                </Container>
            </div>
        );
    }

    return (
        <div className="App">
            <Container>
                <Row>
                    <Col md={4}>
                        {movie.poster ? (
                            <Image src={`${movie.poster}/150px250`} fluid alt={movie.title} />
                        ) : (
                            <div style={{ width: 150, height: 250, background: "#eee" }} />
                        )}
                    </Col>

                    <Col>
                        <Card>
                            <Card.Header as="h5">{movie.title}</Card.Header>
                            <Card.Body>
                                <Card.Text>{movie.plot ?? ""}</Card.Text>

                                {user && (
                                    <Link to={`/movies/${id}/review`} className="btn btn-primary">
                                        Add Review
                                    </Link>
                                )}
                            </Card.Body>
                        </Card>

                        <br />
                        <h2>Reviews</h2>
                        <br />

                        {movie.reviews.length === 0 ? (
                            <p>No reviews yet.</p>
                        ) : (
                            movie.reviews.map((review, index) => (
                                <Card key={review._id} className="mb-3">
                                    <Card.Body>
                                        <h5>
                                            {review.name} reviewed on{" "}
                                            {dayjs(review.date).format("DD MMMM YYYY")}
                                        </h5>
                                        <p>{review.review}</p>

                                        {user && user.id === review.user_id && (
                                            <Row>
                                                <Col>
                                                    <Link
                                                        to={`/movies/${id}/review`}
                                                        state={{ currentReview: review }}
                                                        className="btn btn-outline-primary btn-sm"
                                                    >
                                                        Edit
                                                    </Link>
                                                </Col>
                                                <Col>
                                                    <Button
                                                        variant="outline-danger"
                                                        size="sm"
                                                        onClick={() => deleteReview(review._id, index)}
                                                    >
                                                        Delete
                                                    </Button>
                                                </Col>
                                            </Row>
                                        )}
                                    </Card.Body>
                                </Card>
                            ))
                        )}
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Movie;