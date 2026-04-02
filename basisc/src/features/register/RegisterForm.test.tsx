import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { RegisterForm } from "./RegisterForm";

describe("RegisterForm", () => {
  it("shows validation errors after submit", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<RegisterForm onSubmit={onSubmit} />);

    await user.click(screen.getByRole("button", { name: "Create account" }));

    expect(screen.getByText("Username is required")).toBeInTheDocument();
    expect(screen.getByText("Email is required")).toBeInTheDocument();
    expect(screen.getByText("Password is required")).toBeInTheDocument();
    expect(screen.getByText("Please confirm your password")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("disables controls and shows loading label while submitting", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn(async () => await new Promise<void>((resolve) => setTimeout(resolve, 100)));
    render(<RegisterForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText("Username"), "janedoe");
    await user.type(screen.getByLabelText("Email"), "jane@example.com");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.type(screen.getByLabelText("Confirm password"), "password123");
    await user.click(screen.getByRole("button", { name: "Create account" }));

    expect(screen.getByRole("button", { name: "Creating account..." })).toBeDisabled();
    expect(screen.getByLabelText("Username")).toBeDisabled();
    expect(screen.getByLabelText("Email")).toBeDisabled();
    expect(screen.getByLabelText("Password")).toBeDisabled();
    expect(screen.getByLabelText("Confirm password")).toBeDisabled();
  });

  it("submits trimmed username and all fields when valid", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<RegisterForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText("Username"), "  janedoe  ");
    await user.type(screen.getByLabelText("Email"), "jane@example.com");
    await user.type(screen.getByLabelText("Password", { exact: true }), "password123");
    await user.type(screen.getByLabelText("Confirm password"), "password123");
    await user.click(screen.getByRole("button", { name: "Create account" }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith({
      username: "janedoe",
      email: "jane@example.com",
      password: "password123",
      confirmPassword: "password123",
    });
  });

  it("shows password mismatch error and does not submit", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<RegisterForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText("Username"), "janedoe");
    await user.type(screen.getByLabelText("Email"), "jane@example.com");
    await user.type(screen.getByLabelText("Password", { exact: true }), "password123");
    await user.type(screen.getByLabelText("Confirm password"), "password124");
    await user.click(screen.getByRole("button", { name: "Create account" }));

    expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("marks inputs as required for assistive technology", () => {
    render(<RegisterForm onSubmit={vi.fn()} />);

    expect(screen.getByLabelText("Username")).toBeRequired();
    expect(screen.getByLabelText("Email")).toBeRequired();
    expect(screen.getByLabelText("Password", { exact: true })).toBeRequired();
    expect(screen.getByLabelText("Confirm password")).toBeRequired();
  });
});
