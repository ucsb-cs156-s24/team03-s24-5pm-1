import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import HelpRequestsEditPage from "main/pages/HelpRequests/HelpRequestsEditPage";

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

describe("HelpRequestsEditPage tests", () => {

    describe("when the backend doesn't return data", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/helprequest", { params: { id: 17 } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <HelpRequestsEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await screen.findByText("Edit Help Request");
            expect(screen.queryByTestId("HelpRequests-requestTime")).not.toBeInTheDocument();
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
            axiosMock.onGet("/api/helprequest", { params: { id: 17 } }).reply(200, {
                "id": 17,
                "requesterEmail": "test2@test.com",
                "teamId": "team2",
                "tableOrBreakoutRoom": "table2",
                "requestTime": "2024-05-29T17:14:00",
                "explanation": "explanation2",
                "solved": true
                // name: "Pi Day",
            });
            axiosMock.onPut('/api/helprequest').reply(200, {
                "id": 17,
                "requesterEmail": "test3@test.com",
                "teamId": "team3",
                "tableOrBreakoutRoom": "table3",
                "requestTime": "2024-05-20T17:15:00",
                "explanation": "explanation3",
                "solved": false
                // name: "Christmas Morning",
            });
        });

        const queryClient = new QueryClient();
        test("renders without crashing", () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <HelpRequestsEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
        });

        test("Is populated with the data provided", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <HelpRequestsEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("HelpRequests-requestTime");

            const idField = screen.getByTestId("HelpRequests-id");
            const requesterEmail = screen.getByTestId("HelpRequests-requesterEmail");
            const teamId = screen.getByTestId("HelpRequests-teamId");
            const requestTime = screen.getByTestId("HelpRequests-requestTime");
            const tableOrBreakoutRoom = screen.getByTestId("HelpRequests-tableOrBreakoutRoom");
            const explanation = screen.getByTestId("HelpReqiests-explanation");
            const solved = screen.getByTestId("HelpRequests-Solved");

            const submitButton = screen.getByTestId("HelpRequestsForm-submit");

            expect(idField).toHaveValue("17");
            expect(requesterEmail).toHaveValue("test2@test.com");
            expect(tableOrBreakoutRoom).toHaveValue("table2");
            expect(requestTime).toHaveValue("2024-05-29T17:14");
            expect(explanation).toHaveValue("explanation2");
            expect(solved).toBeChecked();
            expect(teamId).toHaveValue("team2");

            expect(submitButton).toBeInTheDocument();
        });

        test("Changes when you click Update", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <HelpRequestsEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("HelpRequests-id");

            const idField = screen.getByTestId("HelpRequests-id");
            const requesterEmail = screen.getByTestId("HelpRequests-requesterEmail");
            const teamId = screen.getByTestId("HelpRequests-teamId");
            const requestTime = screen.getByTestId("HelpRequests-requestTime");
            const tableOrBreakoutRoom = screen.getByTestId("HelpRequests-tableOrBreakoutRoom");
            const explanation = screen.getByTestId("HelpReqiests-explanation");
            const solved = screen.getByTestId("HelpRequests-Solved");

            const submitButton = screen.getByTestId("HelpRequestsForm-submit");


            expect(idField).toHaveValue("17");
            expect(requesterEmail).toHaveValue("test2@test.com");
            expect(tableOrBreakoutRoom).toHaveValue("table2");
            expect(requestTime).toHaveValue("2024-05-29T17:14");
            expect(explanation).toHaveValue("explanation2");
            expect(solved).toBeChecked();
            expect(teamId).toHaveValue("team2");

            expect(submitButton).toBeInTheDocument();

            fireEvent.change(requesterEmail, { target: { value: 'test3@test.com' } })
            fireEvent.change(tableOrBreakoutRoom, { target: { value: 'table3' } })
            fireEvent.change(explanation, { target: { value: 'explanation3' } })
            fireEvent.click(solved) // To change the checkbox from true to false
            fireEvent.change(tableOrBreakoutRoom, { target: { value: 'table3' } })
            fireEvent.change(teamId, { target: { value: 'team3' } })
            fireEvent.change(requestTime, { target: { value: "2024-05-20T17:15:00" } })

            fireEvent.click(submitButton);

            /*
            "id": 3,
            "requesterEmail": "test3@test.com",
            "teamId": "team3",
            "tableOrBreakoutRoom": "table3",
            "requestTime": "2024-05-20T17:15:00",
            "explanation": "explanation3",
            "solved": false
            */

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("HelpRequest Updated - id: 17");
            expect(mockNavigate).toBeCalledWith({ "to": "/helprequests" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                "requesterEmail": "test3@test.com",
                "teamId": "team3",
                "tableOrBreakoutRoom": "table3",
                "explanation": "explanation3",
                "solved": false,
                "requestTime": "2024-05-20T17:15",
            })); // posted object

        });

       
    });
});


