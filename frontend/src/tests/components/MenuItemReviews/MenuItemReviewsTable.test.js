import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { menuItemReviewsFixtures } from "fixtures/menuItemReviewsFixtures";
import MenuItemReviewsTable from "main/components/MenuItemReviews/MenuItemReviewsTable";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { currentUserFixtures } from "fixtures/currentUserFixtures";


const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("MenuItemReviewsTable tests", () => {
    const queryClient = new QueryClient();

    const expectedHeaders = ["id", "itemId", "reviewerEmail", "stars", "comments", "dateReviewed"];
    const expectedFields = ["id", "itemId", "reviewerEmail", "stars", "comments", "dateReviewed"];
    const testId = "MenuItemReviewsTable";

    test("Has the expected column headers and content for ordinary user", () => {

        const currentUser = currentUserFixtures.userOnly;

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MenuItemReviewsTable menuItemReviews={menuItemReviewsFixtures.threeMenuItemReviews} currentUser={currentUser} />
                </MemoryRouter>
            </QueryClientProvider>

        );

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

        expectedFields.forEach((field) => {
            const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
            expect(header).toBeInTheDocument();
        });

        expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2");
        expect(screen.getByTestId(`${testId}-cell-row-0-col-itemId`)).toHaveTextContent("10");
        expect(screen.getByTestId(`${testId}-cell-row-0-col-reviewerEmail`)).toHaveTextContent("pmanopchantaroj@ucsb.edu");
        expect(screen.getByTestId(`${testId}-cell-row-0-col-stars`)).toHaveTextContent("5");
        expect(screen.getByTestId(`${testId}-cell-row-0-col-dateReviewed`)).toHaveTextContent("2023-11-11T12:34");
        expect(screen.getByTestId(`${testId}-cell-row-0-col-comments`)).toHaveTextContent("Best roast beef I've ever had");

        expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("3");
        expect(screen.getByTestId(`${testId}-cell-row-1-col-itemId`)).toHaveTextContent("20");
        expect(screen.getByTestId(`${testId}-cell-row-1-col-reviewerEmail`)).toHaveTextContent("pmanopchantaroj@ucsb.edu");
        expect(screen.getByTestId(`${testId}-cell-row-1-col-stars`)).toHaveTextContent("3");
        expect(screen.getByTestId(`${testId}-cell-row-1-col-dateReviewed`)).toHaveTextContent("2024-04-04T05:55");
        expect(screen.getByTestId(`${testId}-cell-row-1-col-comments`)).toHaveTextContent("Decent spaghetti carbonara");

        expect(screen.queryByText("Delete")).not.toBeInTheDocument();
        expect(screen.queryByText("Edit")).not.toBeInTheDocument();
    });

    test("Has the expected column headers and content for adminUser", () => {

        const currentUser = currentUserFixtures.adminUser;

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MenuItemReviewsTable menuItemReviews={menuItemReviewsFixtures.threeMenuItemReviews} currentUser={currentUser} />
                </MemoryRouter>
            </QueryClientProvider>

        );

        const expectedHeaders = ["id", "itemId", "reviewerEmail", "stars", "comments", "dateReviewed"];
        const expectedFields = ["id", "itemId", "reviewerEmail", "stars", "comments", "dateReviewed"];
        const testId = "MenuItemReviewsTable";

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

        expectedFields.forEach((field) => {
            const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
            expect(header).toBeInTheDocument();
        });

        expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2");
        expect(screen.getByTestId(`${testId}-cell-row-0-col-itemId`)).toHaveTextContent("10");
        expect(screen.getByTestId(`${testId}-cell-row-0-col-reviewerEmail`)).toHaveTextContent("pmanopchantaroj@ucsb.edu");
        expect(screen.getByTestId(`${testId}-cell-row-0-col-stars`)).toHaveTextContent("5");
        expect(screen.getByTestId(`${testId}-cell-row-0-col-dateReviewed`)).toHaveTextContent("2023-11-11T12:34");
        expect(screen.getByTestId(`${testId}-cell-row-0-col-comments`)).toHaveTextContent("Best roast beef I've ever had");

        expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("3");
        expect(screen.getByTestId(`${testId}-cell-row-1-col-itemId`)).toHaveTextContent("20");
        expect(screen.getByTestId(`${testId}-cell-row-1-col-reviewerEmail`)).toHaveTextContent("pmanopchantaroj@ucsb.edu");
        expect(screen.getByTestId(`${testId}-cell-row-1-col-stars`)).toHaveTextContent("3");
        expect(screen.getByTestId(`${testId}-cell-row-1-col-dateReviewed`)).toHaveTextContent("2024-04-04T05:55");
        expect(screen.getByTestId(`${testId}-cell-row-1-col-comments`)).toHaveTextContent("Decent spaghetti carbonara");

        const editButton = screen.getByTestId(`${testId}-cell-row-0-col-Edit-button`);
        expect(editButton).toBeInTheDocument();
        expect(editButton).toHaveClass("btn-primary");

        const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
        expect(deleteButton).toBeInTheDocument();
        expect(deleteButton).toHaveClass("btn-danger");

    });

    test("Edit button navigates to the edit page for admin user", async () => {

        const currentUser = currentUserFixtures.adminUser;

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MenuItemReviewsTable menuItemReviews={menuItemReviewsFixtures.threeMenuItemReviews} currentUser={currentUser} />
                </MemoryRouter>
            </QueryClientProvider>

        );

        expect(await screen.findByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2");
        expect(screen.getByTestId(`${testId}-cell-row-0-col-itemId`)).toHaveTextContent("10");
        expect(screen.getByTestId(`${testId}-cell-row-0-col-reviewerEmail`)).toHaveTextContent("pmanopchantaroj@ucsb.edu");
        expect(screen.getByTestId(`${testId}-cell-row-0-col-stars`)).toHaveTextContent("5");
        expect(screen.getByTestId(`${testId}-cell-row-0-col-dateReviewed`)).toHaveTextContent("2023-11-11T12:34");
        expect(screen.getByTestId(`${testId}-cell-row-0-col-comments`)).toHaveTextContent("Best roast beef I've ever had");

        const editButton = screen.getByTestId(`MenuItemReviewsTable-cell-row-0-col-Edit-button`);
        expect(editButton).toBeInTheDocument();

        fireEvent.click(editButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith('/menuitemreviews/edit/2'));

    });
    test("Delete button calls delete callback", async () => {
        // arrange
        const currentUser = currentUserFixtures.adminUser;

        // act - render the component
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MenuItemReviewsTable menuItemReviews={menuItemReviewsFixtures.threeMenuItemReviews} currentUser={currentUser} />
                </MemoryRouter>
            </QueryClientProvider>
        );

        // assert - check that the expected content is rendered
        expect(await screen.findByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2");
        expect(screen.getByTestId(`${testId}-cell-row-0-col-itemId`)).toHaveTextContent("10");
        expect(screen.getByTestId(`${testId}-cell-row-0-col-reviewerEmail`)).toHaveTextContent("pmanopchantaroj@ucsb.edu");
        expect(screen.getByTestId(`${testId}-cell-row-0-col-stars`)).toHaveTextContent("5");
        expect(screen.getByTestId(`${testId}-cell-row-0-col-dateReviewed`)).toHaveTextContent("2023-11-11T12:34");
        expect(screen.getByTestId(`${testId}-cell-row-0-col-comments`)).toHaveTextContent("Best roast beef I've ever had");


        const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
        expect(deleteButton).toBeInTheDocument();

        // act - click the delete button
        fireEvent.click(deleteButton);
    });

});

