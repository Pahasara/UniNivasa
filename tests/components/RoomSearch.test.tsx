import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import RoomSearch from "@/components/RoomSearch";
import { vi } from "vitest";

vi.mock("@/hooks/useRoomData", () => ({
    useRoomData: () => ({
        rooms: [],
        students: [],
        loading: false,
        fetchData: vi.fn(),
    }),
}));

vi.mock("@/hooks/useRoomFilters", () => ({
    useRoomFilters: () => ({
        filteredRooms: [],
        searchTerm: "",
        floorFilter: "",
        statusFilter: "",
        setSearchTerm: vi.fn(),
        setFloorFilter: vi.fn(),
        setStatusFilter: vi.fn(),
    }),
}));

vi.mock("@/hooks/use-toast", () => ({
    useToast: () => ({
        toast: vi.fn(),
    }),
}));

vi.mock("@/components/room/SearchFilters", () => ({
    __esModule: true,
    default: () => <div data-testid="SearchFilters">MockFilter</div>,
}));

vi.mock("@/components/room/RoomCard", () => ({
    __esModule: true,
    default: () => <div data-testid="RoomCard">MockCard</div>,
}));

describe("RoomSearch Component", () => {
    it("renders the header and no rooms found message when no rooms match", () => {
        render(<RoomSearch />);

        expect(screen.getByText("Room Management")).toBeInTheDocument();
        expect(
            screen.getByText("Search and manage room assignments")
        ).toBeInTheDocument();
        expect(screen.getByText("No rooms found")).toBeInTheDocument();
    });

    it("renders SearchFilters", () => {
        render(<RoomSearch />);
        expect(screen.getByTestId("SearchFilters")).toBeInTheDocument();
    });
});
