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

    expect(screen.getByText("Name is required")).toBeInTheDocument();
    expect(screen.getByText("Email is required")).toBeInTheDocument();
    expect(screen.getByText("Password is required")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("disables controls and shows loading label while submitting", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn(async () => await new Promise<void>((resolve) => setTimeout(resolve, 100)));
    render(<RegisterForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText("Name"), "janedoe");
    await user.type(screen.getByLabelText("Email"), "jane@example.com");
    await user.type(screen.getByLabelText("Password", { exact: true }), "secret1");
    await user.click(screen.getByRole("button", { name: "Create account" }));

    expect(screen.getByRole("button", { name: "Creating account..." })).toBeDisabled();
    expect(screen.getByLabelText("Name")).toBeDisabled();
    expect(screen.getByLabelText("Email")).toBeDisabled();
    expect(screen.getByLabelText("Password", { exact: true })).toBeDisabled();
  });

  it("submits trimmed name and fields when valid", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<RegisterForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText("Name"), "  janedoe  ");
    await user.type(screen.getByLabelText("Email"), "jane@example.com");
    await user.type(screen.getByLabelText("Password", { exact: true }), "secret1");
    await user.click(screen.getByRole("button", { name: "Create account" }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith({
      name: "janedoe",
      email: "jane@example.com",
      password: "secret1",
    });
  });

  it("shows server error when provided", () => {
    render(<RegisterForm onSubmit={vi.fn()} serverError="Email taken." />);
    expect(screen.getByTestId("register-error")).toHaveTextContent("Email taken.");
  });

  it("marks inputs as required for assistive technology", () => {
    render(<RegisterForm onSubmit={vi.fn()} />);

    expect(screen.getByLabelText("Name")).toBeRequired();
    expect(screen.getByLabelText("Email")).toBeRequired();
    expect(screen.getByLabelText("Password", { exact: true })).toBeRequired();
  });
});
