import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import UCSBDiningCommonsMenuItemEditPage from "main/pages/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemEditPage";

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

describe("UCSBDiningCommonsMenuItemEditPage tests", () => {

    describe("when the backend doesn't return data", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/ucsbmenuitems", { params: { id: 17 } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <UCSBDiningCommonsMenuItemEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await screen.findByText("Edit UCSBDiningCommonsMenuItem");
            expect(screen.queryByTestId("UCSBMenuItemForm-diningCommonsCode")).not.toBeInTheDocument();
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
            axiosMock.onGet("/api/ucsbmenuitems", { params: { id: 17 } }).reply(200, {
                id: 17,
                diningCommonsCode: 'ortega',
                name: "Grilled Turkey Cheddar Sandwich",
                station: "Entrees"
            });
            axiosMock.onPut('/api/ucsbmenuitems').reply(200, {
                id: "17",
                diningCommonsCode: 'ortega',
                name: "Grilled Turkey Cheddar Sandwich",
                station: "Entrees"
            });
        });

        const queryClient = new QueryClient();
        test("renders without crashing", () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <UCSBDiningCommonsMenuItemEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
        });

        test("Is populated with the data provided", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <UCSBDiningCommonsMenuItemEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("UCSBMenuItemForm-diningCommonsCode");

            const idField = screen.getByTestId("UCSBMenuItemForm-id");
            const diningCommonsCodeField = screen.getByTestId("UCSBMenuItemForm-diningCommonsCode");
            const nameField = screen.getByTestId("UCSBMenuItemForm-name");
            const stationField = screen.getByTestId("UCSBMenuItemForm-station");
            const submitButton = screen.getByTestId("UCSBMenuItemForm-submit");

            expect(idField).toHaveValue("17");
            expect(diningCommonsCodeField).toHaveValue("ortega");
            expect(nameField).toHaveValue("Grilled Turkey Cheddar Sandwich");
            expect(stationField).toHaveValue("Entrees");
            expect(submitButton).toBeInTheDocument();
        });

        test("Changes when you click Update", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <UCSBDiningCommonsMenuItemEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("UCSBMenuItemForm-diningCommonsCode");

            const idField = screen.getByTestId("UCSBMenuItemForm-id");
            const diningCommonsCodeField = screen.getByTestId("UCSBMenuItemForm-diningCommonsCode");
            const nameField = screen.getByTestId("UCSBMenuItemForm-name");
            const stationField = screen.getByTestId("UCSBMenuItemForm-station");
            const submitButton = screen.getByTestId("UCSBMenuItemForm-submit");

            expect(idField).toHaveValue("17");
            expect(diningCommonsCodeField).toHaveValue("ortega");
            expect(nameField).toHaveValue("Grilled Turkey Cheddar Sandwich");
            expect(stationField).toHaveValue("Entrees");

            expect(submitButton).toBeInTheDocument();

            fireEvent.change(diningCommonsCodeField, { target: { value: 'ortega' } })
            fireEvent.change(nameField, { target: { value: 'Grilled Turkey Cheddar Sandwich' } })
            fireEvent.change(stationField, { target: { value: "Entrees" } })

            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("UCSBDiningCommonsMenuItem Updated - id: 17 name: Grilled Turkey Cheddar Sandwich");
            expect(mockNavigate).toBeCalledWith({ "to": "/ucsbmenuitems" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                diningCommonsCode: 'ortega',
                name: "Grilled Turkey Cheddar Sandwich",
                station: "Entrees"
            })); // posted object

        });

       
    });
});


