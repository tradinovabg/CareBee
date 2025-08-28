import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect, vi } from "vitest";
import Sos from "../../src/pages/Sos";

describe("Sos page", () => {
  it("triggers alert when button is clicked", () => {
    const originalAlert = window.alert;
    window.alert = vi.fn();

    render(<Sos />);
    const button = screen.getByRole("button", { name: /sos/i });
    fireEvent.click(button);

    expect(window.alert).toHaveBeenCalledWith("SOS test — кнопка работает");
    window.alert = originalAlert;
  });
});
