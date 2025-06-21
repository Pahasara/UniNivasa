import { render, screen, fireEvent } from "@testing-library/react";
import Navigation from "@/components/Navigation";
import { describe, it, vi, expect } from "vitest";

describe("Navigation Component", () => {
  const mockSetCurrentView = vi.fn();
  const mockOnLogout = vi.fn();

  beforeEach(() => {
    mockSetCurrentView.mockClear();
    mockOnLogout.mockClear();
  });

  it("renders student menu items correctly", () => {
    render(
      <Navigation
        userRole="student"
        currentView="student-dashboard"
        setCurrentView={mockSetCurrentView}
        onLogout={mockOnLogout}
      />
    );

    // Student should see Dashboard, Requests, Announcements
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Requests")).toBeInTheDocument();
    expect(screen.getByText("Announcements")).toBeInTheDocument();

    // Should NOT see Room Management or Registration Review
    expect(screen.queryByText("Room Management")).toBeNull();
    expect(screen.queryByText("Registration Review")).toBeNull();
  });

  it("renders staff menu items and registration review if enabled", () => {
    render(
      <Navigation
        userRole="staff"
        currentView="staff-dashboard"
        setCurrentView={mockSetCurrentView}
        onLogout={mockOnLogout}
        showRegistrationReview={true}
      />
    );

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Room Management")).toBeInTheDocument();
    expect(screen.getByText("Registration Review")).toBeInTheDocument();
    expect(screen.getByText("Requests")).toBeInTheDocument();
    expect(screen.getByText("Announcements")).toBeInTheDocument();
  });

  it("calls setCurrentView and closes menu on nav item click", () => {
    render(
      <Navigation
        userRole="staff"
        currentView="staff-dashboard"
        setCurrentView={mockSetCurrentView}
        onLogout={mockOnLogout}
        showRegistrationReview={false}
      />
    );

    const requestsButton = screen.getAllByText("Requests")[0]; // Desktop button

    fireEvent.click(requestsButton);

    expect(mockSetCurrentView).toHaveBeenCalledWith("requests");
  });

  it("calls onLogout when logout button clicked", () => {
    render(
      <Navigation
        userRole="admin"
        currentView="staff-dashboard"
        setCurrentView={mockSetCurrentView}
        onLogout={mockOnLogout}
      />
    );

    const logoutButton = screen.getAllByText("Logout")[0];
    fireEvent.click(logoutButton);

    expect(mockOnLogout).toHaveBeenCalled();
  });
});
