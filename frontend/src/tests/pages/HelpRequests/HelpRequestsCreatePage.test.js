import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import HelpRequestsCreatePage from "main/pages/HelpRequests/HelpRequestsCreatePage";
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

describe("HelpRequestsCreatePage tests", () => {

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
                    <HelpRequestsCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("when you fill in the form and hit submit, it makes a request to the backend", async () => {

        const queryClient = new QueryClient();
        const helprequest = {
            "id": 17,
            "requesterEmail": "test",
            "teamId": "teamTest",
            "tableOrBreakoutRoom": "table",
            "requestTime": "2024-05-30T16:58:00",
            "explanation": "explain",
            "solved": true
        };

        axiosMock.onPost("/api/helprequest/post").reply( 202, helprequest );

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <HelpRequestsCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId("HelpRequests-requesterEmail")).toBeInTheDocument();
        });

        const requesterEmail = screen.getByTestId("HelpRequests-requesterEmail");
        const teamId = screen.getByTestId("HelpRequests-teamId");
        const requestTime = screen.getByTestId("HelpRequests-requestTime");
        const tableOrBreakoutRoom = screen.getByTestId("HelpRequests-tableOrBreakoutRoom");
        const explanation = screen.getByTestId("HelpReqiests-explanation");
        const solved = screen.getByTestId("HelpRequests-Solved");

        const submitButton = screen.getByTestId("HelpRequestsForm-submit");

        // "id": 1,
        // "requesterEmail": "test",
        // "teamId": "teamTest",
        // "tableOrBreakoutRoom": "table",
        // "requestTime": "2024-05-30T16:58:00",
        // "explanation": "explain",
        // "solved": true

        fireEvent.change(requesterEmail, { target: { value: 'test' } })
        fireEvent.change(tableOrBreakoutRoom, { target: { value: 'table' } })
        fireEvent.change(explanation, { target: { value: 'explain' } })
        fireEvent.click(solved) // To change the checkbox from true to false
        fireEvent.change(tableOrBreakoutRoom, { target: { value: 'table' } })
        fireEvent.change(teamId, { target: { value: 'teamTest' } })
        fireEvent.change(requestTime, { target: { value: "2024-05-30T16:58:00" } })

        expect(submitButton).toBeInTheDocument();

        fireEvent.click(submitButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual(
            {
                "requesterEmail": "test",
                "teamId": "teamTest",
                "tableOrBreakoutRoom": "table",
                "localDateTime": "2024-05-30T16:58",
                "explanation": "explain",
                "solved": true
        });

        expect(mockToast).toBeCalledWith("New helprequest Created - id: 17");
        expect(mockNavigate).toBeCalledWith({ "to": "/helprequests" });
    });


});


