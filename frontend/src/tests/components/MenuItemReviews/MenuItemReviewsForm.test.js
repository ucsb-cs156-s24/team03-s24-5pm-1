import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import MenuItemReviewsForm from "main/components/MenuItemReviews/MenuItemReviewsForm";

import { QueryClient, QueryClientProvider } from "react-query";
import { menuItemReviewsFixtures } from "fixtures/menuItemReviewsFixtures";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("MenuItemReviewsForm tests", () => {
    const queryClient = new QueryClient();

    const expectedHeaders = ["Item Id", "Reviewer Email", "Stars", "Comments", "Date (iso format)"];
    const testId = "MenuItemReviewsForm";

    test("renders correctly with no initialContents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <MenuItemReviewsForm />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

    });

    test("renders correctly when passing in initialContents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <MenuItemReviewsForm initialContents={menuItemReviewsFixtures.oneMenuItemReview} />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

        expect(await screen.findByTestId(`${testId}-id`)).toBeInTheDocument();
        expect(screen.getByText(`Id`)).toBeInTheDocument();
    });


    test("that navigate(-1) is called when Cancel is clicked", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <MenuItemReviewsForm />
                </Router>
            </QueryClientProvider>
        );
        expect(await screen.findByTestId(`${testId}-cancel`)).toBeInTheDocument();
        const cancelButton = screen.getByTestId(`${testId}-cancel`);

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
    });

    test("No Error messsages on good input", async () => {

        const mockSubmitAction = jest.fn();

        render(
            <Router  >
                <MenuItemReviewsForm submitAction={mockSubmitAction} />
            </Router>
        );
        await screen.findByTestId("MenuItemReviewsForm-itemId");

        const itemIdField = screen.getByTestId("MenuItemReviewsForm-itemId");
        const reviewerEmailField = screen.getByTestId("MenuItemReviewsForm-reviewerEmail");
        const starsField = screen.getByTestId("MenuItemReviewsForm-stars");
        const commentsField = screen.getByTestId("MenuItemReviewsForm-comments");
        const dateReviewedField = screen.getByTestId("MenuItemReviewsForm-dateReviewed");
        const submitButton = screen.getByTestId("MenuItemReviewsForm-submit");

        fireEvent.change(itemIdField, { target: { value: '10' } });
        fireEvent.change(reviewerEmailField, { target: { value: 'pmanopchantaroj@ucsb.edu' } });
        fireEvent.change(starsField, { target: { value: '1' } });
        fireEvent.change(commentsField, { target: { value: 'roast beef is as dry as the desert' } });
        fireEvent.change(dateReviewedField, { target: { value: '2024-05-05T04:44' } });
        fireEvent.click(submitButton);

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

        expect(screen.queryByText(/Max 5/)).not.toBeInTheDocument();
        expect(screen.queryByText(/Min 1/)).not.toBeInTheDocument();
        expect(screen.queryByText(/dateReviewed must be in ISO format/)).not.toBeInTheDocument();

    });

    test("that the correct validations are performed", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <MenuItemReviewsForm />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();
        const submitButton = screen.getByText(/Create/);
        fireEvent.click(submitButton);

        await screen.findByText(/itemId is required./);
        expect(screen.getByText(/reviewerEmail is required./)).toBeInTheDocument();
        expect(screen.getByText(/stars is required./)).toBeInTheDocument();
        expect(screen.getByText(/comments is required./)).toBeInTheDocument();
        expect(screen.getByText(/dateReviewed is required./)).toBeInTheDocument();

        const starsInput1 = screen.getByTestId(`${testId}-stars`);
        fireEvent.change(starsInput1, { target: { value: 6 } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/Max 5/)).toBeInTheDocument();
        });

        const starsInput2 = screen.getByTestId(`${testId}-stars`);
        fireEvent.change(starsInput2, { target: { value: 0 } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/Min 1/)).toBeInTheDocument();
        });
    });

});