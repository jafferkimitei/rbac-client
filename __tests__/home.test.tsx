import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

describe("Home page", () => {
  it("renders title", () => {
    render(<Home />);
    expect(screen.getByText(/Role-Based Admin Platform/i)).toBeInTheDocument();
  });
});
