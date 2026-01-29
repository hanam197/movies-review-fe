import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import FormGroup from "react-bootstrap/esm/FormGroup";

interface LoginProps {
    login: (data: LoginFormData) => void;
}

export interface LoginFormData {
    name: string;
    id: string;
}

const Login = ({ login }: LoginProps) => {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>();

    const onSubmit = (data: LoginFormData) => {
        login(data);
        navigate("/");
    };

    return (
        <div className="App">
            <Form
                style={{ width: "100%", margin: "auto" }}
                onSubmit={handleSubmit(onSubmit)}
            >
                <FormGroup>
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter username"
                        {...register("name", { required: "Username is required" })}
                    />
                    {errors.name?.message && (
                        <p style={{ color: "red" }}>{errors.name.message}</p>
                    )}
                </FormGroup>

                <FormGroup>
                    <Form.Label>ID</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter ID"
                        {...register("id", { required: "ID is required" })}
                    />
                    {errors.id?.message && (
                        <p style={{ color: "red" }}>{errors.id.message}</p>
                    )}
                </FormGroup>

                <Button type="submit" style={{ marginTop: "10px" }} variant="primary">
                    Submit
                </Button>
            </Form>
        </div>
    );
};

export default Login;