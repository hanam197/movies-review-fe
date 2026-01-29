import { useState, type ChangeEvent } from "react";
import { useParams, useLocation, Link, useNavigate } from "react-router-dom";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import MovieDataService from "../service/api";

type User = {
    name: string;
    id: string;
};

type ReviewFromLocation = {
    _id: string;
    review: string;
};

type LocationState = {
    currentReview?: ReviewFromLocation;
};

type AddReviewProps = {
    user: User | null;
};

type ReviewPayload = {
    review: string;
    name: string;
    user_id: string;
    movie_id: string;
    review_id?: string;
};

const AddReview = ({ user }: AddReviewProps) => {
    const navigate = useNavigate();
    const { id: movieId } = useParams<{ id: string }>();

    const location = useLocation() as { state: LocationState | null };

    const editing = Boolean(location.state?.currentReview);
    const initialReviewState = editing
        ? location.state!.currentReview!.review
        : "";

    const [review, setReview] = useState<string>(initialReviewState);
    const [saving, setSaving] = useState<boolean>(false);

    const onChangeReview = (e: ChangeEvent<HTMLInputElement>) => {
        setReview(e.target.value);
    };

    const saveReview = async () => {
        if (!user) return;
        if (!movieId) return;

        setSaving(true);

        const data: ReviewPayload = {
            review,
            name: user.name,
            user_id: user.id,
            movie_id: movieId,
        };

        try {
            if (editing && location.state?.currentReview?._id) {
                data.review_id = location.state.currentReview._id;
                await MovieDataService.updateReview(data);
            } else {
                await MovieDataService.createReview(data);
            }

            // go back to Movie page immediately
            navigate(`/movies/${movieId}`, { replace: true });
        } catch (e) {
            console.error(
                editing ? "Failed to update review:" : "Failed to create review:",
                e,
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="App">
            <Form className="mt-4">
                <Form.Group className="mb-3">
                    <Form.Label>{editing ? "Edit Review" : "Create Review"}</Form.Label>
                    <Form.Control
                        type="text"
                        required
                        value={review}
                        onChange={onChangeReview}
                        placeholder="Write your review here..."
                        disabled={saving}
                    />
                </Form.Group>

                <Button
                    variant="primary"
                    onClick={saveReview}
                    disabled={!user || saving}
                >
                    {saving ? "Saving..." : "Submit"}
                </Button>

                {!user && (
                    <p style={{ color: "red", marginTop: 10 }}>Please login to review.</p>
                )}

                {/* manual back link (fallback) */}
                {movieId && (
                    <div style={{ marginTop: 12 }}>
                        <Link to={`/movies/${movieId}`}>Back to Movie</Link>
                    </div>
                )}
            </Form>
        </div>
    );
};

export default AddReview;