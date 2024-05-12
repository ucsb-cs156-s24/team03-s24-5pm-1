import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import UCSBRecommendationRequestsCreatePage from "main/pages/UCSBRecommendationRequests/UCSBRecommendationRequestsPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        __esModule: true,
        ...originalModule,
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("UCSBRecommendationRequestsCreatePage tests", () => {

    const axiosMock =new AxiosMockAdapter(axios);

    beforeEach(() => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    });

    test("renders without crashing", () => {
        const queryClient = new QueryClient();
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <UCSBRecommendationRequestsCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("when you fill in the form and hit submit, it makes a request to the backend", async () => {

        const queryClient = new QueryClient();
        const ucsbRecommendationRequests = {
            id : 17,
            requesterEmail : "requester email 17",
            professorEmail : "professor email 17",
            explanation : "explanation 17",
            dateRequested : "2022-07-17T12:00:00",
            dateNeeded : "2022-08-17T12:00:00",
            done : false  
        };

        axiosMock.onPost("/api/ucsbrecommendationrequests/post").reply( 202, ucsbRecommendationRequests );

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <UCSBRecommendationRequestsCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId("UCSBRecommendationRequestsForm-requesterEmail")).toBeInTheDocument();
        });

        const requesterEmailField = screen.getByTestId("UCSBRecommendationRequestsForm-requesterEmail");
        const professorEmailField = screen.getByTestId("UCSBRecommendationRequestsForm-professorEmail");
        const explanationField = screen.getByTestId("UCSBRecommendationRequestsForm-explanation");
        const dateRequestedField = screen.getByTestId("UCSBRecommendationRequestsForm-dateRequested");
        const dateNeededField = screen.getByTestId("UCSBRecommendationRequestsForm-dateNeeded");
        const doneField = screen.getByTestId("UCSBRecommendationRequestsForm-done");
        const submitButton = screen.getByTestId("UCSBRecommendationRequestsForm-submit");

        fireEvent.change(requesterEmailField, { target: { value: 'requester email 17' } });
        fireEvent.change(professorEmailField, { target: { value: 'professor email 17' } });
        fireEvent.change(explanationField, { target: { value: 'explanation 17' } });
        fireEvent.change(dateRequestedField, { target: { value: '2022-07-17T12:00:00' } });
        fireEvent.change(dateNeededField, { target: { value: '2022-08-17T12:00:00' } });
        fireEvent.change(doneField, { target: { value: false } });

        expect(submitButton).toBeInTheDocument();

        fireEvent.click(submitButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual(
            {
                "requesterEmail" : "requester email 17",
                "professorEmail" : "professor email 17",
                "explanation" : "explanation 17",
                "dateRequested" : "2022-07-17T12:00:00",
                "dateNeeded" : "2022-08-17T12:00:00",
                "done" : false  
        });

        expect(mockToast).toBeCalledWith("New ucsbRecommendationRequests Created - id: 17 requesterEmail: requesterEmail 17");
        expect(mockNavigate).toBeCalledWith({ "to": "/ucsbrecommendationrequests" });
    });


});


