import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("cn()", () => {
  it("merges multiple class names", () => {
    expect(cn("text-sm", "bg-red-500")).toBe("text-sm bg-red-500");
  });

  it("removes falsy values", () => {
    expect(cn("text-sm", undefined, null, false, "")).toBe("text-sm");
  });

  it("handles conditional classes", () => {
    const active = true;
    const isDisabled = false;
    expect(
      cn("text-sm", active && "font-bold", isDisabled && "opacity-50")
    ).toBe("text-sm font-bold");
  });
});
