import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import UCSBOrganizationsIndexPage from "main/pages/UCSBOrganizations/UCSBOrganizationsIndexPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import mockConsole from "jest-mock-console";
import { ucsbOrganizationsFixtures } from "fixtures/ucsbOrganizationsFixtures";

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

describe("UCSBOrganizationsIndexPage tests", () => {

    const axiosMock = new AxiosMockAdapter(axios);

    const testorgCode = "UCSBOrganizationsTable";

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


    const queryClient = new QueryClient();

    test("Renders with Create Button for admin user", async () => {
        setupAdminUser();
        axiosMock.onGet("/api/orgs/all").reply(200, []);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <UCSBOrganizationsIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(screen.getByText(/Create UCSBOrganizations/)).toBeInTheDocument();
        });
        const button = screen.getByText(/Create UCSBOrganizations/);
        expect(button).toHaveAttribute("href", "/orgs/create");
        expect(button).toHaveAttribute("style", "float: right;");
    });

    test("renders three restaurants correctly for regular user", async () => {
        setupUserOnly();
        axiosMock.onGet("/api/orgs/all").reply(200, ucsbOrganizationsFixtures.threeUCSBOrganizations);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <UCSBOrganizationsIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(screen.getByTestorgCode(`${testorgCode}-cell-row-0-col-orgCode`)).toHaveTextContent("SKY"); });
        expect(screen.getByTestorgCode(`${testorgCode}-cell-row-1-col-orgCode`)).toHaveTextContent("OSLI");
        expect(screen.getByTestorgCode(`${testorgCode}-cell-row-2-col-orgCode`)).toHaveTextContent("KRC");

        const createUCSBOrganizationsButton = screen.queryByText("Create UCSBOrganizations");
        expect(createUCSBOrganizationsButton).not.toBeInTheDocument();

        const orgTranslationShort = screen.getByText("SKYDIVING CLUB");
        expect(orgTranslationShort).toBeInTheDocument();

        const orgTranslation = screen.getByText("SKYDIVING CLUB AT UCSB, an iconic Isla Vista thing to do");
        expect(orgTranslation).toBeInTheDocument();

        // for non-admin users, details button is visible, but the edit and delete buttons should not be visible
        expect(screen.queryByTestId("UCSBOrganizationsTable-cell-row-0-col-Delete-button")).not.toBeInTheDocument();
        expect(screen.queryByTestId("UCSBOrganizationsTable-cell-row-0-col-Edit-button")).not.toBeInTheDocument();
    });

    test("renders empty table when backend unavailable, user only", async () => {
        setupUserOnly();

        axiosMock.onGet("/api/orgs/all").timeout();

        const restoreConsole = mockConsole();

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <UCSBOrganizationsIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1); });
        
        const errorMessage = console.error.mock.calls[0][0];
        expect(errorMessage).toMatch("Error communicating with backend via GET on /api/orgs/all");
        restoreConsole();

    });

    test("what happens when you click delete, admin", async () => {
        setupAdminUser();

        axiosMock.onGet("/api/orgs/all").reply(200, ucsbOrganizationsFixtures.threeUCSBOrganizations);
        axiosMock.onDelete("/api/orgs").reply(200, "UCSBOrganizations with orgCode ZPR was deleted");


        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <UCSBOrganizationsIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(screen.getByTestorgCode(`${testorgCode}-cell-row-0-col-orgCode`)).toBeInTheDocument(); });

        expect(screen.getByTestorgCode(`${testorgCode}-cell-row-0-col-orgCode`)).toHaveTextContent("SKY");


        const deleteButton = screen.getByTestorgCode(`${testorgCode}-cell-row-0-col-Delete-button`);
        expect(deleteButton).toBeInTheDocument();

        fireEvent.click(deleteButton);

        await waitFor(() => { expect(mockToast).toBeCalledWith("UCSBOrganizations with orgCode ZPR was deleted") });

        await waitFor(() => { expect(axiosMock.history.delete.length).toBe(1); });
        expect(axiosMock.history.delete[0].url).toBe("/api/orgs");
        expect(axiosMock.history.delete[0].url).toBe("/api/orgs");
        expect(axiosMock.history.delete[0].params).toEqual({ orgCode: "SKY" });
    });

});


