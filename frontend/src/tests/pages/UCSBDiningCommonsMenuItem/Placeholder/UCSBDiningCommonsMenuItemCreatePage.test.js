import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import UCSBDiningCommonsMenuItemCreatePage from "main/pages/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemCreatePage";
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

describe("UCSBDiningCommonsMenuItemCreatePage tests", () => {

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
                    <UCSBDiningCommonsMenuItemCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("when you fill in the form and hit submit, it makes a request to the backend", async () => {

        const queryClient = new QueryClient();
        const ucsbMenuItem = {
            id: 17,
            diningCommonsCode: "ortega",
            name: "Baked Pesto Pasta with Chicken",
            station: "Entrees"
        };

        axiosMock.onPost("/api/ucsbmenuitems/post").reply( 202, ucsbMenuItem );

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <UCSBDiningCommonsMenuItemCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId("UCSBMenuItemForm-diningCommonsCode")).toBeInTheDocument();
        });

        const diningCommonsCodeField = screen.getByTestId("UCSBMenuItemForm-diningCommonsCode");
        const nameField = screen.getByTestId("UCSBMenuItemForm-name");
        const stationField = screen.getByTestId("UCSBMenuItemForm-station");
        const submitButton = screen.getByTestId("UCSBMenuItemForm-submit");

        fireEvent.change(diningCommonsCodeField, { target: { value: 'ortega' } });
        fireEvent.change(nameField, { target: { value: 'Baked Pesto Pasta with Chicken' } });
        fireEvent.change(stationField, { target: { value: 'Entrees' } });

        expect(submitButton).toBeInTheDocument();

        fireEvent.click(submitButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));
        expect(axiosMock.history.post[0].params).toEqual(
            {
            "station": "Entrees",
            "name": "Baked Pesto Pasta with Chicken",
            "diningCommonsCode": "ortega"
        });

        expect(mockToast).toBeCalledWith("New ucsbMenuItem Created - id: 17 name: Baked Pesto Pasta with Chicken");
        expect(mockNavigate).toBeCalledWith({ "to": "/ucsbmenuitems" });
    });
});