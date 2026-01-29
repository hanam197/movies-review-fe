import { useState } from "react";
import "./App.css";

import { Route, Link, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import MovieList from "./component/MoviesList";
import AddReview  from "./component/AddReview";
import  Movie  from "./component/Movie";
import Login, { type LoginFormData } from "./component/Login";



type User = LoginFormData; // { name: string; id: string }
type UserState = User | null;

function App() {
    const [user, setUser] = useState<UserState>(null);

    function login(data: User) {
        setUser(data);
    }

    function logout() {
        setUser(null);
    }

    return (
        <>
            <Navbar expand="lg" className="bg-body-tertiary">
                <Container>
                    <Navbar.Brand href="/">Movies-Review</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to={"/movies"}>
                                Movies
                            </Nav.Link>
                            {user ? (
                                <Nav.Link onClick={logout}>Logout</Nav.Link>
                            ) : (
                                <Nav.Link as={Link} to={"/login"}>
                                    Login
                                </Nav.Link>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Routes>
                <Route path={"/"} element={<MovieList />} />
                <Route path={"/movies"} element={<MovieList />} />
                <Route path="/movies/:id/review" element={<AddReview user={user} />} />
                <Route path="/movies/:id" element={<Movie user={user} />} />
                <Route path="/login" element={<Login login={login} />} />
            </Routes>
        </>
    );
}

export default App;