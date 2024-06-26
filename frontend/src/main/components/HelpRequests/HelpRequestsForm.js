import { Button, Form, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

function HelpRequestsForm({ initialContents, submitAction, buttonLabel = "Create" }) {

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


    return (

        <Form onSubmit={handleSubmit(submitAction)}>


            <Row>

                {initialContents && (
                    <Col>
                        <Form.Group className="mb-3" >
                            <Form.Label htmlFor="id">Id</Form.Label>
                            <Form.Control
                                data-testid="HelpRequests-id"
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
                        <Form.Label htmlFor="requesterEmail">Requester Email</Form.Label>
                        <Form.Control
                            data-testid="HelpRequests-requesterEmail"
                            id="requesterEmail"
                            type="text"
                            isInvalid={Boolean(errors.requesterEmail)}
                            {...register("requesterEmail", { required: true })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.requesterEmail && 'Requester Email is required. '}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>

                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="requestTime">Date(iso format)</Form.Label>
                        <Form.Control
                            data-testid="HelpRequests-requestTime"
                            id="requestTime"
                            type="datetime-local"
                            isInvalid={Boolean(errors.requestTime)}
                            {...register("requestTime", { required: true, pattern: isodate_regex })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.requestTime && 'LocalDateTime is required. '}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>

            <Row>

                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="teamId">Team ID</Form.Label>
                        <Form.Control
                            data-testid="HelpRequests-teamId"
                            id="teamId"
                            type="text"
                            isInvalid={Boolean(errors.teamId)}
                            {...register("teamId", { required: true})}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.teamId && 'TeamId is required. '}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>

                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="tableOrBreakoutRoom">Table or Breakout Room</Form.Label>
                        <Form.Control
                            data-testid="HelpRequests-tableOrBreakoutRoom"
                            id="tableOrBreakoutRoom"
                            type="text"
                            isInvalid={Boolean(errors.tableOrBreakoutRoom)}
                            {...register("tableOrBreakoutRoom", { required: true })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.tableOrBreakoutRoom && 'tableOrBreakoutRoom is required. '}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>

            <Row>

                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="explanation">Explanation</Form.Label>
                        <Form.Control
                            data-testid="HelpReqiests-explanation"
                            id="explanation"
                            type="text"
                            isInvalid={Boolean(errors.explanation)}
                            {...register("explanation", { required: true})}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.explanation && 'Explanation is required. '}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>

                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="solved">Solved(true/false)</Form.Label>
                        <Form.Check 
                            type="checkbox"
                            id="solved"
                            data-testid="HelpRequests-Solved"
                            isInvalid={Boolean(errors.solved)}
                            {...register("solved", { })}
                        />
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Button
                        type="submit"
                        data-testid="HelpRequestsForm-submit"
                    >
                        {buttonLabel}
                    </Button>
                    <Button
                        variant="Secondary"
                        onClick={() => navigate(-1)}
                        data-testid="UCSBDateForm-cancel"
                    >
                        Cancel
                    </Button>
                </Col>
            </Row>
        </Form>

    )
}

export default HelpRequestsForm;
