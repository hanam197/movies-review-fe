import { useEffect, useState, type ChangeEvent } from "react";
import { Link } from "react-router-dom";


import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import MovieDataService from "../service/api";

type MovieListItem = {
    _id: string;
    title: string;
    rated?: string;
    poster?: string;
    plot?: string;
};

type MoviesResponse = {
    movies: MovieListItem[];
    page: number;
    entries_per_page: number;
};

type AppliedSearch =
    | { mode: ""; title: ""; rating: "" }
    | { mode: "findByTitle"; title: string; rating: "" }
    | { mode: "findByRating"; title: ""; rating: string };

const MoviesList = () => {
    const [movies, setMovies] = useState<MovieListItem[]>([]);
    const [searchTitle, setSearchTitle] = useState<string>("");
    const [searchRating, setSearchRating] = useState<string>("All Ratings");
    const [ratings, setRatings] = useState<string[]>(["All Ratings"]);

    const [currentPage, setCurrentPage] = useState<number>(0);
    const [entriesPerPage, setEntriesPerPage] = useState<number>(0);
    const [appliedSearch, setAppliedSearch] = useState<AppliedSearch>({
        mode: "",
        title: "",
        rating: "",
    });

    const retrieveMovies = async (page: number) => {
        try {
            const response = await MovieDataService.getAll(page);
            const data = response.data as MoviesResponse;

            setMovies(data.movies);
            setCurrentPage(data.page);
            setEntriesPerPage(data.entries_per_page);
        } catch (e) {
            console.error(e);
        }
    };

    const retrieveRatings = async () => {
        try {
            const response = await MovieDataService.getRating();

            setRatings(["All Ratings", ...response.data]);
        } catch (e) {
            console.error(e);
        }
    };

    const find = async (query: string, by: "title" | "rated", page: number) => {
        try {
            const response = await MovieDataService.find(query, by, page);
            const data = response.data as MoviesResponse;

            setMovies(data.movies);
            setCurrentPage(data.page);
            setEntriesPerPage(data.entries_per_page);
        } catch (e) {
            console.error(e);
        }
    };

    const findByTitle = async () => {
        setCurrentPage(0);
        setAppliedSearch({ mode: "findByTitle", title: searchTitle, rating: "" });
        await find(searchTitle, "title", 0);
    };

    const findByRating = async () => {
        setCurrentPage(0);

        if (searchRating === "All Ratings") {
            setAppliedSearch({ mode: "", title: "", rating: "" });
            await retrieveMovies(0);
        } else {
            setAppliedSearch({
                mode: "findByRating",
                title: "",
                rating: searchRating,
            });
            await find(searchRating, "rated", 0);
        }
    };

    useEffect(() => {
        (async () => {
            await retrieveRatings();
        })();
    }, []);

    useEffect(() => {
        (async () => {
            if (appliedSearch.mode === "findByTitle") {
                await find(appliedSearch.title, "title", currentPage);
            } else if (appliedSearch.mode === "findByRating") {
                await find(appliedSearch.rating, "rated", currentPage);
            } else {
                await retrieveMovies(currentPage);
            }
        })();
    }, [currentPage, appliedSearch]);

    const onChangeSearchTitle = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchTitle(e.target.value);
    };

    const onChangeSearchRating = (e: ChangeEvent<HTMLSelectElement>) => {
        setSearchRating(e.target.value);
    };

    return (
        <div className="App">
            <Container>
                <h2 className="my-3">Movie Search</h2>

                <Form className="mb-4">
                    <Row>
                        <Col md={6}>
                            <Form.Control
                                type="text"
                                placeholder="Search by title"
                                value={searchTitle}
                                onChange={onChangeSearchTitle}
                            />
                            <Button className="mt-2" onClick={findByTitle}>
                                Search
                            </Button>
                        </Col>

                        <Col md={6}>
                            <Form.Select value={searchRating} onChange={onChangeSearchRating}>
                                {ratings.map((rating) => (
                                    <option key={rating} value={rating}>
                                        {rating}
                                    </option>
                                ))}
                            </Form.Select>
                            <Button className="mt-2" onClick={findByRating}>
                                Search
                            </Button>
                        </Col>
                    </Row>
                </Form>

                <Row className="g-4">
                    {movies.map((movie) => (
                        <Col md={4} key={movie._id}>
                            <Card>
                                <Card.Img
                                    variant="top"
                                    src={movie.poster ? `${movie.poster}/100px180` : ""}
                                    alt={movie.title}
                                />
                                <Card.Body>
                                    <Card.Title>{movie.title}</Card.Title>
                                    <Card.Text>
                                        <strong>Rating:</strong> {movie.rated ?? ""}
                                    </Card.Text>
                                    <Card.Text>{movie.plot ?? ""}</Card.Text>
                                    <Link to={`/movies/${movie._id}`}>View Reviews</Link>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>

                {movies.length > 0 && (
                    <div className="mt-4 text-center">
                        <p>Showing Page: {currentPage}</p>
                        <Button variant="link" onClick={() => setCurrentPage((p) => p + 1)}>
                            Get next {entriesPerPage} results
                        </Button>
                    </div>
                )}
            </Container>
        </div>
    );
};

export default MoviesList;