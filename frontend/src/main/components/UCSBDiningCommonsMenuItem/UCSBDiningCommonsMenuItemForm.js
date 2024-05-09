import { Button, Form, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

function UCSBMenuItemForm({ initialContents, submitAction, buttonLabel = "Create" }) {

    // Stryker disable all
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm(
        { defaultValues: initialContents || {}, }
    );
    // Stryker restore all

    const navigate = useNavigate();

    // For explanation, see: https://stackoverflow.com/questions/3143070/javascript-regex-iso-datetime
    // Note that even this complex regex may still need some tweaks

    // Stryker disable next-line Regex
    const isodate_regex = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d)/i;

    // Stryker disable next-line all
    const yyyyq_regex = /((19)|(20))\d{2}[1-4]/i; // Accepts from 1900-2099 followed by 1-4.  Close enough.

    return (

        <Form onSubmit={handleSubmit(submitAction)}>


            <Row>

                {initialContents && (
                    <Col>
                        <Form.Group className="mb-3" >
                            <Form.Label htmlFor="id">Id</Form.Label>
                            <Form.Control
                                data-testid="UCSBMenuItemForm-id"
                                id="id"
                                type="text"
                                {...register("id")}
                                value={initialContents.id}
                                disabled
                            />
                        </Form.Group>
                    </Col>
                )}

                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="diningCommonsCode">Dining Common Code</Form.Label>
                        <Form.Control
                            data-testid="UCSBMenuItemForm-diningCommonsCode"
                            id="diningCommonsCode"
                            type="text"
                            isInvalid={Boolean(errors.name)}
                            {...register("diningCommonsCode", {
                                required: "Dining Common Code is required.",
                                maxLength : {
                                    value: 30,
                                    message: "Max length 30 characters"
                                }
                            })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.diningCommonsCode?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="name">Dish Name</Form.Label>
                        <Form.Control
                            data-testid="UCSBMenuItemForm-name"
                            id="name"
                            type="text"
                            isInvalid={Boolean(errors.name)}
                            {...register("name", {
                                required: "Dish Name is required.",
                                maxLength : {
                                    value: 30,
                                    message: "Max length 30 characters"
                                }
                            })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.name?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>

            <Row>

                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="station">Dining Common Station</Form.Label>
                        <Form.Control
                            data-testid="UCSBMenuItemForm-station"
                            id="station"
                            type="text"
                            isInvalid={Boolean(errors.name)}
                            {...register("station", {
                                required: "Dining Common Station is required."
                            })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.station?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Button
                        type="submit"
                        data-testid="UCSBMenuItemForm-submit"
                    >
                        {buttonLabel}
                    </Button>
                    <Button
                        variant="Secondary"
                        onClick={() => navigate(-1)}
                        data-testid="UCSBMenuItemForm-cancel"
                    >
                        Cancel
                    </Button>
                </Col>
            </Row>
        </Form>

    )
}

export default UCSBMenuItemForm;
