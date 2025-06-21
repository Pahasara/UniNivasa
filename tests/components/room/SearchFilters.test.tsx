import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import SearchFilters from "@/components/room/SearchFilters";

describe("SearchFilters", () => {
  const mockHandlers = {
    onSearchTermChange: vi.fn(),
    onFloorFilterChange: vi.fn(),
    onStatusFilterChange: vi.fn(),
  };

  const defaultProps = {
    searchTerm: "101",
    floorFilter: "Ground",
    statusFilter: "Vacant",
    filteredRoomsCount: 2,
    totalRoomsCount: 5,
    ...mockHandlers,
  };

  it("renders all UI elements with correct initial values", () => {
    render(<SearchFilters {...defaultProps} />);

    // Search input
    const searchInput = screen.getByPlaceholderText(
      "Search by room number or floor..."
    );
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveValue("101");

    // Floor select
    expect(screen.getByText("Ground Floor")).toBeInTheDocument();

    // Status select
    expect(screen.getByText("Vacant")).toBeInTheDocument();

    // Filtered/total count text
    expect(screen.getByText("Showing 2 of 5 rooms")).toBeInTheDocument();
  });

  it("calls onSearchTermChange when search input changes", () => {
    render(<SearchFilters {...defaultProps} />);
    const searchInput = screen.getByPlaceholderText(
      "Search by room number or floor..."
    );
    fireEvent.change(searchInput, { target: { value: "202" } });
    expect(mockHandlers.onSearchTermChange).toHaveBeenCalledWith("202");
  });

  it("calls onFloorFilterChange when floor select changes", () => {
    render(<SearchFilters {...defaultProps} />);
    const floorTrigger = screen.getByText("Ground Floor");
    fireEvent.click(floorTrigger);

    // Select an option (simulate user selecting "2nd Floor")
    const option = screen.getByText("2nd Floor");
    fireEvent.click(option);

    expect(mockHandlers.onFloorFilterChange).toHaveBeenCalledWith("2nd");
  });

  it("calls onStatusFilterChange when status select changes", () => {
    render(<SearchFilters {...defaultProps} />);
    const statusTrigger = screen.getByText("Vacant");
    fireEvent.click(statusTrigger);

    // Select an option (simulate user selecting "Full")
    const option = screen.getByText("Full");
    fireEvent.click(option);

    expect(mockHandlers.onStatusFilterChange).toHaveBeenCalledWith("Full");
  });
});
