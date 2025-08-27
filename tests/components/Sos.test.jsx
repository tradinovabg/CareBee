import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it } from "vitest";
import Sos from "../../src/components/Sos";

describe("Sos component", () => {
  it("renders button with correct text and styling", () => {
    render(<Sos />);
    const button = screen.getByRole("button", { name: /sos/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("sos-button");
  });

  it("shows notification when button is clicked", () => {
    render(<Sos />);
    const button = screen.getByRole("button", { name: /sos/i });
    fireEvent.click(button);
    const notification = screen.getByTestId("notification");
    expect(notification).toBeInTheDocument();
  });
});
