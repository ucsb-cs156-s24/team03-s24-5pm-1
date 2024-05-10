import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import MenuItemReviewsCreatePage from "main/pages/MenuItemReviews/MenuItemReviewsCreatePage";
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

describe("MenuItemReviewsCreatePage tests", () => {

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
                    <MenuItemReviewsCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("when you fill in the form and hit submit, it makes a request to the backend", async () => {

        const queryClient = new QueryClient();
        const MenuItemReviews = {
            id: 1,
            itemId: 10,
            reviewerEmail: "pmanopchantaroj@ucsb.edu",   
            stars: 1,
            dateReviewed: "2024-05-05T04:44",
            comments: "roast beef is as dry as the desert"
        };

        axiosMock.onPost("/api/menuitemreviews/post").reply( 202, MenuItemReviews );

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MenuItemReviewsCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId("MenuItemReviewsForm-itemId")).toBeInTheDocument();
        });

        const itemIdField = screen.getByTestId("MenuItemReviewsForm-itemId");
        const reviewerEmailField = screen.getByTestId("MenuItemReviewsForm-reviewerEmail");
        const starsField = screen.getByTestId("MenuItemReviewsForm-stars");
        const commentsField = screen.getByTestId("MenuItemReviewsForm-comments");
        const dateReviewedField = screen.getByTestId("MenuItemReviewsForm-dateReviewed");
        const submitButton = screen.getByTestId("MenuItemReviewsForm-submit");

        fireEvent.change(itemIdField, { target: { value: '10' } });
        fireEvent.change(reviewerEmailField, { target: { value: 'pmanopchantaroj@ucsb.edu' } });
        fireEvent.change(starsField, { target: { value: '5' } });
        fireEvent.change(commentsField, { target: { value: 'Best roast beef I have ever had' } });
        fireEvent.change(dateReviewedField, { target: { value: '2023-11-11T12:34' } });

        expect(submitButton).toBeInTheDocument();

        fireEvent.click(submitButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual(
        {
            "itemId": "10",
            "reviewerEmail": "pmanopchantaroj@ucsb.edu",   
            "stars": "5",
            "dateReviewed": "2023-11-11T12:34",
            "comments": "Best roast beef I have ever had"
        });

        expect(mockToast).toBeCalledWith("New menuItemReviews Created - id: 1 itemId: 10  stars: 1");
        expect(mockNavigate).toBeCalledWith({ "to": "/menuitemreviews" });
    });


});


