import { render, screen, waitFor } from "@testing-library/react";
import StudentDashboard from "@/components/StudentDashboard";
import { vi } from "vitest";

// ──────── Mocks ──────── //
vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: vi.fn() }),
}));

vi.mock("@/components/ui/card", () => ({
  Card: ({ children }: any) => <div data-testid="Card">{children}</div>,
  CardHeader: ({ children }: any) => <div>{children}</div>,
  CardTitle: ({ children }: any) => <h2>{children}</h2>,
  CardContent: ({ children }: any) => <div>{children}</div>,
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, onClick }: any) => (
    <button onClick={onClick}>{children}</button>
  ),
}));

vi.mock("@/components/ui/dialog", () => ({
  Dialog: ({ children }: any) => <div>{children}</div>,
  DialogHeader: ({ children }: any) => <div>{children}</div>,
  DialogTitle: ({ children }: any) => <h3>{children}</h3>,
  DialogContent: ({ children }: any) => <div>{children}</div>,
}));

// ──────── Supabase Mock ──────── //
vi.mock("@/integrations/supabase/client", () => {
  return {
    supabase: {
      auth: {
        getUser: vi.fn(() => ({
          data: { user: { id: "123" } },
          error: null,
        })),
      },
      from: vi.fn((table: string) => {
        if (table === "student_registrations") {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                maybeSingle: vi.fn(() => ({
                  data: {
                    full_name: "Shinzo Dev",
                    id_number: "202112345",
                    phone: "0771234567",
                    academic_year: 3,
                    status: "approved",
                    graduation_status: "Active",
                  },
                  error: null,
                })),
              })),
            })),
          };
        }

        if (table === "room_assignments") {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                eq: vi.fn(() => ({
                  maybeSingle: vi.fn(() => ({
                    data: {
                      rooms: {
                        room_number: "101",
                        floor: "2",
                        room_type: "Triple",
                        room_size: "Large",
                        max_occupancy: 3,
                        current_occupancy: 1,
                        condition: "Good",
                      },
                    },
                    error: null,
                  })),
                })),
              })),
            })),
          };
        }

        return { select: vi.fn() }; // fallback
      }),
    },
  };
});

// ──────── Test ──────── //
describe("StudentDashboard", () => {
  it("renders dashboard after loading with correct name", async () => {
    render(<StudentDashboard />);

    await waitFor(() => {
      expect(
        screen.getByText((content) => content.includes("Welcome Back, Shinzo"))
      ).toBeInTheDocument();
    });

    expect(screen.getByText("Room Assignment")).toBeInTheDocument();
  });
});
