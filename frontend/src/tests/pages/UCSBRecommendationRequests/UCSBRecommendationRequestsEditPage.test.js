import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import UCSBRecommendationRequestsEditPage from "main/pages//UCSBRecommendationRequestsEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "jest-mock-console";

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
        useParams: () => ({
            id: 17
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("UCSBRecommendationRequestsEditPage tests", () => {

    describe("when the backend doesn't return data", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/", { params: { id: 17 } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <RestaurantEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await screen.findByText("Edit UCSBRecommendationRequests");
            expect(screen.queryByTestId("UCSBRecommendationRequests-requesterEmail")).not.toBeInTheDocument();
            restoreConsole();
        });
    });

    describe("tests where backend is working normally", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/recommendationrequests", { params: { id: 17 } }).reply(200, {
                id : 17,
                requesterEmail : "requester email 17",
                professorEmail : "professor email 17",
                explanation : "explanation 17",
                dateRequested : "2022-07-17T12:00:00",
                dateNeeded : "2022-08-17T12:00:00",
                done : false  
            });
            axiosMock.onPut('/api/recommendationrequests').reply(200, {
                id : 17,
                requesterEmail : "requester email 17",
                professorEmail : "professor email 17",
                explanation : "explanation 17",
                dateRequested : "2022-07-17T12:00:00",
                dateNeeded : "2022-08-17T12:00:00",
                done : false  
            });
        });

        const queryClient = new QueryClient();
    
        test("Is populated with the data provided", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <UCSBRecommendationRequestsEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("UCSBRecommendationRequestsForm-id");

            const idField = screen.getByTestId("UCSBRecommendationRequestsForm-id");
            const requesterEmailField = screen.getByTestId("UCSBRecommendationRequestsForm-requesterEmail");
            const professorEmailField = screen.getByTestId("UCSBRecommendationRequestsForm-professorEmail");
            const explanationField = screen.getByTestId("UCSBRecommendationRequestsForm-explanation");
            const dateRequestedField = screen.getByTestId("UCSBRecommendationRequestsForm-dateRequested");
            const dateNeededField = screen.getByTestId("UCSBRecommendationRequestsForm-dateNeeded");
            const doneField = screen.getByTestId("UCSBRecommendationRequestsForm-done");
            const submitButton = screen.getByTestId("UCSBRecommendationRequestsForm-submit");

            expect(idField).toBeInTheDocument();
            expect(idField).toHaveValue("17");
            expect(requesterEmailField).toBeInTheDocument();
            expect(requesterEmailField).toHaveValue("requester email 17");
            expect(professorEmailField).toBeInTheDocument();
            expect(professorEmailField).toHaveValue("professor email 17");
            expect(explanationField).toBeInTheDocument();
            expect(explanationField).toHaveValue("explanation 17");
            expect(dateRequestedField).toBeInTheDocument();
            expect(dateRequestedField).toHaveValue("2022-07-17T12:00:00");
            expect(dateNeededField).toBeInTheDocument();
            expect(dateNeededField).toHaveValue("2022-08-17T12:00:00");
            expect(doneField).toBeInTheDocument();
            expect(doneField).toHaveValue(false);

            expect(submitButton).toHaveTextContent("Update");

            fireEvent.change(requesterEmailField, { target: { value: 'new email' } });
            fireEvent.change(professorEmailField, { target: { value: 'new p email' } });
            fireEvent.change(explanationField, { target: { value: 'new explanation' } });
            fireEvent.change(dateRequestedField, { target: { value: '2023-07-17T12:00:00' } });
            fireEvent.change(dateNeededField, { target: { value: '2022-08-17T12:00:00' } });
            fireEvent.change(doneField, { target: { value: true } });
            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("UCSBRecommendationRequests Updated - id: 17 requesterEmail: new email");
            
            expect(mockNavigate).toBeCalledWith({ "to": "/UCSBRecommendationRequests" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                requesterEmail : "new email",
                professorEmail : "new p email",
                explanation : "new explanation",
                dateRequested : "2023-07-17T12:00:00",
                dateNeeded : "2023-08-17T12:00:00",
                done : true  
            })); // posted object


        });

        test("Changes when you click Update", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <UCSBRecommendationRequestsEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("UCSBRecommendationRequestsForm-id");

            const idField = screen.getByTestId("UCSBRecommendationRequestsForm-id");
            const requesterEmailField = screen.getByTestId("UCSBRecommendationRequestsForm-requesterEmail");
            const professorEmailField = screen.getByTestId("UCSBRecommendationRequestsForm-professorEmail");
            const explanationField = screen.getByTestId("UCSBRecommendationRequestsForm-explanation");
            const dateRequestedField = screen.getByTestId("UCSBRecommendationRequestsForm-dateRequested");
            const dateNeededField = screen.getByTestId("UCSBRecommendationRequestsForm-dateNeeded");
            const doneField = screen.getByTestId("UCSBRecommendationRequestsForm-done");
            const submitButton = screen.getByTestId("UCSBRecommendationRequestsForm-submit");

            expect(idField).toHaveValue("17");
            expect(requesterEmailField).toHaveValue("requester email 17");
            expect(professorEmailField).toHaveValue("professor email 17");
            expect(explanationField).toHaveValue("explanation 17");
            expect(dateRequestedField).toHaveValue("2022-07-17T12:00:00");
            expect(dateNeededField).toHaveValue("2022-08-17T12:00:00");
            expect(doneField).toHaveValue(false);

            fireEvent.change(requesterEmailField, { target: { value: 'new email' } });
            fireEvent.change(professorEmailField, { target: { value: 'new p email' } });
            fireEvent.change(explanationField, { target: { value: 'new explanation' } });
            fireEvent.change(dateRequestedField, { target: { value: '2023-07-17T12:00:00' } });
            fireEvent.change(dateNeededField, { target: { value: '2022-08-17T12:00:00' } });
            fireEvent.change(doneField, { target: { value: true } });
            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("UCSBRecommendationRequests Updated - id: 17 ");
            expect(mockNavigate).toBeCalledWith({ "to": "/UCSBRecommendationRequests" });
        });

       
    });
});
