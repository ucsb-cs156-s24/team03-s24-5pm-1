import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import UCSBMenuItemForm from "main/components/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemForm";
import { ucsbMenuItemFixtures } from "fixtures/ucsbDiningCommonsMenuItemFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));


describe("UCSBMenuItemForm tests", () => {

    test("renders correctly", async () => {

        render(
            <Router  >
                <UCSBMenuItemForm />
            </Router>
        );
        await screen.findByText(/Dining Common Code/);
        await screen.findByText(/Create/);
    });


    test("renders correctly when passing in a UCSBMenuItem", async () => {

        render(
            <Router  >
                <UCSBMenuItemForm initialContents={ucsbMenuItemFixtures.oneItem} />
            </Router>
        );
        await screen.findByTestId(/UCSBMenuItemForm-id/);
        expect(screen.getByText(/Id/)).toBeInTheDocument();
        expect(screen.getByTestId(/UCSBMenuItemForm-id/)).toHaveValue("1");
    });


    test("Correct Error messsages on bad input", async () => {

        render(
            <Router  >
                <UCSBMenuItemForm />
            </Router>
        );
        await screen.findByTestId("UCSBMenuItemForm-diningCommonsCode");
        const codeField = screen.getByTestId("UCSBMenuItemForm-diningCommonsCode");
        const stationField = screen.getByTestId("UCSBMenuItemForm-station");
        const submitButton = screen.getByTestId("UCSBMenuItemForm-submit");

        fireEvent.change(codeField, { target: { value: 'bad-input' } });
        fireEvent.change(stationField, { target: { value: 'bad-input' } });
        fireEvent.click(submitButton);

        //await screen.findByText(/QuarterYYYYQ must be in the format YYYYQ/);
    });

    test("Correct Error messsages on missing input", async () => {

        render(
            <Router  >
                <UCSBMenuItemForm />
            </Router>
        );
        await screen.findByTestId("UCSBMenuItemForm-submit");
        const submitButton = screen.getByTestId("UCSBMenuItemForm-submit");

        fireEvent.click(submitButton);

        await screen.findByText(/Dining Common Code is required./);
        expect(screen.getByText(/Dish Name is required./)).toBeInTheDocument();
        expect(screen.getByText(/Dining Common Station is required./)).toBeInTheDocument();

    });

    test("No Error messsages on good input", async () => {

        const mockSubmitAction = jest.fn();


        render(
            <Router  >
                <UCSBMenuItemForm submitAction={mockSubmitAction} />
            </Router>
        );
        await screen.findByTestId("UCSBMenuItemForm-diningCommonsCode");

        const codeField = screen.getByTestId("UCSBMenuItemForm-diningCommonsCode");
        const stationField = screen.getByTestId("UCSBMenuItemForm-station");
        const nameField = screen.getByTestId("UCSBMenuItemForm-name");
        const submitButton = screen.getByTestId("UCSBMenuItemForm-submit");

        fireEvent.change(codeField, { target: { value: 'ortega' } });
        fireEvent.change(nameField, { target: { value: 'cheese and mac' } });
        fireEvent.change(stationField, { target: { value: 'or take out' } });
        fireEvent.click(submitButton);

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

        expect(screen.queryByText(/QuarterYYYYQ must be in the format YYYYQ/)).not.toBeInTheDocument();
        expect(screen.queryByText(/localDateTime must be in ISO format/)).not.toBeInTheDocument();

    });


    test("that navigate(-1) is called when Cancel is clicked", async () => {

        render(
            <Router  >
                <UCSBMenuItemForm />
            </Router>
        );
        await screen.findByTestId("UCSBMenuItemForm-cancel");
        const cancelButton = screen.getByTestId("UCSBMenuItemForm-cancel");

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));

    });

});


