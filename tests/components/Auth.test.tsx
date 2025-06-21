import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Auth from "@/components/Auth";
import { vi } from "vitest";

// ──────── Supabase Mock ──────── //
vi.mock("@/integrations/supabase/client", () => {
  const mockSignIn = vi.fn().mockResolvedValue({ error: null });
  const mockSignUp = vi.fn().mockResolvedValue({ error: null });

  return {
    supabase: {
      auth: {
        signInWithPassword: mockSignIn,
        signUp: mockSignUp,
        onAuthStateChange: (cb: any) => {
          cb("SIGNED_IN", {
            user: { id: "user-id", email: "shinzo@example.com" },
            access_token: "token123",
          });

          return {
            data: {
              subscription: {
                unsubscribe: vi.fn(),
              },
            },
          };
        },
        getSession: () =>
          Promise.resolve({
            data: {
              session: {
                user: { id: "user-id", email: "shinzo@example.com" },
              },
            },
          }),
      },
    },
  };
});

// ──────── UI Mocks ──────── //
vi.mock("@/components/ui/card", () => ({
  Card: ({ children }: any) => <div data-testid="Card">{children}</div>,
  CardHeader: ({ children }: any) => <div>{children}</div>,
  CardTitle: ({ children }: any) => <h2>{children}</h2>,
  CardContent: ({ children }: any) => <div>{children}</div>,
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, onClick, type, disabled, className }: any) => (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={className}
    >
      {children}
    </button>
  ),
}));

vi.mock("@/components/ui/input", () => ({
  Input: ({ ...props }: any) => <input {...props} />,
}));

vi.mock("@/components/ui/label", () => ({
  Label: ({ children }: any) => <label>{children}</label>,
}));

vi.mock("@/components/ui/alert", () => ({
  Alert: ({ children }: any) => <div>{children}</div>,
  AlertDescription: ({ children }: any) => <p>{children}</p>,
}));

// ──────── Tests ──────── //
describe("Auth Component", () => {
  it("renders and signs in a user", async () => {
    const onAuthSuccess = vi.fn();

    render(<Auth onAuthSuccess={onAuthSuccess} />);

    await waitFor(() => {
      expect(onAuthSuccess).toHaveBeenCalledWith(
        expect.objectContaining({ id: "user-id" }),
        expect.any(Object)
      );
    });

    fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
      target: { value: "shinzo@example.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("Enter your password"), {
      target: { value: "mypassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });
  });
});
