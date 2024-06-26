import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { helpRequestsFixtures } from "fixtures/helpRequestsFixtures";
import HelpRequestsTable from "main/components/HelpRequests/HelpRequestsTable"
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { currentUserFixtures } from "fixtures/currentUserFixtures";


const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("UserTable tests", () => {
  const queryClient = new QueryClient();

  test("Has the expected column headers and content for ordinary user", () => {

    const currentUser = currentUserFixtures.userOnly;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HelpRequestsTable dates={helpRequestsFixtures.threeDates} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );

    const expectedHeaders = ["id",	"RequesterEmail",	"TeamId",	"tableOrBreakoutRoom",	"Explanation",	"Solved",	"RequestTime"];
    // 
    const expectedFields = ["id",	"requesterEmail",	"teamId",	"tableOrBreakoutRoom",	"explanation",	"solved",	"requestTime"];
    const testId = "HelpRequestsTable";

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("2");

    expect(screen.getByTestId(`${testId}-cell-row-0-col-${expectedFields[1]}`)).toHaveTextContent("test@test.com");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-${expectedFields[2]}`)).toHaveTextContent("team1");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-${expectedFields[3]}`)).toHaveTextContent("table1");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-${expectedFields[4]}`)).toHaveTextContent("explanation1");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-${expectedFields[5]}`)).toHaveTextContent("true");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-${expectedFields[6]}`)).toHaveTextContent("2024-05-15T17:13:00");


    expect(screen.getByTestId(`${testId}-cell-row-1-col-${expectedFields[5]}`)).toHaveTextContent("false");

    /*
    "id": 1,
    "requesterEmail": "test@test.com",
    "teamId": "team1",
    "tableOrBreakoutRoom": "table1",
    "requestTime": "2024-05-15T17:13:00",
    "explanation": "explanation1",
    "solved": true
    */

    const editButton = screen.queryByTestId(`${testId}-cell-row-0-col-Edit-button`);
    expect(editButton).not.toBeInTheDocument();

    const deleteButton = screen.queryByTestId(`${testId}-cell-row-0-col-Delete-button`);
    expect(deleteButton).not.toBeInTheDocument();

  });

  test("Has the expected colum headers and content for adminUser", () => {

    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HelpRequestsTable dates={helpRequestsFixtures.threeDates} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );

    const expectedHeaders = ["id",	"RequesterEmail",	"TeamId",	"tableOrBreakoutRoom",	"Explanation",	"Solved",	"RequestTime"];
    // 
    const expectedFields = ["id",	"requesterEmail",	"teamId",	"tableOrBreakoutRoom",	"explanation",	"solved",	"requestTime"];
    const testId = "HelpRequestsTable";

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("2");

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
          <HelpRequestsTable dates={helpRequestsFixtures.threeDates} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );

    await waitFor(() => { expect(screen.getByTestId(`HelpRequestsTable-cell-row-0-col-id`)).toHaveTextContent("1"); });

    const editButton = screen.getByTestId(`HelpRequestsTable-cell-row-0-col-Edit-button`);
    expect(editButton).toBeInTheDocument();
    
    fireEvent.click(editButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith('/helprequests/edit/1'));

  });

});

