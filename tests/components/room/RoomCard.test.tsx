import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import RoomCard from "@/components/room/RoomCard";
import { vi } from "vitest";

vi.mock("@/components/room/StudentAssignDialog", () => ({
  __esModule: true,
  default: () => <div data-testid="StudentAssignDialog">Mock Dialog</div>,
}));

const baseRoom = {
  id: "1",
  room_number: "101",
  floor: "1",
  room_type: "Double",
  room_size: "Medium",
  status: "Vacant",
  condition: "Good",
  current_occupancy: 1,
  max_occupancy: 2,
};

const mockProps = {
  room: baseRoom,
  students: [],
  selectedStudent: "",
  showAssignDialog: true,
  selectedRoomId: "1",
  onSelectedStudentChange: vi.fn(),
  onAssignStudent: vi.fn(),
  onDialogOpenChange: vi.fn(),
  onRoomSelect: vi.fn(),
};

describe("RoomCard", () => {
  it("renders all room info", () => {
    render(<RoomCard {...mockProps} />);
    expect(screen.getByText("101")).toBeInTheDocument();
    expect(screen.getByText("Vacant")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument(); // floor
    expect(screen.getByText("Double")).toBeInTheDocument();
    expect(screen.getByText("Medium")).toBeInTheDocument();
    expect(screen.getByText("1/2")).toBeInTheDocument();
    expect(screen.getByText("Good")).toBeInTheDocument();
  });

  it("shows StudentAssignDialog when room is not full or under maintenance", () => {
    render(<RoomCard {...mockProps} />);
    expect(screen.getByTestId("StudentAssignDialog")).toBeInTheDocument();
  });

  it("shows 'Room is at maximum capacity' when status is Full", () => {
    const fullRoom = { ...baseRoom, status: "Full", current_occupancy: 2 };
    render(<RoomCard {...mockProps} room={fullRoom} />);
    expect(screen.getByText("Room is at maximum capacity")).toBeInTheDocument();
  });

  it("does not show StudentAssignDialog if room is under Maintenance", () => {
    const maintenanceRoom = {
      ...baseRoom,
      status: "Maintenance",
      current_occupancy: 1,
    };
    render(<RoomCard {...mockProps} room={maintenanceRoom} />);
    expect(screen.queryByTestId("StudentAssignDialog")).not.toBeInTheDocument();
  });
});
