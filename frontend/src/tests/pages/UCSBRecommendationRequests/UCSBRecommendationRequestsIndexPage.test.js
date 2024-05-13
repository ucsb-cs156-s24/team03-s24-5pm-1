import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import UCSBRecommendationRequestsIndexPage from "main/pages/UCSBRecommendationRequests/UCSBRecommendationRequestsIndexPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import mockConsole from "jest-mock-console";
import { recommendationrequestsFixtures } from "fixtures/ucsbRecommendationRequestsFixtures";

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

describe("RecommendationRequestsIndexPage tests", () => {

    const axiosMock = new AxiosMockAdapter(axios);

    const testId = "RecommendationRequestsTable";

    const setupUserOnly = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    };

    const setupAdminUser = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.adminUser);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    };



    test("Renders with Create Button for admin user", async () => {
        setupAdminUser();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/ucsbrecommendationrequests/all").reply(200, []);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <UCSBRecommendationRequestsIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(screen.getByText(/Create UCSBRecommendationRequests/)).toBeInTheDocument();
        });
        const button = screen.getByText(/Create UCSBRecommendationRequests/);
        expect(button).toHaveAttribute("href", "/ucsbrecommendationrequests/create");
        expect(button).toHaveAttribute("style", "float: right;");
    });

    test("renders three UCSBRecommendationRequests correctly for regular user", async () => {
        setupUserOnly();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/ucsbrecommendationrequests/all").reply(200, recommendationrequestsFixtures.threerecommendationrequests);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <UCSBRecommendationRequestsIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2"); });
        expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("3");
        expect(screen.getByTestId(`${testId}-cell-row-2-col-id`)).toHaveTextContent("4");

        const createRestaurantButton = screen.queryByText("Create UCSBRecommendationRequests");
        expect(createRestaurantButton).not.toBeInTheDocument();

        const requesterEmail = screen.getByText("requester email 3");
        expect(requesterEmail).toBeInTheDocument();

        const professorEmail = screen.getByText("professor email 3");
        expect(professorEmail).toBeInTheDocument();

        const explanation = screen.getByText("explanation 3");
        expect(explanation).toBeInTheDocument();

        const dateRequested = screen.getByText("2022-05-02T12:00:00");
        expect(dateRequested).toBeInTheDocument();

        const dateNeeded = screen.getByText("2022-06-02T12:00:00");
        expect(dateNeeded).toBeInTheDocument();

        // for non-admin users, details button is visible, but the edit and delete buttons should not be visible
        expect(screen.queryByTestId("UCSBRecommendationRequestsTable-cell-row-0-col-Delete-button")).not.toBeInTheDocument();
        expect(screen.queryByTestId("UCSBRecommendationRequestsTable-cell-row-0-col-Edit-button")).not.toBeInTheDocument();
    });

    test("renders empty table when backend unavailable, user only", async () => {
        setupUserOnly();
        const queryClient = new QueryClient();

        axiosMock.onGet("/api/ucsbrecommendationrequests/all").timeout();

        const restoreConsole = mockConsole();

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <UCSBRecommendationRequestsIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1); });
        
        const errorMessage = console.error.mock.calls[0][0];
        expect(errorMessage).toMatch("Error communicating with backend via GET on /api/ucsbrecommendationrequests/all");
        restoreConsole();

    });

    test("what happens when you click delete, admin", async () => {
        setupAdminUser();
        const queryClient = new QueryClient();

        axiosMock.onGet("/api/ucsbrecommendationrequests/all").reply(200, recommendationrequestsFixtures.threerecommendationrequests);
        axiosMock.onDelete("/api/ucsbrecommendationrequests").reply(200, "recommendationrequests with id 1 was deleted");


        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <UCSBRecommendationRequestsIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toBeInTheDocument(); });

        expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2");


        const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
        expect(deleteButton).toBeInTheDocument();

        fireEvent.click(deleteButton);

        await waitFor(() => { expect(mockToast).toBeCalledWith("recommendationrequests with id 1 was deleted") });

        await waitFor(() => { expect(axiosMock.history.delete.length).toBe(1); });
        expect(axiosMock.history.delete[0].url).toBe("/api/ucsbrecommendationrequests");
        expect(axiosMock.history.delete[0].url).toBe("/api/ucsbrecommendationrequests");
        expect(axiosMock.history.delete[0].params).toEqual({ id: 2 });
    });

});


