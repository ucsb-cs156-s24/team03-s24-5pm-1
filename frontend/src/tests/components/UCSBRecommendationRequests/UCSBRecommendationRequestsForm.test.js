import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import UCSBRecommendationRequestsForm from "main/components/UCSBRecommendationRequests/UCSBRecommendationRequestsForm";
import { recommendationrequestsFixtures } from "fixtures/ucsbRecommendationRequestsFixtures";

import { QueryClient, QueryClientProvider } from "react-query";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("RecommendationRequests Form tests", () => {
    const queryClient = new QueryClient();

    const expectedHeaders = ["RequesterEmail", "ProfessorEmail", "Explanation", "DateRequested (iso format)", "DateNeeded (iso format)", "Done"];
    const testId = "UCSBRecommendationRequestsForm";

    test("renders correctly with no initialContents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <UCSBRecommendationRequestsForm />
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
                    <UCSBRecommendationRequestsForm initialContents={recommendationrequestsFixtures.oneRecommendationrequests} />
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
                    <UCSBRecommendationRequestsForm />
                </Router>
            </QueryClientProvider>
        );
        expect(await screen.findByTestId(`${testId}-cancel`)).toBeInTheDocument();
        const cancelButton = screen.getByTestId(`${testId}-cancel`);

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
    });

    test("that the correct validations are performed", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <UCSBRecommendationRequestsForm />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();
        const submitButton = screen.getByText(/Create/);
        fireEvent.click(submitButton);

        await screen.findByText(/requesterEmail is required/);
        expect(screen.getByText(/professorEmail is required/)).toBeInTheDocument();
        expect(screen.getByText(/explanation is required/)).toBeInTheDocument();
        expect(screen.getByText(/dateRequested is required/)).toBeInTheDocument();
        expect(screen.getByText(/dateNeeded is required/)).toBeInTheDocument();
    });

});

