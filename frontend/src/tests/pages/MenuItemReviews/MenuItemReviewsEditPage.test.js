import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import MenuItemReviewsEditPage from "main/pages/MenuItemReviews/MenuItemReviewsEditPage";

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
            id: 3
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("MenuItemReviewsEditPage tests", () => {

    describe("when the backend doesn't return data", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/menuitemreviews", { params: { id: 3 } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <MenuItemReviewsEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await screen.findByText("Edit MenuItemReviews");
            expect(screen.queryByTestId("MenuItemReviewsForm-itemId")).not.toBeInTheDocument();
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
            axiosMock.onGet("/api/menuitemreviews", { params: { id: 3 } }).reply(200, {
                id: 3,
                itemId: 20,
                reviewerEmail: "pmanopchantaroj@ucsb.edu",   
                stars: 3,
                dateReviewed: "2024-04-04T05:55",
                comments: "Decent spaghetti carbonara"
            });
            axiosMock.onPut('/api/menuitemreviews').reply(200, {
                id: 3,
                itemId: 20,
                reviewerEmail: "pmanopchantaroj@ucsb.edu",   
                stars: 4,
                dateReviewed: "2024-04-04T05:55",
                comments: "One of the better food options here"
            });
        });

        const queryClient = new QueryClient();
        test("renders without crashing", () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <MenuItemReviewsEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
        });

        test("Is populated with the data provided", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <MenuItemReviewsEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("MenuItemReviewsForm-itemId");

            const itemIdField = screen.getByTestId("MenuItemReviewsForm-itemId");
            const reviewerEmailField = screen.getByTestId("MenuItemReviewsForm-reviewerEmail");
            const starsField = screen.getByTestId("MenuItemReviewsForm-stars");
            const commentsField = screen.getByTestId("MenuItemReviewsForm-comments");
            const dateReviewedField = screen.getByTestId("MenuItemReviewsForm-dateReviewed");
            const submitButton = screen.getByTestId("MenuItemReviewsForm-submit");

            expect(itemIdField).toHaveValue(20);
            expect(reviewerEmailField).toHaveValue("pmanopchantaroj@ucsb.edu");
            expect(starsField).toHaveValue(3);
            expect(commentsField).toHaveValue("Decent spaghetti carbonara");
            expect(dateReviewedField).toHaveValue("2024-04-04T05:55");
            expect(submitButton).toBeInTheDocument();
        });

        test("Changes when you click Update", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <MenuItemReviewsEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("MenuItemReviewsForm-itemId");

            const itemIdField = screen.getByTestId("MenuItemReviewsForm-itemId");
            const reviewerEmailField = screen.getByTestId("MenuItemReviewsForm-reviewerEmail");
            const starsField = screen.getByTestId("MenuItemReviewsForm-stars");
            const commentsField = screen.getByTestId("MenuItemReviewsForm-comments");
            const dateReviewedField = screen.getByTestId("MenuItemReviewsForm-dateReviewed");
            const submitButton = screen.getByTestId("MenuItemReviewsForm-submit");

            expect(itemIdField).toHaveValue(20);
            expect(reviewerEmailField).toHaveValue("pmanopchantaroj@ucsb.edu");
            expect(starsField).toHaveValue(3);
            expect(commentsField).toHaveValue("Decent spaghetti carbonara");
            expect(dateReviewedField).toHaveValue("2024-04-04T05:55");
            expect(submitButton).toBeInTheDocument();


            fireEvent.change(itemIdField, { target: { value: '20' } });
            fireEvent.change(reviewerEmailField, { target: { value: 'pmanopchantaroj@ucsb.edu' } });
            fireEvent.change(starsField, { target: { value: '4' } });
            fireEvent.change(commentsField, { target: { value: 'One of the better food options here' } });
            fireEvent.change(dateReviewedField, { target: { value: '2024-04-04T05:55' } });

            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("New menuItemReviews Created - id: 3 itemId: 20  stars: 4");
            expect(mockNavigate).toBeCalledWith({ "to": "/menuitemreviews" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: 3 });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                itemId: 20,
                reviewerEmail: "pmanopchantaroj@ucsb.edu",   
                stars: "4",
                dateReviewed: "2024-04-04T05:55",
                comments: "One of the better food options here"
            })); // posted object

        });

       
    });
});


