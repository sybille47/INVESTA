import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import App from "./App";
import { useAuth0 } from "@auth0/auth0-react";

vi.mock("@auth0/auth0-react", async () => {
  const actual = await vi.importActual("@auth0/auth0-react");
  return {
    ...actual,
    useAuth0: vi.fn(),
  };
});

vi.mock("./services/fundService", () => {
  return {
    fundService: {
      getFunds: vi.fn().mockResolvedValue([]),
      getFundByIsin: vi
        .fn()
        .mockResolvedValue({ isin: "TEST123", name: "Test Fund" }),
    },
  };
});

describe("Auth0 Authentication Flow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders Log In button when not authenticated", () => {
    useAuth0.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      loginWithRedirect: vi.fn(),
    });

    render(<App />);
    expect(screen.getByText(/Log In/i)).toBeInTheDocument();
  });

  test("calls loginWithRedirect when clicking Log In", () => {
    const mockLogin = vi.fn();
    useAuth0.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      loginWithRedirect: mockLogin,
    });

    render(<App />);
    fireEvent.click(screen.getByText(/Log In/i));
    expect(mockLogin).toHaveBeenCalled();
  });

  test("renders user info and logout button when authenticated", async () => {
    const mockLogout = vi.fn();

    useAuth0.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: {
        name: "John Doe",
        email: "john@example.com",
        sub: "auth0|123456",
      },
      logout: mockLogout,
      // for hook implementations / provide a mock
      getAccessTokenSilently: vi.fn().mockResolvedValue("test-token"),
    });

    render(<App />);
    await waitFor(() => {
      expect(screen.getByText(/Welcome, John Doe!/i)).toBeInTheDocument();
      expect(screen.getByText(/Log Out/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/Log Out/i));
    expect(mockLogout).toHaveBeenCalled();
  });

  test("shows loading screen while Auth0 is loading", () => {
    useAuth0.mockReturnValue({
      isLoading: true,
    });

    render(<App />);
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });
});
test("calls API with valid JWT and shows success alert", async () => {
  const mockToken = "fake-jwt-token";
  const mockAlert = vi.spyOn(window, "alert").mockImplementation(() => {});
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ message: "Profile fetched" }),
    })
  );

  useAuth0.mockReturnValue({
    isAuthenticated: true,
    isLoading: false,
    user: { name: "John Doe", email: "john@example.com", sub: "auth0|123" },
    getAccessTokenSilently: vi.fn().mockResolvedValue(mockToken),
    logout: vi.fn(),
  });

  render(<App />);
  await waitFor(() =>
    expect(screen.getByText(/Test API Call/i)).toBeInTheDocument()
  );
  fireEvent.click(screen.getByText(/Test API Call/i));

  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:3000/api/profile",
      expect.objectContaining({
        headers: { Authorization: `Bearer ${mockToken}` },
      })
    );
  });

  expect(mockAlert).toHaveBeenCalledWith(
    expect.stringContaining("API call successful")
  );
});
