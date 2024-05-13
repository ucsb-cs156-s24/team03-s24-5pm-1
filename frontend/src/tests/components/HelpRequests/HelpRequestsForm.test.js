import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import HelpRequestsForm from "main/components/HelpRequests/HelpRequestsForm";
import { helpRequestsFixtures } from "fixtures/helpRequestsFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));


describe("HelpRequestsForm tests", () => {

    test("renders correctly", async () => {

        render(
            <Router  >
                <HelpRequestsForm />
            </Router>
        );
        await screen.findByText(/Requester Email/);
        await screen.findByText(/Create/);
    });


    test("renders correctly when passing in a HelpRequests", async () => {

        render(
            <Router  >
                <HelpRequestsForm initialContents={helpRequestsFixtures.oneDate} />
            </Router>
        );
        await screen.findByTestId(/HelpRequests-id/);
        expect(screen.getByText(/Id/)).toBeInTheDocument();
        expect(screen.getByTestId(/HelpRequests-id/)).toHaveValue("1");
    });


    test("Correct Error messsages on bad input", async () => {

        render(
            <Router  >
                <HelpRequestsForm />
            </Router>
        );
        await screen.findByTestId("HelpRequests-requesterEmail");

        const requesterEmail = screen.getByTestId("HelpRequests-requesterEmail");
        const teamId = screen.getByTestId("HelpRequests-teamId");
        const requestTime = screen.getByTestId("HelpRequests-requestTime");
        const tableOrBreakoutRoom = screen.getByTestId("HelpRequests-tableOrBreakoutRoom");
        const explanation = screen.getByTestId("HelpReqiests-explanation");
        const solved = screen.getByTestId("HelpRequests-Solved");

        const submitButton = screen.getByTestId("HelpRequestsForm-submit");

        // fireEvent.change(requesterEmail, { target: { value: 'test' } })
        // fireEvent.change(tableOrBreakoutRoom, { target: { value: 'table' } })
        // fireEvent.change(explanation, { target: { value: '' } })
        // fireEvent.click(solved) // To change the checkbox from true to false
        // fireEvent.change(tableOrBreakoutRoom, { target: { value: 'table' } })
        // fireEvent.change(teamId, { target: { value: 'teamTest' } })
        // fireEvent.change(requestTime, { target: { value: "2024-05-30T16:58:00" } })

        fireEvent.click(submitButton);


        await screen.findByText(/LocalDateTime is required./);
        await screen.findByText(/Requester Email is required./);
        await screen.findByText(/TeamId is required./);
        await screen.findByText(/tableOrBreakoutRoom is required./);
        await screen.findByText(/Explanation is required./);
    });

    test("Correct Error messsages on missing input", async () => {

        render(
            <Router  >
                <HelpRequestsForm />
            </Router>
        );
        await screen.findByTestId("HelpRequestsForm-submit");
        const submitButton = screen.getByTestId("HelpRequestsForm-submit");

        fireEvent.click(submitButton);

        await screen.findByText(/Requester Email is required./);
        expect(screen.getByText(/LocalDateTime is required./)).toBeInTheDocument();
        expect(screen.getByText(/LocalDateTime is required./)).toBeInTheDocument();

    });

    test("No Error messsages on good input", async () => {

        const mockSubmitAction = jest.fn();


        render(
            <Router  >
                <HelpRequestsForm submitAction={mockSubmitAction} />
            </Router>
        );
        await screen.findByTestId("HelpRequests-requesterEmail");

        const requesterEmail = screen.getByTestId("HelpRequests-requesterEmail");
        const teamId = screen.getByTestId("HelpRequests-teamId");
        const requestTime = screen.getByTestId("HelpRequests-requestTime");
        const tableOrBreakoutRoom = screen.getByTestId("HelpRequests-tableOrBreakoutRoom");
        const explanation = screen.getByTestId("HelpReqiests-explanation");
        const solved = screen.getByTestId("HelpRequests-Solved");

        const submitButton = screen.getByTestId("HelpRequestsForm-submit");

        fireEvent.change(requesterEmail, { target: { value: 'test' } })
        fireEvent.change(tableOrBreakoutRoom, { target: { value: 'table' } })
        fireEvent.change(explanation, { target: { value: 'explain' } })
        fireEvent.click(solved) // To change the checkbox from true to false
        fireEvent.change(tableOrBreakoutRoom, { target: { value: 'table' } })
        fireEvent.change(teamId, { target: { value: 'teamTest' } })
        fireEvent.change(requestTime, { target: { value: "2024-05-30T16:58:00" } })

        fireEvent.click(submitButton);

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

        expect(screen.queryByText(/localDateTime must be in ISO format/)).not.toBeInTheDocument();

    });


    test("that navigate(-1) is called when Cancel is clicked", async () => {

        render(
            <Router  >
                <HelpRequestsForm />
            </Router>
        );
        await screen.findByTestId("UCSBDateForm-cancel");
        const cancelButton = screen.getByTestId("UCSBDateForm-cancel");

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));

    });

});


