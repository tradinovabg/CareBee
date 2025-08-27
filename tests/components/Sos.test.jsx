import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect } from "vitest";
import Sos from "../../src/components/Sos";

describe("Sos component", () => {
  it("renders SOS button", () => {
    render(<Sos />);
    const button = screen.getByRole("button", { name: /sos/i });
    expect(button).toBeInTheDocument();
  });

  it("opens dialog when clicked", () => {
    render(<Sos />);
    const button = screen.getByRole("button", { name: /sos/i });
    fireEvent.click(button);
    const dialog = screen.getByRole("alertdialog");
    expect(dialog).toBeInTheDocument();
  });
});
