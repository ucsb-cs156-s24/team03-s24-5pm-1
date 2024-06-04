import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import UCSBOrganizationsEditPage from "main/pages/UCSBOrganizations/UCSBOrganizationsEditPage";
// import UCSBOrganizationsForm from "components\UCSBOrganizations\UCSBOrganizationsForm.test.js";

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
            orgCode: "SKY"
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("UCSBOrganizationsEditPage tests", () => {

    describe("when the backend doesn't return data", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/UCSBOrganizations", { params: { orgCode: "SKY" } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <UCSBOrganizationsEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await screen.findByText("Edit UCSBOrganizations");
            expect(screen.queryByTestId("UCSBOrganizations-orgTranslationShort")).not.toBeInTheDocument();
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
            axiosMock.onGet("/api/UCSBOrganizations", { params: { orgCode: "SKY" } }).reply(200, {
                orgCode: "SKY",
                orgTranslationShort: "SKYDIVING CLUB",
                orgTranslation: "SKYDIVING CLUB AT UCSB",
                inactive: false
            });
            axiosMock.onPut('/api/UCSBOrganizations').reply(200, {
                orgCode: "SKY",
                orgTranslationShort: "SKYDIVING CLUB World Class",
                orgTranslation: "Really Great SKYDIVING CLUB AT UCSB",
                inactive: true
            });
        });

        const queryClient = new QueryClient();
    
        test("Is populated with the data provided", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <UCSBOrganizationsEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("UCSBOrganizationsForm-orgCode");

            const orgCodeField = screen.getByTestId("UCSBOrganizationsForm-orgCode");
            const orgTranslationShortField = screen.getByTestId("UCSBOrganizationsForm-orgTranslationShort");
            const orgTranslationField = screen.getByTestId("UCSBOrganizationsForm-orgTranslation");
            const inactiveField = screen.getByTestId("UCSBOrganizationsForm-inactive");
            const submitButton = screen.getByTestId("UCSBOrganizationsForm-submit");


            expect(orgCodeField).toBeInTheDocument();
            expect(orgCodeField).toHaveValue("SKY");
            expect(orgTranslationShortField).toBeInTheDocument();
            expect(orgTranslationShortField).toHaveValue("SKYDIVING CLUB");
            expect(orgTranslationField).toBeInTheDocument();
            expect(orgTranslationField).toHaveValue("SKYDIVING CLUB AT UCSB");
            expect(inactiveField).toBeInTheDocument();
            expect(inactiveField).toHaveValue("false");

            expect(submitButton).toHaveTextContent("Update");

            fireEvent.change(orgTranslationShortField, { target: { value: 'SKYDIVING CLUB World Class' } });
            fireEvent.change(orgTranslationField, { target: { value: 'GREAT SKYDIVING CLUB' } });
            fireEvent.change(inactiveField, { target: { value: true } });
            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("New org Created - orgCode: SKY orgTranslationShort: SKYDIVING CLUB World Class orgTranslation: Really Great SKYDIVING CLUB AT UCSB inactive: true");
            
            expect(mockNavigate).toBeCalledWith({ "to": "/UCSBOrganizations" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ orgCode: 'SKY' });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                orgTranslationShort: 'SKYDIVING CLUB World Class',
                orgTranslation: 'GREAT SKYDIVING CLUB',
                inactive: 'true'
            })); // posted object


        });

        test("Changes when you click Update", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <UCSBOrganizationsEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("UCSBOrganizationsForm-orgCode");

            const orgCodeField = screen.getByTestId("UCSBOrganizationsForm-orgCode");
            const orgTranslationShortField = screen.getByTestId("UCSBOrganizationsForm-orgTranslationShort");
            const orgTranslationField = screen.getByTestId("UCSBOrganizationsForm-orgTranslation");
            const inactiveField = screen.getByTestId("UCSBOrganizationsForm-inactive");

            const submitButton = screen.getByTestId("UCSBOrganizationsForm-submit");

            expect(orgCodeField).toHaveValue("SKY");
            expect(orgTranslationShortField).toHaveValue("SKYDIVING CLUB");
            expect(orgTranslationField).toHaveValue("SKYDIVING CLUB AT UCSB");
            expect(inactiveField).toHaveValue("false");
            expect(submitButton).toBeInTheDocument();

            fireEvent.change(orgTranslationShortField, { target: { value: 'SKYDIVING CLUB World Class' } })
            fireEvent.change(orgTranslationField, { target: { value: 'GREAT SKYDIVING CLUB' } })
            fireEvent.change(inactiveField, { target: { value: true } })

            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("New org Created - orgCode: SKY orgTranslationShort: SKYDIVING CLUB World Class orgTranslation: Really Great SKYDIVING CLUB AT UCSB inactive: true");
            expect(mockNavigate).toBeCalledWith({ "to": "/UCSBOrganizations" });
        });

       
    });
});