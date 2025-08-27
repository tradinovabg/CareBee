codex/add-tests-for-sos-component-onc6ne
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, test, expect } from 'vitest';
import Sos from '../../src/pages/Sos.jsx';

test('renders SOS button with correct text and styling', () => {
  render(<Sos />);
  const button = screen.getByRole('button', { name: /sos/i });
  expect(button).toBeInTheDocument();
  expect(button).toHaveTextContent('SOS');
  expect(button).toHaveStyle({ background: '#dc2626' });
});

test('clicking the button triggers notification', () => {
  const alertMock = vi.fn();
  window.alert = alertMock;
  render(<Sos />);
  const button = screen.getByRole('button', { name: /sos/i });
  fireEvent.click(button);
  expect(alertMock).toHaveBeenCalled();
=======
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
main
});
